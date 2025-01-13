import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Paper, List, ListItem, ListItemButton, ListItemText, Button } from '@mui/material';
import WordList from '../components/WordList';
import { Word, Category } from '../types/dictionary';
import { useUrlState } from '../hooks/useUrlState';

interface SearchResultsProps {
  words: Word[];
  onWordClick: (id: string) => void;
  isSelectMode?: boolean;
  selectedItems?: string[];
  categories: Category[];
}

export default function SearchResults({ 
  words, 
  onWordClick, 
  isSelectMode = false, 
  selectedItems = [],
  categories
}: SearchResultsProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { page, updateUrl } = useUrlState();
  const query = searchParams.get('q') || '';
  const [showAllCategories, setShowAllCategories] = React.useState(false);
  const pageSize = 10;

  // Filter both words and categories
  const filteredWords = words.filter((word) => 
    word.term.toLowerCase().includes(query.toLowerCase()) ||
    word.definition.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(query.toLowerCase()) ||
    (category.description || '').toLowerCase().includes(query.toLowerCase())
  );

  const handlePageChange = (newPage: number) => {
    updateUrl(undefined, undefined, newPage);
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/?category=${categoryId}`);
  };

  const handleWordClick = (word: Word) => {
    navigate(`/?word=${word.id}&category=${word.category}`);
  };

  // Calculate paginated subset for words
  const startIndex = (page - 1) * pageSize;
  const paginatedWords = filteredWords.slice(startIndex, startIndex + pageSize);

  // Get categories to display
  const displayedCategories = showAllCategories 
    ? filteredCategories 
    : filteredCategories.slice(0, 10);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Search Results for "{query}"
        </Typography>
      </Box>

      {/* Categories Section */}
      <Paper elevation={0} sx={{ mb: 4, bgcolor: 'background.paper' }}>
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
            Categories ({filteredCategories.length})
          </Typography>
        </Box>
        
        {filteredCategories.length > 0 ? (
          <>
            <List disablePadding>
              {displayedCategories.map((category) => (
                <ListItem key={category.id} disablePadding divider>
                  <ListItemButton onClick={() => handleCategoryClick(category.id)}>
                    <ListItemText 
                      primary={category.name}
                      secondary={category.description}
                      primaryTypographyProps={{
                        sx: { fontWeight: 'medium' }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            {filteredCategories.length > 10 && (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Button 
                  onClick={() => setShowAllCategories(!showAllCategories)}
                >
                  {showAllCategories ? 'Show Less' : 'Show More'}
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No matching categories found
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Words Section */}
      <Paper elevation={0} sx={{ bgcolor: 'background.paper' }}>
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
            Words ({filteredWords.length})
          </Typography>
        </Box>

        <List disablePadding>
          {paginatedWords.map((word) => (
            <ListItem key={word.id} disablePadding divider>
              <ListItemButton onClick={() => handleWordClick(word)}>
                <ListItemText 
                  primary={word.term}
                  secondary={word.definition}
                  primaryTypographyProps={{
                    sx: { fontWeight: 'medium' }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {filteredWords.length > pageSize && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Button 
              onClick={() => handlePageChange(page + 1)}
              disabled={startIndex + pageSize >= filteredWords.length}
            >
              Show More
            </Button>
          </Box>
        )}

        {filteredWords.length === 0 && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No matching words found
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
} 