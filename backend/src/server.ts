import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { dbService } from './db/database';
import { Category, Definition } from './types/dictionary';

// Load environment variables
config();

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

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app; 