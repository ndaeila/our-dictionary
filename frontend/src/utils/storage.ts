import { Category, Word, Definition } from '../types/dictionary';

const API_URL = 'http://localhost:3002/api';

export const storage = {
  async loadData(): Promise<{ categories: any; icons: any; words: any }> {
    const response = await fetch(`${API_URL}/data`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async saveData(categories: Category[]): Promise<void> {
    const response = await fetch(`${API_URL}/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categories),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },

  async addWord(word: Word): Promise<void> {
    const response = await fetch(`${API_URL}/words`, {
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

  async deleteWord(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/words/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },

  async saveDefinition(definition: Definition): Promise<void> {
    const response = await fetch(`${API_URL}/definitions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(definition),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },

  async loadDefinitions(): Promise<Definition[]> {
    const response = await fetch(`${API_URL}/definitions`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async saveIcon(categoryId: string, icon: string): Promise<void> {
    const response = await fetch(`${API_URL}/icons/${categoryId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ icon }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },

  async loadIcon(categoryId: string): Promise<string> {
    const response = await fetch(`${API_URL}/icons/${categoryId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async removeIcon(categoryId: string): Promise<void> {
    const response = await fetch(`${API_URL}/icons/${categoryId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },

  async importCSV(file: File): Promise<{ categories: Category[]; words: { words: Word[] } }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/import`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to import CSV');
    }

    return response.json();
  }
}; 