import path from 'path';
import Database from 'better-sqlite3';
import { beforeAll, afterEach } from '@jest/globals';

// Use an in-memory database for testing
process.env.DB_PATH = ':memory:';

// Global setup
beforeAll(() => {
  // Any global setup can go here
});

// Clean up after each test
afterEach(() => {
  const db = new Database(':memory:');
  // Recreate tables
  db.exec(`
    DROP TABLE IF EXISTS icons;
    DROP TABLE IF EXISTS categories;
    
    CREATE TABLE categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      parentId TEXT,
      icon TEXT,
      FOREIGN KEY (parentId) REFERENCES categories(id)
    );

    CREATE TABLE icons (
      categoryId TEXT PRIMARY KEY,
      iconData TEXT NOT NULL,
      FOREIGN KEY (categoryId) REFERENCES categories(id)
    );
  `);
  db.close();
}); 