import { Category } from '../types/dictionary';

// In-memory storage for demo purposes
// In a real app, you'd use localStorage, IndexedDB, or a backend service
let iconStorage: { [key: string]: string } = {};

export const storage = {
  saveIcon: (categoryId: string, file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        iconStorage[categoryId] = base64String;
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  getIcon: (categoryId: string): string | null => {
    return iconStorage[categoryId] || null;
  },

  removeIcon: (categoryId: string): void => {
    delete iconStorage[categoryId];
  },

  // Save all data (categories and icons) to localStorage
  saveData: (categories: Category[]): void => {
    localStorage.setItem('dictionary_categories', JSON.stringify(categories));
    localStorage.setItem('dictionary_icons', JSON.stringify(iconStorage));
  },

  // Load all data from localStorage
  loadData: (): { categories: Category[]; icons: { [key: string]: string } } => {
    const categories = JSON.parse(localStorage.getItem('dictionary_categories') || '[]');
    iconStorage = JSON.parse(localStorage.getItem('dictionary_icons') || '{}');
    return { categories, icons: iconStorage };
  }
};