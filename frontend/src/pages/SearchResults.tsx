import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import WordList from '../components/WordList';
import { Word } from '../types/dictionary';
import { useUrlState } from '../hooks/useUrlState';

interface SearchResultsProps {
  words: Word[];
  onWordClick: (id: string) => void;
  isSelectMode?: boolean;
  selectedItems?: string[];
}

export default function SearchResults({ 
  words, 
  onWordClick, 
  isSelectMode = false, 
  selectedItems = [] 
}: SearchResultsProps) {
  const [searchParams] = useSearchParams();
  const { page, updateUrl } = useUrlState();
  const query = searchParams.get('q') || '';
  const pageSize = 10;

  const filteredWords = words.filter((word) => 
    word.term.toLowerCase().includes(query.toLowerCase()) ||
    word.definition.toLowerCase().includes(query.toLowerCase())
  );

  const handlePageChange = (newPage: number) => {
    updateUrl(undefined, undefined, newPage);
  };

  // Calculate paginated subset
  const startIndex = (page - 1) * pageSize;
  const paginatedWords = filteredWords.slice(startIndex, startIndex + pageSize);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Search Results for "{query}"
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Found {filteredWords.length} {filteredWords.length === 1 ? 'result' : 'results'}
        </Typography>
      </Box>

      <WordList 
        words={paginatedWords}
        onWordClick={onWordClick} 
        isSelectMode={isSelectMode}
        selectedItems={selectedItems}
        page={page}
        pageSize={pageSize}
        total={filteredWords.length}
        onPageChange={handlePageChange}
      />
    </Container>
  );
} 