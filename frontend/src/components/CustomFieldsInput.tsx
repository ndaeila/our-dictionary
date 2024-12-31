import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CustomField } from '../types/dictionary';

interface CustomFieldsInputProps {
  fields: CustomField[];
  onChange: (fields: CustomField[]) => void;
}

export default function CustomFieldsInput({ fields, onChange }: CustomFieldsInputProps) {
  const addField = () => {
    onChange([...fields, { id: Date.now().toString(), name: '', value: '' }]);
  };

  const removeField = (id: string) => {
    onChange(fields.filter(field => field.id !== id));
  };

  const updateField = (id: string, key: 'name' | 'value', value: string) => {
    onChange(fields.map(field => 
      field.id === id ? { ...field, [key]: value } : field
    ));
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">Custom Fields</label>
        <button
          type="button"
          onClick={addField}
          className="flex items-center space-x-1 text-sm text-blue-500 hover:text-blue-600"
        >
          <Plus className="h-4 w-4" />
          <span>Add Field</span>
        </button>
      </div>
      
      {fields.map((field) => (
        <div key={field.id} className="flex space-x-2">
          <input
            type="text"
            value={field.name}
            onChange={(e) => updateField(field.id, 'name', e.target.value)}
            placeholder="Field name"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <input
            type="text"
            value={field.value}
            onChange={(e) => updateField(field.id, 'value', e.target.value)}
            placeholder="Field value"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => removeField(field.id)}
            className="p-2 text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}