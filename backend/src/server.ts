import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { parse } from 'csv-parse';
import { Category, Word, Definition } from './types/dictionary';
import { dbService } from './db/database';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3002;
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Configure CORS
app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json({ limit: '50mb' }));

// Configure multer for file upload
const upload = multer({ storage: multer.memoryStorage() });

// Define multer request type
interface MulterRequest extends Request {
  file?: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
  };
}

// Helper function to create categories from path
const createCategoryPath = (path: string): Category[] => {
  const parts = path.split('>').map(p => p.trim());
  const categories: Category[] = [];
  
  for (let i = 0; i < parts.length; i++) {
    const name = parts[i];
    const id = parts.slice(0, i + 1).join('-').toLowerCase().replace(/\s+/g, '-');
    const parentId = i > 0 ? parts.slice(0, i).join('-').toLowerCase().replace(/\s+/g, '-') : null;
    
    categories.push({
      id,
      name,
      description: '',
      parentId
    });
  }
  
  return categories;
};

// Get all categories and icons
app.get('/api/data', (req: Request, res: Response) => {
  try {
    const data = dbService.loadData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load data' });
  }
});

// Save all categories
app.post('/api/data', (req: Request, res: Response) => {
  try {
    const { categories } = req.body;
    dbService.saveData(categories);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Get definitions (optionally filtered by category)
app.get('/api/definitions', (req: Request, res: Response) => {
  try {
    const categoryId = req.query.categoryId as string | undefined;
    const definitions = dbService.getDefinitions(categoryId);
    res.json(definitions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get definitions' });
  }
});

// Save definition
app.post('/api/definitions', (req: Request, res: Response) => {
  try {
    const definition: Definition = req.body;
    if (!definition.createdAt) {
      definition.createdAt = new Date().toISOString();
    }
    definition.updatedAt = new Date().toISOString();
    
    dbService.saveDefinition(definition);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save definition' });
  }
});

// Delete definition
app.delete('/api/definitions/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    dbService.deleteDefinition(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete definition' });
  }
});

// Save icon
app.post('/api/icons/:categoryId', (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const { iconData } = req.body;
    const result = dbService.saveIcon(categoryId, iconData);
    res.json({ iconUrl: result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save icon' });
  }
});

// Get icon
app.get('/api/icons/:categoryId', (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const iconData = dbService.getIcon(categoryId);
    if (iconData) {
      res.json({ iconData });
    } else {
      res.status(404).json({ error: 'Icon not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get icon' });
  }
});

// Delete icon
app.delete('/api/icons/:categoryId', (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    dbService.removeIcon(categoryId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete icon' });
  }
});

// Add category
app.post('/api/categories', (req: Request, res: Response) => {
  try {
    const category: Category = req.body;
    dbService.addCategory(category);
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Failed to add category' });
  }
});

// Delete category
app.delete('/api/categories/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    dbService.deleteCategory(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Get words with pagination
app.get('/api/words', async (req, res) => {
  try {
    // Default to page 1 if page is not a positive number
    let page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.max(1, parseInt(req.query.pageSize as string) || 10);
    const categoryId = req.query.categoryId as string;
    const searchTerm = req.query.searchTerm as string;

    const result = await dbService.getWords({ page, pageSize, categoryId, searchTerm });
    
    // If page is greater than total pages, return last page
    const totalPages = Math.ceil(result.total / pageSize);
    if (page > totalPages && totalPages > 0) {
      page = totalPages;
      const newResult = await dbService.getWords({ page, pageSize, categoryId, searchTerm });
      res.json(newResult);
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('Error getting words:', error);
    res.status(500).json({ error: 'Failed to get words' });
  }
});

// Add word
app.post('/api/words', async (req: Request, res: Response) => {
  try {
    const word: Word = {
      ...req.body,
      createdAt: new Date(req.body.createdAt)
    };
    await dbService.addWord(word);
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding word:', error);
    res.status(500).json({ error: 'Failed to add word' });
  }
});

// Delete word
app.delete('/api/words/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await dbService.deleteWord(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting word:', error);
    res.status(500).json({ error: 'Failed to delete word' });
  }
});

// Import CSV endpoint
app.post('/api/import', upload.single('file'), async (req: MulterRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Validate file type
  if (req.file.mimetype !== 'text/csv') {
    return res.status(500).json({ error: 'Invalid file type. Only CSV files are allowed.' });
  }

  try {
    const processRecords = new Promise<void>((resolve, reject) => {
      const parser = parse({
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      const records: { term: string; definition: string; path: string }[] = [];

      parser.on('readable', () => {
        let record;
        while ((record = parser.read())) {
          // Validate required fields
          if (!record.term || !record.definition || !record.path) {
            throw new Error('Missing required fields: term, definition, and path are required');
          }
          records.push(record);
        }
      });

      parser.on('end', async () => {
        try {
          // First, collect all unique categories
          const newCategories = new Map<string, Category>();
          for (const record of records) {
            const pathParts = record.path.split('>').map(p => p.trim());
            let parentId: string | undefined = undefined;
            let currentPath = '';

            for (const part of pathParts) {
              currentPath = currentPath ? `${currentPath}-${part.toLowerCase()}` : part.toLowerCase();
              if (!newCategories.has(currentPath)) {
                newCategories.set(currentPath, {
                  id: currentPath,
                  name: part,
                  description: '',
                  icon: undefined,
                  parentId
                });
              }
              parentId = currentPath;
            }
          }

          // Create categories in order (parents first)
          const sortedCategories = Array.from(newCategories.values())
            .sort((a, b) => (a.parentId ? 1 : -1));

          for (const category of sortedCategories) {
            dbService.addCategory(category);
          }

          // Create words after all categories exist
          for (const record of records) {
            const pathParts = record.path.split('>').map(p => p.trim());
            const categoryId = pathParts.reduce((acc, part) => 
              acc ? `${acc}-${part.toLowerCase()}` : part.toLowerCase(), '');

            const word: Word = {
              id: `${record.term.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
              term: record.term,
              definition: record.definition,
              category: categoryId,
              createdAt: new Date()
            };

            dbService.addWord(word);
          }

          // Return updated data
          const updatedData = dbService.loadData();
          const words = await dbService.getWords({ page: 1, pageSize: 1000 });
          resolve();
          res.json({
            categories: updatedData.categories,
            words
          });
        } catch (error) {
          reject(error);
        }
      });

      parser.on('error', reject);

      // Start parsing
      if (req.file) {
        parser.write(req.file.buffer);
        parser.end();
      } else {
        reject(new Error('No file uploaded'));
      }
    });

    await processRecords;
  } catch (error) {
    console.error('Error importing CSV:', error);
    res.status(500).json({ error: 'Failed to import CSV' });
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app; 