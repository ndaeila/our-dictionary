import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListSubheader,
  IconButton,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import { Category } from '../types/dictionary';

interface AddCategoryFormProps {
  categories: Category[];
  selectedCategory?: string;
  onAddCategory: (category: {
    name: string;
    description: string;
    icon: string;
    parentId?: string;
    customIcon?: string;
  }) => void;
}

// Icon groups for better organization
const iconGroups = {
  'Common Actions': ['Add', 'Edit', 'Delete', 'Search', 'Settings'],
  'Content': ['Folder', 'Category', 'Label', 'Bookmark', 'Star', 'Flag'],
  'Communication': ['Mail', 'Message', 'Chat', 'Forum', 'Announcement'],
  'Education': ['School', 'Book', 'MenuBook', 'LocalLibrary'],
  'Business': ['Business', 'Work', 'AccountBalance', 'AttachMoney'],
  'Technology': ['Computer', 'Laptop', 'Code', 'Cloud', 'Storage'],
  'People': ['Person', 'Group', 'People', 'Public'],
  'Schedule': ['Schedule', 'Today', 'Event', 'CalendarToday'],
  'Location': ['Place', 'LocationOn', 'Map', 'Navigation'],
  'Media': ['Image', 'Movie', 'MusicNote', 'Headphones'],
  'Health': ['LocalHospital', 'Favorite', 'FitnessCenter'],
  'Nature': ['Park', 'Nature', 'WbSunny'],
  'Shopping': ['ShoppingCart', 'Store', 'LocalMall'],
  'Home': ['Home', 'House', 'Build'],
  'Sports': ['Sports', 'SportsBasketball', 'SportsFootball'],
  'Transportation': ['DirectionsCar', 'LocalTaxi', 'Train'],
  'Security': ['Security', 'Lock', 'VpnKey'],
  'Misc': ['Lightbulb', 'EmojiObjects', 'Palette', 'Brush']
};

export default function AddCategoryForm({ categories, selectedCategory, onAddCategory }: AddCategoryFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(Object.values(iconGroups)[0][0]);
  const [customIcon, setCustomIcon] = useState('');
  const [useSelectedAsParent, setUseSelectedAsParent] = useState(false);
  const [parentId, setParentId] = useState<string | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !icon) return;

    onAddCategory({
      name,
      description,
      icon,
      parentId: useSelectedAsParent ? selectedCategory : parentId,
      customIcon: customIcon || undefined,
    });

    // Reset form
    setName('');
    setDescription('');
    setIcon(Object.values(iconGroups)[0][0]);
    setCustomIcon('');
    setUseSelectedAsParent(false);
    setParentId(undefined);
  };

  const renderIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon /> : null;
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
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          autoFocus
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={2}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={useSelectedAsParent}
              onChange={(e) => {
                setUseSelectedAsParent(e.target.checked);
                if (e.target.checked) {
                  setParentId(undefined);
                }
              }}
              disabled={!selectedCategory}
            />
          }
          label="Use selected category as parent"
        />

        <FormControl fullWidth disabled={useSelectedAsParent}>
          <InputLabel>Parent Category (optional)</InputLabel>
          <Select
            value={parentId || ''}
            onChange={(e) => setParentId(e.target.value || undefined)}
            label="Parent Category (optional)"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {getCategoryPath(category)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth required>
          <InputLabel>Icon</InputLabel>
          <Select
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            label="Icon"
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {renderIcon(selected)}
                {selected}
              </Box>
            )}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 400
                }
              }
            }}
          >
            {Object.entries(iconGroups).map(([groupName, icons]) => [
              <ListSubheader 
                key={groupName}
                sx={{ 
                  bgcolor: 'background.paper',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1
                }}
              >
                {groupName}
              </ListSubheader>,
              ...icons.map(iconName => (
                <MenuItem key={iconName} value={iconName}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {renderIcon(iconName)}
                    {iconName}
                  </Box>
                </MenuItem>
              ))
            ])}
          </Select>
        </FormControl>

        <TextField
          label="Custom Icon URL (optional)"
          value={customIcon}
          onChange={(e) => setCustomIcon(e.target.value)}
          fullWidth
          helperText="Enter a URL to use a custom icon instead of the selected icon"
        />

        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={!name || !icon}
          fullWidth
        >
          Add Category
        </Button>
      </Stack>
    </Box>
  );
}