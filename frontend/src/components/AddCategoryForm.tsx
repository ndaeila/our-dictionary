import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { categoryIcons } from '../utils/icons';
import IconUpload from './IconUpload';
import { storage } from '../utils/storage';

interface AddCategoryFormProps {
  onAddCategory: (category: { 
    name: string; 
    description: string; 
    icon: string;
    customIcon?: string;
  }) => void;
}

export default function AddCategoryForm({ onAddCategory }: AddCategoryFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(Object.keys(categoryIcons)[0]);
  const [customIcon, setCustomIcon] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && description) {
      onAddCategory({ 
        name, 
        description, 
        icon,
        customIcon: customIcon || undefined
      });
      setName('');
      setDescription('');
      setIcon(Object.keys(categoryIcons)[0]);
      setCustomIcon(null);
      setIsOpen(false);
    }
  };

  const handleIconUpload = async (file: File | null) => {
    if (file) {
      const categoryId = `temp-${Date.now()}`;
      const iconUrl = await storage.saveIcon(categoryId, file);
      setCustomIcon(iconUrl);
    } else {
      setCustomIcon(null);
    }
  };

  return (
    <div className="mb-8">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg 
                   hover:bg-green-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Category</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-green-500 focus:ring-green-500"
                rows={2}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Custom Icon</label>
              <IconUpload
                currentIcon={customIcon}
                onIconChange={handleIconUpload}
              />
              <p className="mt-1 text-sm text-gray-500">
                Or choose from predefined icons:
              </p>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-green-500 focus:ring-green-500"
                disabled={!!customIcon}
              >
                {Object.keys(categoryIcons).map((iconName) => (
                  <option key={iconName} value={iconName}>
                    {iconName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Add Category
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