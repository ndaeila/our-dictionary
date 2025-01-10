import { Category, Word } from '../types/dictionary';

const API_URL = 'http://localhost:3002';

export const storage = {
  async loadData() {
    const response = await fetch(`${API_URL}/api/data`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      categories: data.categories,
      icons: data.icons || {},
      words: data.words || []
    };
  },

  async saveData(categories: Category[]) {
    const response = await fetch(`${API_URL}/api/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categories }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },

  async addWord(word: Word) {
    const response = await fetch(`${API_URL}/api/words`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(word),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },

  async deleteWord(id: string) {
    const response = await fetch(`${API_URL}/api/words/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },

  async deleteCategory(id: string) {
    const response = await fetch(`${API_URL}/api/categories/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },

  async addCategory(category: Category) {
    const response = await fetch(`${API_URL}/api/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categories: [category] }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
};