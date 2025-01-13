import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { storage } from '../utils/storage';
import { Category } from '../types/dictionary';

// Mock fetch
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe('Storage Service', () => {
  const mockCategory: Category = {
    id: 'test-1',
    name: 'Test Category',
    description: 'Test Description',
    parentId: null
  };

  const mockIcon = 'data:image/png;base64,test123';

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('Categories and Data', () => {
    it('should load data successfully', async () => {
      const mockResponse = {
        categories: [mockCategory],
        icons: { [mockCategory.id]: mockIcon },
        words: []
      };

      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        })
      );

      const result = await storage.loadData();
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3002/api/data');
    });

    it('should handle load data failure', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: false
        })
      );

      const result = await storage.loadData();
      expect(result).toEqual({ categories: [], icons: {}, words: [] });
    });

    it('should save data successfully', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        })
      );

      await storage.saveData([mockCategory]);
      
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3002/api/data',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categories: [mockCategory] })
        })
      );
    });

    it('should delete category successfully', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        })
      );

      await storage.deleteCategory(mockCategory.id);
      
      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:3002/api/categories/${mockCategory.id}`,
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });

    it('should handle delete category failure', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 404
        })
      );

      await expect(storage.deleteCategory(mockCategory.id)).rejects.toThrow('HTTP error! status: 404');
    });
  });

  describe('Icons', () => {
    it('should get icon successfully', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ iconData: mockIcon })
        })
      );

      const result = await storage.getIcon(mockCategory.id);
      expect(result).toBe(mockIcon);
      expect(global.fetch).toHaveBeenCalledWith(`http://localhost:3002/api/icons/${mockCategory.id}`);
    });

    it('should handle get icon failure', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: false
        })
      );

      const result = await storage.getIcon(mockCategory.id);
      expect(result).toBeNull();
    });

    it('should remove icon successfully', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        })
      );

      await storage.removeIcon(mockCategory.id);
      
      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:3002/api/icons/${mockCategory.id}`,
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });

    it('should save icon successfully', async () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
      const mockFileReader = {
        readAsDataURL: jest.fn(),
        result: mockIcon,
        onload: null as any,
        onerror: null as any
      };

      // Mock FileReader
      global.FileReader = jest.fn(() => mockFileReader) as any;

      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ iconUrl: mockIcon })
        })
      );

      const savePromise = storage.saveIcon(mockCategory.id, mockFile);
      
      // Simulate FileReader load
      mockFileReader.onload();
      
      const result = await savePromise;
      expect(result).toBe(mockIcon);
      
      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:3002/api/icons/${mockCategory.id}`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ iconData: mockIcon })
        })
      );
    });
  });
}); 