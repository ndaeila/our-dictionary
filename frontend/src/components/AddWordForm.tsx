import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Box,
  Stack,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Category, CustomField } from '../types/dictionary';

interface AddWordFormProps {
  categories: Category[];
  selectedCategory?: string;
  onAddWord: (word: {
    term: string;
    definition: string;
    category: string;
    customFields: CustomField[];
  }) => void;
}

export default function AddWordForm({ categories, selectedCategory, onAddWord }: AddWordFormProps) {
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');
  const [category, setCategory] = useState('');
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [useSelectedCategory, setUseSelectedCategory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term || !definition || (!category && !useSelectedCategory) || (useSelectedCategory && !selectedCategory)) return;

    onAddWord({
      term,
      definition,
      category: useSelectedCategory ? selectedCategory! : category,
      customFields,
    });

    // Reset form
    setTerm('');
    setDefinition('');
    setCategory('');
    setCustomFields([]);
    setUseSelectedCategory(false);
  };

  // Build category hierarchy for display
  const getCategoryPath = (category: Category): string => {
    const path: string[] = [category.name];
    let current = category;
    while (current.parentId) {
      const parent = categories.find(c => c.id === current.parentId);
      if (parent) {
        path.unshift(parent.name);
        current = parent;
      } else {
        break;
      }
    }
    return path.join(' > ');
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Term"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          required
          fullWidth
          autoFocus
        />

        <TextField
          label="Definition"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          required
          fullWidth
          multiline
          rows={3}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={useSelectedCategory}
              onChange={(e) => {
                setUseSelectedCategory(e.target.checked);
                if (e.target.checked) {
                  setCategory('');
                }
              }}
              disabled={!selectedCategory}
            />
          }
          label="Use selected category"
        />

        <FormControl fullWidth required disabled={useSelectedCategory}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value as string)}
            label="Category"
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {getCategoryPath(cat)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={!term || !definition || (!category && !useSelectedCategory) || (useSelectedCategory && !selectedCategory)}
          fullWidth
        >
          Add Word
        </Button>
      </Stack>
    </Box>
  );
}