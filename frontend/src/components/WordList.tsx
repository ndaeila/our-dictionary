import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Typography, 
  Paper, 
  Checkbox,
  Pagination,
  Box,
  Chip,
  Stack
} from '@mui/material';
import { Word, Category } from '../types/dictionary';

interface WordListProps {
  words: Word[];
  onWordClick: (id: string) => void;
  isSelectMode: boolean;
  selectedItems: string[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  categories: Category[];
}

export default function WordList({ 
  words, 
  onWordClick, 
  isSelectMode, 
  selectedItems,
  page,
  pageSize,
  total,
  onPageChange,
  categories
}: WordListProps) {
  const totalPages = Math.ceil(total / pageSize);

  const getCategoryPath = (categoryId: string): Category[] => {
    const path: Category[] = [];
    let current = categories.find(c => c.id === categoryId);
    while (current) {
      path.unshift(current);
      current = current.parentId ? categories.find(c => c.id === current.parentId) : undefined;
    }
    return path;
  };

  if (words.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No words found
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ mt: 4, bgcolor: 'background.paper' }}>
      <Box sx={{ 
        px: 2, 
        py: 1, 
        borderBottom: 1, 
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Typography variant="subtitle2">
          Words ({total})
        </Typography>
      </Box>
      
      <Box sx={{ p: 2 }}>
        <List>
          {words.map((word) => (
            <ListItem
              key={word.id}
              disablePadding
            >
              <ListItemButton
                onClick={() => onWordClick(word.id)}
                selected={selectedItems.includes(word.id)}
              >
                {isSelectMode && (
                  <Checkbox
                    edge="start"
                    checked={selectedItems.includes(word.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                )}
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>{word.term}</Typography>
                      <Stack direction="row" spacing={0.5}>
                        {getCategoryPath(word.category).map((category, index) => (
                          <Chip
                            key={category.id}
                            label={category.name}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              pointerEvents: 'none',
                              backgroundColor: 'background.paper'
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  }
                  secondary={word.definition}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, newPage) => onPageChange(newPage)}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
}
