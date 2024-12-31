import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface IconUploadProps {
  currentIcon: string | null;
  onIconChange: (file: File | null) => void;
}

export default function IconUpload({ currentIcon, onIconChange }: IconUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        alert('File size should be less than 1MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      onIconChange(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onIconChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mt-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <div
        onClick={handleClick}
        className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg 
                 flex items-center justify-center cursor-pointer hover:border-green-500 
                 transition-colors"
      >
        {currentIcon ? (
          <>
            <img
              src={currentIcon}
              alt="Category icon"
              className="w-20 h-20 object-contain"
            />
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full 
                       hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <span className="mt-1 text-xs text-gray-500">Upload Icon</span>
          </div>
        )}
      </div>
    </div>
  );
}