import request from 'supertest';
import app from '../server';
import { dbService, resetTestDb } from '../db/database';
import { Category, Definition, Word } from '../types/dictionary';

describe('API Endpoints', () => {
  const testCategory: Category = {
    id: 'test-1',
    name: 'Test Category',
    description: 'Test Description',
    parentId: null,
    icon: undefined
  };

  const testWord: Word = {
    id: 'word-1',
    term: 'Test Term',
    definition: 'Test Definition',
    category: 'test-1',
    createdAt: new Date('2023-01-01')
  };

  const testDefinition: Definition = {
    id: 'def-1',
    categoryId: 'test-1',
    term: 'Test Term',
    definition: 'Test Definition',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  };

  beforeEach(() => {
    resetTestDb();
    dbService.saveCategories([testCategory]);
  });

  describe('GET /api/words', () => {
    beforeEach(async () => {
      await dbService.addWord(testWord);
    });

    it('should return paginated words', async () => {
      const response = await request(app)
        .get('/api/words')
        .expect(200);

      expect(response.body.words).toHaveLength(1);
      expect(response.body.total).toBe(1);
      expect(response.body.words[0].term).toBe(testWord.term);
    });

    it('should filter words by category', async () => {
      const response = await request(app)
        .get('/api/words')
        .query({ categoryId: testWord.category })
        .expect(200);

      expect(response.body.words).toHaveLength(1);
      expect(response.body.total).toBe(1);
      expect(response.body.words[0].category).toBe(testWord.category);
    });

    it('should filter words by search term', async () => {
      const response = await request(app)
        .get('/api/words')
        .query({ searchTerm: testWord.term })
        .expect(200);

      expect(response.body.words).toHaveLength(1);
      expect(response.body.total).toBe(1);
      expect(response.body.words[0].term).toBe(testWord.term);
    });

    it('should handle pagination parameters', async () => {
      const response = await request(app)
        .get('/api/words')
        .query({ page: 1, pageSize: 10 })
        .expect(200);

      expect(response.body.words).toHaveLength(1);
      expect(response.body.total).toBe(1);
    });
  });

  describe('GET /api/data', () => {
    it('should return all data', async () => {
      const response = await request(app)
        .get('/api/data')
        .expect(200);

      expect(response.body.categories).toHaveLength(1);
      const category = response.body.categories[0];
      expect(category.id).toBe(testCategory.id);
      expect(category.name).toBe(testCategory.name);
      expect(category.description).toBe(testCategory.description);
      expect(category.parentId).toBe(testCategory.parentId);
    });
  });

  describe('POST /api/data', () => {
    it('should save categories', async () => {
      const newCategory = { ...testCategory, name: 'Updated Name' };
      
      await request(app)
        .post('/api/data')
        .send({ categories: [newCategory] })
        .expect(200);

      const response = await request(app)
        .get('/api/data')
        .expect(200);

      expect(response.body.categories[0].name).toBe('Updated Name');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category', async () => {
      await request(app)
        .delete(`/api/categories/${testCategory.id}`)
        .expect(200);

      const response = await request(app)
        .get('/api/data')
        .expect(200);

      expect(response.body.categories).toHaveLength(0);
    });
  });

  describe('POST /api/words', () => {
    beforeEach(() => {
      // Ensure category exists before adding words
      dbService.saveCategories([testCategory]);
    });

    it('should create a new word', async () => {
      const newWord: Word = {
        id: 'new-word',
        term: 'New Word',
        definition: 'A newly created word',
        category: testCategory.id,
        createdAt: new Date('2023-01-01')
      };

      const response = await request(app)
        .post('/api/words')
        .send(newWord)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify word was created
      const getResponse = await request(app)
        .get('/api/words')
        .expect(200);

      expect(getResponse.body.words.some((w: Word) => w.id === newWord.id)).toBe(true);
    });

    it('should fail to create word with non-existent category', async () => {
      const invalidWord: Word = {
        id: 'invalid-word',
        term: 'Invalid Word',
        definition: 'A word with invalid category',
        category: 'non-existent',
        createdAt: new Date('2023-01-01')
      };

      await request(app)
        .post('/api/words')
        .send(invalidWord)
        .expect(500);
    });
  });
}); 