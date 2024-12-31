import React from 'react';
import { Category } from '../types/dictionary';
import { categoryIcons } from '../utils/icons';

interface CategoryGridProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
  selectedCategory: string | null;
}

export default function CategoryGrid({ categories, onSelectCategory, selectedCategory }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {categories.map((category) => {
        const IconComponent = category.customIcon 
          ? null 
          : categoryIcons[category.icon as keyof typeof categoryIcons];
        
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`p-4 rounded-lg transition-all ${
              selectedCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-white hover:bg-gray-50'
            } shadow-sm`}
          >
            <div className="flex items-center space-x-3">
              {category.customIcon ? (
                <img 
                  src={category.customIcon} 
                  alt={category.name}
                  className="h-6 w-6 object-contain"
                />
              ) : IconComponent && (
                <IconComponent className="h-6 w-6" />
              )}
              <div className="text-left">
                <h3 className="font-semibold">{category.name}</h3>
                <p className={`text-sm ${
                  selectedCategory === category.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {category.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}