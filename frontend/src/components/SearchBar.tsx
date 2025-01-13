import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Autocomplete, TextField, InputAdornment, AutocompleteRenderInputParams, Typography } from '@mui/material';
import { Search } from 'lucide-react';
import { Word, Category } from '../types/dictionary';

interface SearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  words: Word[];
  categories: Category[];
}

interface SearchOption {
  type: 'word' | 'category';
  label: string;
  id: string;
}

export default function SearchBar({ searchTerm, onSearch, words, categories }: SearchBarProps) {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const options: SearchOption[] = [
    // First 3 matching words
    ...words
      .filter(word => word.term.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 3)
      .map(word => ({
        type: 'word' as const,
        label: word.term,
        id: word.id
      })),
    // Next 3 matching categories
    ...categories
      .filter(category => category.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 3)
      .map(category => ({
        type: 'category' as const,
        label: category.name,
        id: category.id
      }))
  ];

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Autocomplete
        freeSolo
        options={options}
        groupBy={(option) => typeof option === 'string' ? '' : option.type}
        getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
        inputValue={searchTerm}
        onInputChange={(_event: unknown, newValue: string | null) => onSearch(newValue || '')}
        onChange={(_event: unknown, value: string | SearchOption | null) => {
          if (value && typeof value !== 'string') {
            if (value.type === 'category') {
              navigate(`/?category=${value.id}&word=`);
            } else {
              navigate(`/?word=${value.id}`);
            }
          }
        }}
        renderGroup={(params) => (
          <div key={params.key}>
            <Typography
              variant="caption"
              sx={{
                px: 2,
                py: 1,
                display: 'block',
                color: 'text.secondary',
                textTransform: 'uppercase'
              }}
            >
              {params.group === 'word' ? 'Words' : 'Categories'}
            </Typography>
            {params.children}
          </div>
        )}
        renderInput={(params: AutocompleteRenderInputParams) => (
          <TextField
            {...params}
            fullWidth
            variant="outlined"
            placeholder="Search words and categories..."
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </form>
  );
}