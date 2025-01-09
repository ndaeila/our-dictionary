import { describe, it, expect, beforeEach } from '@jest/globals';
import { dbService, resetTestDb } from '../db/database';
import { Category } from '../types/dictionary';

describe('Database Service', () => {
  const testCategory: Category = {
    id: 'test-1',
    name: 'Test Category',
    description: 'Test Description',
    parentId: null
  };

  const testIcon = 'data:image/png;base64,test123';

  // Reset database before each test
  beforeEach(() => {
    resetTestDb();
  });

  describe('Categories', () => {
    it('should save and retrieve categories', () => {
      dbService.saveCategories([testCategory]);
      const categories = dbService.getAllCategories();
      
      expect(categories).toHaveLength(1);
      expect(categories[0]).toEqual(testCategory);
    });

    it('should update existing categories', () => {
      dbService.saveCategories([testCategory]);
      
      const updatedCategory = { ...testCategory, name: 'Updated Name' };
      dbService.saveCategories([updatedCategory]);
      
      const categories = dbService.getAllCategories();
      expect(categories).toHaveLength(1);
      expect(categories[0].name).toBe('Updated Name');
    });

    it('should handle multiple categories', () => {
      const categories: Category[] = [
        testCategory,
        { id: 'test-2', name: 'Test 2', description: 'Desc 2', parentId: 'test-1' }
      ];
      
      dbService.saveCategories(categories);
      const retrieved = dbService.getAllCategories();
      
      expect(retrieved).toHaveLength(2);
      expect(retrieved).toEqual(expect.arrayContaining(categories));
    });
  });

  describe('Icons', () => {
    beforeEach(() => {
      // Save test category before each icon test
      dbService.saveCategories([testCategory]);
    });

    it('should save and retrieve icons', async () => {
      await dbService.saveIcon(testCategory.id, testIcon);
      const retrieved = dbService.getIcon(testCategory.id);
      
      expect(retrieved).toBe(testIcon);
    });

    it('should return null for non-existent icons', () => {
      const retrieved = dbService.getIcon('non-existent');
      expect(retrieved).toBeNull();
    });

    it('should remove icons', async () => {
      await dbService.saveIcon(testCategory.id, testIcon);
      dbService.removeIcon(testCategory.id);
      
      const retrieved = dbService.getIcon(testCategory.id);
      expect(retrieved).toBeNull();
    });

    it('should update existing icons', async () => {
      await dbService.saveIcon(testCategory.id, testIcon);
      const newIcon = 'data:image/png;base64,updated123';
      await dbService.saveIcon(testCategory.id, newIcon);
      
      const retrieved = dbService.getIcon(testCategory.id);
      expect(retrieved).toBe(newIcon);
    });
  });

  describe('Data Loading', () => {
    it('should load all data correctly', async () => {
      // Save test data
      dbService.saveCategories([testCategory]);
      await dbService.saveIcon(testCategory.id, testIcon);

      // Load all data
      const data = dbService.loadData();

      expect(data.categories).toHaveLength(1);
      expect(data.categories[0]).toEqual(testCategory);
      expect(data.icons[testCategory.id]).toBe(testIcon);
    });

    it('should handle empty database', () => {
      const data = dbService.loadData();
      expect(data.categories).toHaveLength(0);
      expect(Object.keys(data.icons)).toHaveLength(0);
    });
  });
}); 