import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Book } from 'lucide-react';
import { 
  Container, 
  Box, 
  Typography, 
  AppBar, 
  Toolbar, 
  CircularProgress, 
  Button, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Paper,
  Divider
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Edit as EditIcon,
  Add as AddIcon,
  Category as CategoryIcon,
  TextFields as WordIcon,
  Close as CloseIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import SearchBar from './components/SearchBar';
import CategoryGrid from './components/CategoryGrid';
import WordList from './components/WordList';
import AddWordForm from './components/AddWordForm';
import AddCategoryForm from './components/AddCategoryForm';
import WordDetails from './components/WordDetails';
import SearchResults from './pages/SearchResults';
import { Word, Category, CustomField } from './types/dictionary';
import { storage } from './utils/storage';
import { useUrlState } from './hooks/useUrlState';

function App() {
  const [words, setWords] = React.useState<Word[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isSelectMode, setIsSelectMode] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [addDialogOpen, setAddDialogOpen] = React.useState<'word' | 'category' | null>(null);
  const { wordId, categoryId, page, updateUrl } = useUrlState();
  const [pageSize] = React.useState(10);
  const [totalWords, setTotalWords] = React.useState(0);

  // Get the currently selected word and its category
  const selectedWord = wordId ? words.find(w => w.id === wordId) || null : null;
  const selectedWordCategory = selectedWord ? categories.find(c => c.id === selectedWord.category) : undefined;

  // Load initial data
  React.useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories
        const categoriesData = await storage.loadData();
        setCategories(categoriesData.categories);
        
        // Load paginated words
        const response = await fetch(`http://localhost:3002/api/words?page=${page}&pageSize=${pageSize}&categoryId=${categoryId || ''}&searchTerm=${searchTerm || ''}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const { words, total } = await response.json();
        setWords(words.map((word: any) => ({
          ...word,
          createdAt: new Date(word.createdAt)
        })));
        setTotalWords(total);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [page, pageSize, categoryId, searchTerm]);

  // Save data whenever it changes
  React.useEffect(() => {
    const saveData = async () => {
      try {
        await storage.saveData(categories, words);
      } catch (error) {
        console.error('Failed to save data:', error);
      }
    };
    if (!loading) {
      saveData();
    }
  }, [categories, words, loading]);

  // Handle URL-based navigation
  React.useEffect(() => {
    // Removed the automatic category update
  }, [wordId, categoryId, words, updateUrl]);

  const handleCategorySelect = (selectedCategoryId: string) => {
    if (isSelectMode) {
      setSelectedItems((prev: string[]) => 
        prev.includes(selectedCategoryId) 
          ? prev.filter((id: string) => id !== selectedCategoryId)
          : [...prev, selectedCategoryId]
      );
    } else {
      // If clicking the currently selected category, deselect it
      if (categoryId === selectedCategoryId) {
        updateUrl(wordId, null, 1);  // Reset to page 1 when deselecting category
      } else {
        updateUrl(wordId, selectedCategoryId, 1);  // Reset to page 1 when selecting new category
      }
    }
  };

  const handleWordClick = (selectedWordId: string) => {
    if (isSelectMode) {
      setSelectedItems((prev: string[]) => 
        prev.includes(selectedWordId) 
          ? prev.filter((id: string) => id !== selectedWordId)
          : [...prev, selectedWordId]
      );
    } else {
      updateUrl(selectedWordId, categoryId);
    }
  };

  const handlePageChange = (newPage: number) => {
    updateUrl(wordId, categoryId, newPage);
  };

  const handleDeleteSelected = async () => {
    try {
      // Delete selected words
      const selectedWords = words.filter((word: Word) => selectedItems.includes(word.id));
      for (const word of selectedWords) {
        await storage.deleteWord(word.id);
      }

      // Delete selected categories
      const selectedCategories = categories.filter((cat: Category) => selectedItems.includes(cat.id));
      for (const category of selectedCategories) {
        await storage.deleteCategory(category.id);
      }

      // Reload data to ensure everything is in sync
      const data = await storage.loadData();
      setCategories(data.categories);
      setWords(data.words);

      // Clear selection and exit select mode
      setSelectedItems([]);
      setIsSelectMode(false);
    } catch (error) {
      console.error('Failed to delete items:', error);
    }
  };

  const filteredWords = React.useMemo(() => {
    return words.filter((word: Word) => {
      const matchesSearch = word.term.toLowerCase().startsWith(searchTerm.toLowerCase());
      const matchesCategory = categoryId ? word.category === categoryId : true;
      return matchesSearch && matchesCategory;
    });
  }, [words, searchTerm, categoryId]);

  const handleAddWord = async (newWord: { 
    term: string; 
    definition: string; 
    category: string;
    customFields: CustomField[];
  }) => {
    const word: Word = {
      id: Date.now().toString(),
      ...newWord,
      createdAt: new Date(),
    };
    try {
      await storage.addWord(word);
      setWords((prev: Word[]) => [...prev, word]);
      setAddDialogOpen(null);
    } catch (error) {
      console.error('Failed to add word:', error);
    }
  };

  const handleAddCategory = async (newCategory: { 
    name: string; 
    description: string; 
    icon: string;
    customIcon?: string;
  }) => {
    const id = newCategory.name.toLowerCase().replace(/\s+/g, '-');
    const category: Category = {
      id,
      ...newCategory,
    };
    try {
      await storage.addCategory(category);
      setCategories((prev: Category[]) => [...prev, category]);
      setAddDialogOpen(null);
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  const handleCloseWordDetails = () => {
    updateUrl(undefined, categoryId);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <Book size={32} aria-hidden="true" />
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              OurDictionary
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route
          path="/"
          element={
            <Container maxWidth="lg" sx={{ py: 4 }}>
              <Box sx={{ mb: 4 }}>
                <SearchBar 
                  searchTerm={searchTerm} 
                  onSearch={setSearchTerm}
                  words={words}
                />
              </Box>

              <Paper 
                elevation={0} 
                sx={{ 
                  mb: 4, 
                  bgcolor: 'background.paper',
                  borderRadius: 1
                }}
              >
                <Toolbar variant="dense" sx={{ minHeight: 48 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                    <Button
                      variant={isSelectMode ? "contained" : "outlined"}
                      color={isSelectMode ? "primary" : "inherit"}
                      onClick={() => {
                        setIsSelectMode(!isSelectMode);
                        setSelectedItems([]);
                      }}
                      startIcon={<EditIcon />}
                      size="small"
                    >
                      Select Mode
                    </Button>
                    {isSelectMode && (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteSelected}
                        disabled={selectedItems.length === 0}
                        startIcon={<DeleteIcon />}
                        size="small"
                      >
                        Delete Selected ({selectedItems.length})
                      </Button>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="text"
                      color="inherit"
                      startIcon={<FilterIcon />}
                      size="small"
                    >
                      Filter
                    </Button>
                  </Box>
                </Toolbar>
              </Paper>

              <CategoryGrid
                categories={categories}
                onSelectCategory={handleCategorySelect}
                selectedCategory={categoryId}
                isSelectMode={isSelectMode}
                selectedItems={selectedItems}
              />

              <WordList 
                words={words}
                onWordClick={handleWordClick}
                isSelectMode={isSelectMode}
                selectedItems={selectedItems}
                page={page}
                pageSize={pageSize}
                total={totalWords}
                onPageChange={handlePageChange}
                categories={categories}
              />
            </Container>
          }
        />
        <Route
          path="/search"
          element={
            <SearchResults
              words={words}
              onWordClick={handleWordClick}
              isSelectMode={isSelectMode}
              selectedItems={selectedItems}
            />
          }
        />
      </Routes>

      <SpeedDial
        ariaLabel="Add menu"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<WordIcon />}
          tooltipTitle="Add Word"
          onClick={() => setAddDialogOpen('word')}
        />
        <SpeedDialAction
          icon={<CategoryIcon />}
          tooltipTitle="Add Category"
          onClick={() => setAddDialogOpen('category')}
        />
      </SpeedDial>

      <Dialog 
        open={addDialogOpen !== null} 
        onClose={() => setAddDialogOpen(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {addDialogOpen === 'word' ? 'Add New Word' : 'Add New Category'}
          <IconButton onClick={() => setAddDialogOpen(null)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {addDialogOpen === 'word' ? (
            <AddWordForm 
              categories={categories} 
              selectedCategory={categoryId} 
              onAddWord={handleAddWord} 
            />
          ) : addDialogOpen === 'category' ? (
            <AddCategoryForm 
              categories={categories} 
              selectedCategory={categoryId}
              onAddCategory={handleAddCategory} 
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <WordDetails 
        word={selectedWord}
        category={selectedWordCategory}
        onClose={handleCloseWordDetails}
      />
    </Box>
  );
}

export default function AppWithRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}