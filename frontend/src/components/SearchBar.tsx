import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Autocomplete, TextField, InputAdornment, AutocompleteRenderInputParams } from '@mui/material';
import { Search } from 'lucide-react';
import { Word } from '../types/dictionary';

interface SearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  words: Word[];
}

export default function SearchBar({ searchTerm, onSearch, words }: SearchBarProps) {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const suggestions = words
    .filter(word => word.term.toLowerCase().includes(searchTerm.toLowerCase()))
    .map(word => word.term);

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Autocomplete
        freeSolo
        options={suggestions}
        inputValue={searchTerm}
        onInputChange={(_event: unknown, newValue: string | null) => onSearch(newValue || '')}
        renderInput={(params: AutocompleteRenderInputParams) => (
          <TextField
            {...params}
            fullWidth
            variant="outlined"
            placeholder="Search words..."
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