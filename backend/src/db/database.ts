import Database from 'better-sqlite3';
import type { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import { Category, Definition, Word } from '../types/dictionary';

// Use in-memory database for tests, file database for production
const isTest = process.env.NODE_ENV === 'test';
const dbPath = isTest ? ':memory:' : path.join(__dirname, '../../dictionary.db');

let testDb: DatabaseType | null = null;

// Function to get database connection
const getDb = () => {
  if (isTest) {
    if (!testDb) {
      testDb = new Database(dbPath);
      initDb(testDb);
    }
    return testDb;
  }
  
  const db = new Database(dbPath);
  initDb(db);
  return db;
};

// Initialize database tables
const initDb = (db: DatabaseType) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      parentId TEXT,
      icon TEXT,
      FOREIGN KEY (parentId) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS icons (
      categoryId TEXT PRIMARY KEY,
      iconData TEXT NOT NULL,
      FOREIGN KEY (categoryId) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS words (
      id TEXT PRIMARY KEY,
      term TEXT NOT NULL,
      definition TEXT NOT NULL,
      category TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (category) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS definitions (
      id TEXT PRIMARY KEY,
      categoryId TEXT NOT NULL,
      term TEXT NOT NULL,
      definition TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (categoryId) REFERENCES categories(id)
    );
  `);
};

interface IconRow {
  categoryId: string;
  iconData: string;
}

// Function to reset test database
export const resetTestDb = () => {
  if (isTest && testDb) {
    testDb.exec(`
      DELETE FROM words;
      DELETE FROM definitions;
      DELETE FROM icons;
      DELETE FROM categories;
    `);
  }
};

export const dbService = {
  db: new Database('dictionary.db'),
  // Categories
  getAllCategories: (): Category[] => {
    const db = getDb();
    const results = db.prepare('SELECT * FROM categories').all() as Category[];
    if (!isTest) db.close();
    return results;
  },

  saveCategories: (categories: Category[]): void => {
    const db = getDb();
    const insertCategory = db.prepare(
      'INSERT OR REPLACE INTO categories (id, name, description, parentId, icon) VALUES (?, ?, ?, ?, ?)'
    );

    const saveTransaction = db.transaction((cats: Category[]) => {
      for (const category of cats) {
        insertCategory.run(category.id, category.name, category.description, category.parentId || null, category.icon || null);
      }
    });

    saveTransaction(categories);
    if (!isTest) db.close();
  },

  // Definitions
  getDefinitions: (categoryId?: string): Definition[] => {
    const db = getDb();
    const query = categoryId
      ? db.prepare('SELECT * FROM definitions WHERE categoryId = ? ORDER BY updatedAt DESC')
      : db.prepare('SELECT * FROM definitions ORDER BY updatedAt DESC');
    
    const results = (categoryId ? query.all(categoryId) : query.all()) as any[];
    
    // Parse arrays stored as JSON
    const definitions = results.map(def => ({
      ...def,
      examples: def.examples ? JSON.parse(def.examples) : [],
      tags: def.tags ? JSON.parse(def.tags) : []
    }));

    if (!isTest) db.close();
    return definitions;
  },

  saveDefinition: (definition: Definition): void => {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO definitions 
      (id, categoryId, term, definition, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      definition.id,
      definition.categoryId,
      definition.term,
      definition.definition,
      definition.createdAt,
      definition.updatedAt
    );

    if (!isTest) db.close();
  },

  deleteDefinition: (id: string): void => {
    const db = getDb();
    db.prepare('DELETE FROM definitions WHERE id = ?').run(id);
    if (!isTest) db.close();
  },

  // Icons
  saveIcon: async (categoryId: string, iconData: string): Promise<string> => {
    const db = getDb();
    db.prepare('INSERT OR REPLACE INTO icons (categoryId, iconData) VALUES (?, ?)')
      .run(categoryId, iconData);
    if (!isTest) db.close();
    return iconData;
  },

  getIcon: (categoryId: string): string | null => {
    const db = getDb();
    const result = db.prepare('SELECT iconData FROM icons WHERE categoryId = ?')
      .get(categoryId) as IconRow | undefined;
    if (!isTest) db.close();
    return result ? result.iconData : null;
  },

  removeIcon: (categoryId: string): void => {
    const db = getDb();
    db.prepare('DELETE FROM icons WHERE categoryId = ?').run(categoryId);
    if (!isTest) db.close();
  },

  // Load all data
  loadData: () => {
    const db = getDb();
    const categories = db.prepare('SELECT * FROM categories').all() as Category[];
    const icons: { [key: string]: string } = {};
    const definitions = dbService.getDefinitions();
    
    const iconRows = db.prepare('SELECT * FROM icons').all() as IconRow[];
    for (const row of iconRows) {
      icons[row.categoryId] = row.iconData;
    }

    if (!isTest) db.close();
    return { categories, icons, definitions };
  },

  // Save all data
  saveData: (categories: Category[]): void => {
    dbService.saveCategories(categories);
  },

  deleteCategory: (categoryId: string): void => {
    const db = getDb();
    const deleteTransaction = db.transaction(() => {
      // Helper function to recursively get all child category IDs
      const getAllChildIds = (parentId: string): string[] => {
        const children = db.prepare('SELECT id FROM categories WHERE parentId = ?').all(parentId) as { id: string }[];
        return children.reduce<string[]>((acc, child) => {
          return [...acc, child.id, ...getAllChildIds(child.id)];
        }, []);
      };

      // Get all child category IDs
      const childIds = getAllChildIds(categoryId);
      const allIds = [categoryId, ...childIds];

      // Delete all words in these categories
      db.prepare('DELETE FROM words WHERE category IN (' + allIds.map(() => '?').join(',') + ')').run(...allIds);
      
      // Delete all definitions in these categories
      db.prepare('DELETE FROM definitions WHERE categoryId IN (' + allIds.map(() => '?').join(',') + ')').run(...allIds);
      
      // Delete any icons for these categories
      db.prepare('DELETE FROM icons WHERE categoryId IN (' + allIds.map(() => '?').join(',') + ')').run(...allIds);
      
      // Delete child categories first (in reverse order to respect foreign key constraints)
      for (const id of childIds.reverse()) {
        db.prepare('DELETE FROM categories WHERE id = ?').run(id);
      }
      
      // Finally delete the main category
      db.prepare('DELETE FROM categories WHERE id = ?').run(categoryId);
    });
    
    deleteTransaction();
    if (!isTest) db.close();
  },

  // Add a new word
  addWord: (word: Word): Promise<void> => {
    return new Promise((resolve, reject) => {
      const db = getDb();
      try {
        // First check if the category exists
        const categoryExists = db.prepare('SELECT id FROM categories WHERE id = ?').get(word.category);
        if (!categoryExists) {
          throw new Error(`Category ${word.category} does not exist`);
        }

        // Then check if word exists
        const existingWord = db.prepare('SELECT id FROM words WHERE id = ?').get(word.id);
        const stmt = db.prepare(`
          INSERT OR REPLACE INTO words (id, term, definition, category, createdAt)
          VALUES (?, ?, ?, ?, ?)
        `);
        stmt.run(
          word.id,
          word.term,
          word.definition,
          word.category,
          word.createdAt.toISOString()
        );
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        if (!isTest) db.close();
      }
    });
  },

  // Delete a word
  async deleteWord(id: string): Promise<void> {
    const db = getDb();
    db.prepare('DELETE FROM words WHERE id = ?').run(id);
    if (!isTest) db.close();
  },

  // Get words with pagination
  async getWords(options: { 
    page?: number; 
    pageSize?: number; 
    categoryId?: string; 
    searchTerm?: string;
  } = {}): Promise<{ words: Word[]; total: number }> {
    const { page = 1, pageSize = 10, categoryId, searchTerm } = options;
    const offset = (page - 1) * pageSize;

    let query = 'SELECT * FROM words';
    let countQuery = 'SELECT COUNT(*) as total FROM words';
    const params: any[] = [];
    
    if (categoryId || searchTerm) {
      const conditions: string[] = [];
      
      if (categoryId) {
        conditions.push('category = ?');
        params.push(categoryId);
      }
      
      if (searchTerm) {
        conditions.push('term LIKE ?');
        params.push(`${searchTerm}%`);
      }
      
      if (conditions.length > 0) {
        const whereClause = `WHERE ${conditions.join(' AND ')}`;
        query += ` ${whereClause}`;
        countQuery += ` ${whereClause}`;
      }
    }

    // Add pagination
    query += ' ORDER BY term ASC LIMIT ? OFFSET ?';
    const paginationParams = [...params, pageSize, offset];

    const db = getDb();
    const countResult = db.prepare(countQuery).get(...params) as { total: number };
    const words = db.prepare(query).all(...paginationParams) as Word[];

    return { 
      words: words.map(word => ({
        ...word,
        createdAt: new Date(word.createdAt)
      })),
      total: countResult.total
    };
  },

  // Add a new category
  addCategory: (category: Category): void => {
    const db = getDb();
    try {
      // First check if category exists
      const existingCategory = db.prepare('SELECT id FROM categories WHERE id = ?').get(category.id);
      if (!existingCategory) {
        // Insert new category
        const stmt = db.prepare(`
          INSERT INTO categories (id, name, description, parentId, icon)
          VALUES (?, ?, ?, ?, ?)
        `);
        stmt.run(
          category.id,
          category.name,
          category.description || '',
          category.parentId || null,
          category.icon || null
        );
      }
    } finally {
      if (!isTest) db.close();
    }
  }
}; 