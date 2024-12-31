import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Book } from 'lucide-react';
import SearchBar from './components/SearchBar';
import CategoryGrid from './components/CategoryGrid';
import WordList from './components/WordList';
import AddWordForm from './components/AddWordForm';
import AddCategoryForm from './components/AddCategoryForm';
import { Word, Category } from './types/dictionary';
import { initialCategories, initialWords } from './data/initialData';
import { storage } from './utils/storage';
import { useUrlState } from './hooks/useUrlState';

function App() {
  const [words, setWords] = useState<Word[]>(initialWords);
  const [categories, setCategories] = useState<Category[]>(() => {
    const savedData = storage.loadData();
    return savedData.categories.length > 0 ? savedData.categories : initialCategories;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { wordId, categoryId, updateUrl } = useUrlState();

  // Save categories whenever they change
  useEffect(() => {
    storage.saveData(categories);
  }, [categories]);

  // Handle URL-based navigation
  useEffect(() => {
    if (wordId) {
      const word = words.find(w => w.id === wordId);
      if (word && word.category !== categoryId) {
        updateUrl(wordId, word.category);
      }
    }
  }, [wordId, categoryId, words, updateUrl]);

  const handleCategorySelect = (selectedCategoryId: string) => {
    if (categoryId === selectedCategoryId) {
      // Deselect if clicking the same category
      updateUrl(wordId, null);
    } else {
      updateUrl(wordId, selectedCategoryId);
    }
  };

  const handleWordClick = (selectedWordId: string) => {
    const word = words.find(w => w.id === selectedWordId);
    if (word) {
      updateUrl(selectedWordId, word.category);
    }
  };

  const filteredWords = useMemo(() => {
    return words.filter((word) => {
      const matchesSearch = word.term.toLowerCase().startsWith(searchTerm.toLowerCase());
      const matchesCategory = categoryId ? word.category === categoryId : true;
      return matchesSearch && matchesCategory;
    });
  }, [words, searchTerm, categoryId]);

  const handleAddWord = (newWord: { 
    term: string; 
    definition: string; 
    category: string;
    customFields: CustomField[];
  }) => {
    const word: Word = {
      id: Date.now().toString(),
      ...newWord,
      createdAt: new Date(),
    };
    setWords((prev) => [...prev, word]);
  };

  const handleAddCategory = (newCategory: { 
    name: string; 
    description: string; 
    icon: string;
    customIcon?: string;
  }) => {
    const id = newCategory.name.toLowerCase().replace(/\s+/g, '-');
    const category: Category = {
      id,
      ...newCategory,
    };
    setCategories((prev) => [...prev, category]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Book className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-900">Personal Dictionary</h1>
        </div>

        <div className="mb-8">
          <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
        </div>

        <div className="flex justify-between items-start mb-8">
          <AddCategoryForm onAddCategory={handleAddCategory} />
          <AddWordForm categories={categories} onAddWord={handleAddWord} />
        </div>

        <CategoryGrid
          categories={categories}
          onSelectCategory={handleCategorySelect}
          selectedCategory={categoryId}
        />

        <WordList 
          words={filteredWords}
          onWordClick={handleWordClick}
        />
      </div>
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}