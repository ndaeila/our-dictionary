import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Category, CustomField } from '../types/dictionary';
import CustomFieldsInput from './CustomFieldsInput';

interface AddWordFormProps {
  categories: Category[];
  onAddWord: (word: { 
    term: string; 
    definition: string; 
    category: string;
    customFields: CustomField[];
  }) => void;
}

export default function AddWordForm({ categories, onAddWord }: AddWordFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || '');
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (term && definition && category) {
      onAddWord({ term, definition, category, customFields });
      setTerm('');
      setDefinition('');
      setCategory(categories[0]?.id || '');
      setCustomFields([]);
      setIsOpen(false);
    }
  };

  return (
    <div className="mb-8">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg 
                   hover:bg-blue-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Word</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Term</label>
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Definition</label>
              <textarea
                value={definition}
                onChange={(e) => setDefinition(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-blue-500 focus:ring-blue-500"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <CustomFieldsInput
              fields={customFields}
              onChange={setCustomFields}
            />
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add Word
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}