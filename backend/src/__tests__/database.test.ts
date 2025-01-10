import { describe, it, expect, beforeEach } from '@jest/globals';
import { dbService, resetTestDb } from '../db/database';
import { Category, Definition, Word } from '../types/dictionary';

describe('Database Service', () => {
  beforeEach(() => {
    resetTestDb();
  });

  describe('getWords', () => {
    const sampleWords: Word[] = [
      { id: '1', term: 'Apple', definition: 'A fruit', category: 'food', createdAt: new Date('2023-01-01') },
      { id: '2', term: 'Banana', definition: 'A yellow fruit', category: 'food', createdAt: new Date('2023-01-02') },
      { id: '3', term: 'Car', definition: 'A vehicle', category: 'transport', createdAt: new Date('2023-01-03') },
      { id: '4', term: 'Dog', definition: 'A pet', category: 'animals', createdAt: new Date('2023-01-04') },
      { id: '5', term: 'Elephant', definition: 'A large animal', category: 'animals', createdAt: new Date('2023-01-05') }
    ];

    const sampleCategories: Category[] = [
      { id: 'food', name: 'Food', description: 'Edible items' },
      { id: 'transport', name: 'Transport', description: 'Modes of transportation' },
      { id: 'animals', name: 'Animals', description: 'Living creatures' }
    ];

    const sampleDefinitions: Definition[] = [
      { 
        id: '1', 
        categoryId: 'food', 
        term: 'Apple', 
        definition: 'A fruit',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      }
    ];

    beforeEach(async () => {
      // Save sample data
      dbService.saveCategories(sampleCategories);
      for (const word of sampleWords) {
        await dbService.addWord(word);
      }
    });

    test('returns first page of results with default page size', async () => {
      const result = await dbService.getWords();
      expect(result.words.length).toBe(5);
      expect(result.total).toBe(5);
      expect(result.words[0].term).toBe('Apple');
    });

    test('returns correct page of results with custom page size', async () => {
      const result = await dbService.getWords({ page: 2, pageSize: 2 });
      expect(result.words.length).toBe(2);
      expect(result.total).toBe(5);
      expect(result.words[0].term).toBe('Car');
    });

    test('filters results by category', async () => {
      const result = await dbService.getWords({ categoryId: 'animals' });
      expect(result.words.length).toBe(2);
      expect(result.total).toBe(2);
      expect(result.words.every(w => w.category === 'animals')).toBe(true);
    });

    test('filters results by search term', async () => {
      const result = await dbService.getWords({ searchTerm: 'a' });
      expect(result.words.length).toBe(1);
      expect(result.total).toBe(1);
      expect(result.words[0].term).toBe('Apple');
    });

    test('combines category and search filters', async () => {
      const result = await dbService.getWords({ 
        categoryId: 'animals', 
        searchTerm: 'e' 
      });
      expect(result.words.length).toBe(1);
      expect(result.total).toBe(1);
      expect(result.words[0].term).toBe('Elephant');
    });

    test('handles empty results', async () => {
      const result = await dbService.getWords({ searchTerm: 'xyz' });
      expect(result.words.length).toBe(0);
      expect(result.total).toBe(0);
    });

    test('preserves word dates', async () => {
      const result = await dbService.getWords();
      expect(result.words[0].createdAt).toBeInstanceOf(Date);
      expect(result.words[0].createdAt.toISOString()).toBe('2023-01-01T00:00:00.000Z');
    });
  });

  describe('Word Management', () => {
    const testWord: Word = {
      id: 'test-word-1',
      term: 'Test Word',
      definition: 'A word used for testing',
      category: 'test-1',
      createdAt: new Date('2023-01-01')
    };

    const testCategory: Category = {
      id: 'test-1',
      name: 'Test Category',
      description: 'Test Description'
    };

    beforeEach(() => {
      dbService.saveCategories([testCategory]);
    });

    test('should add a new word', async () => {
      await dbService.addWord(testWord);
      const result = await dbService.getWords();
      expect(result.words).toHaveLength(1);
      expect(result.words[0].term).toBe(testWord.term);
    });

    test('should fail to add word with non-existent category', async () => {
      const invalidWord = { ...testWord, category: 'non-existent' };
      await expect(dbService.addWord(invalidWord)).rejects.toThrow();
    });

    test('should update existing word', async () => {
      await dbService.addWord(testWord);
      const updatedWord = { ...testWord, definition: 'Updated definition' };
      await dbService.addWord(updatedWord);
      const result = await dbService.getWords();
      expect(result.words).toHaveLength(1);
      expect(result.words[0].definition).toBe('Updated definition');
    });

    test('should delete word', async () => {
      await dbService.addWord(testWord);
      await dbService.deleteWord(testWord.id);
      const result = await dbService.getWords();
      expect(result.words).toHaveLength(0);
    });
  });
}); 