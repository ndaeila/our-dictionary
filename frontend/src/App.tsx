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
  Divider,
  DialogContentText,
  DialogActions,
  Input,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Edit as EditIcon,
  Add as AddIcon,
  Category as CategoryIcon,
  TextFields as WordIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  Upload as UploadIcon
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
  const [importDialogOpen, setImportDialogOpen] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
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
        await storage.saveData(categories);
      } catch (error) {
        console.error('Failed to save data:', error);
      }
    };
    if (!loading) {
      saveData();
    }
  }, [categories, loading]);

  // Handle URL-based navigation
  React.useEffect(() => {
    // Removed the automatic category update
  }, [wordId, categoryId, words, updateUrl]);

  const handleCategorySelect = (id: string) => {
    if (isSelectMode) {
      const newSelectedItems = selectedItems.includes(id)
        ? selectedItems.filter(item => item !== id)
        : [...selectedItems, id];
      setSelectedItems(newSelectedItems);
      return;
    }

    if (id === categoryId) {
      updateUrl(undefined, '', 1);
    } else {
      updateUrl(undefined, id, 1);
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
      // Delete selected categories and words from the backend
      for (const id of selectedItems) {
        const isCategory = categories.some(cat => cat.id === id);
        if (isCategory) {
          await storage.deleteCategory(id);
        } else {
          await storage.deleteWord(id);
        }
      }
      
      // Update local state
      const updatedCategories = categories.filter(cat => !selectedItems.includes(cat.id));
      const updatedWords = words.filter(word => !selectedItems.includes(word.id));
      
      setCategories(updatedCategories);
      setWords(updatedWords);
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

  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;
    
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    try {
      const response = await fetch('http://localhost:3002/api/import', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCategories(data.categories);
      setWords(data.words.words.map((word: any) => ({
        ...word,
        createdAt: new Date(word.createdAt)
      })));
      setTotalWords(data.words.total);
      setImportDialogOpen(false);
    } catch (error) {
      console.error('Error importing CSV:', error);
      // TODO: Show error message to user
    }
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

              {isSelectMode && (
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
                        variant="contained"
                        color="error"
                        onClick={handleDeleteSelected}
                        disabled={selectedItems.length === 0}
                        startIcon={<DeleteIcon />}
                        size="small"
                      >
                        Delete Selected ({selectedItems.length})
                      </Button>
                    </Box>
                  </Toolbar>
                </Paper>
              )}

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

      <Dialog 
        open={importDialogOpen} 
        onClose={() => setImportDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Import Words from CSV
          <IconButton
            aria-label="close"
            onClick={() => setImportDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="subtitle1" gutterBottom>
              Import your words and categories from a CSV file. The file should have the following columns:
            </Typography>
            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, my: 2, overflowX: 'auto' }}>
              <Table size="small" sx={{ 
                '& th, & td': { 
                  border: '1px solid rgba(224, 224, 224, 1)',
                  p: 1
                },
                '& th': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  fontWeight: 'bold'
                }
              }}>
                <TableHead>
                  <TableRow>
                    <TableCell>term</TableCell>
                    <TableCell>definition</TableCell>
                    <TableCell>path</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Orange</TableCell>
                    <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      A citrus fruit with a tough bright reddish-yellow rind.
                    </TableCell>
                    <TableCell>Food {'>'} Fruits {'>'} Citrus</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Lemon</TableCell>
                    <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      A yellow citrus fruit with a sour taste.
                    </TableCell>
                    <TableCell>Food {'>'} Fruits {'>'} Citrus</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Apple</TableCell>
                    <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      A round fruit with red or green skin and a whitish interior.
                    </TableCell>
                    <TableCell>Food {'>'} Fruits {'>'} Core</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              • The <strong>term</strong> column contains the word to add<br/>
              • The <strong>definition</strong> column contains the meaning of the word<br/>
              • The <strong>path</strong> column specifies the category hierarchy using <strong>{'>'}</strong> as a separator
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Non-existent categories will be created automatically. You can use existing or new categories.
            </Typography>
          </DialogContentText>
          
          <Box
            sx={{
              mt: 3,
              p: 3,
              border: '2px dashed',
              borderColor: dragActive ? 'primary.main' : 'grey.300',
              borderRadius: 2,
              bgcolor: dragActive ? 'primary.50' : 'background.paper',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const file = e.dataTransfer.files[0];
              if (file && file.type === 'text/csv') {
                const input = document.createElement('input');
                input.type = 'file';
                const event = {
                  target: input,
                  currentTarget: input,
                  bubbles: true,
                  cancelable: true,
                  type: 'change',
                  nativeEvent: new Event('change', { bubbles: true })
                } as React.ChangeEvent<HTMLInputElement>;
                Object.defineProperty(input, 'files', {
                  value: [file],
                  writable: false
                });
                handleImportCSV(event);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleImportCSV}
              style={{ display: 'none' }}
            />
            <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Drag & Drop your CSV file here
            </Typography>
            <Typography variant="body2" color="text.secondary">
              or click to browse
            </Typography>
          </Box>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              You can also paste your CSV content here:
            </Typography>
            <textarea
              style={{
                width: '100%',
                minHeight: '100px',
                marginTop: '8px',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
              placeholder="Paste your CSV content here..."
              onChange={(e) => {
                const content = e.target.value;
                if (content) {
                  const blob = new Blob([content], { type: 'text/csv' });
                  const file = new File([blob], 'pasted.csv', { type: 'text/csv' });
                  const input = document.createElement('input');
                  input.type = 'file';
                  const event = {
                    target: input,
                    currentTarget: input,
                    bubbles: true,
                    cancelable: true,
                    type: 'change',
                    nativeEvent: new Event('change', { bubbles: true })
                  } as React.ChangeEvent<HTMLInputElement>;
                  Object.defineProperty(input, 'files', {
                    value: [file],
                    writable: false
                  });
                  handleImportCSV(event);
                }
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>

      <SpeedDial
        ariaLabel="Add menu"
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16,
          '& .MuiFab-primary': {
            bgcolor: isSelectMode ? 'secondary.main' : 'primary.main',
            '&:hover': {
              bgcolor: isSelectMode ? 'secondary.dark' : 'primary.dark'
            }
          }
        }}
        icon={<SpeedDialIcon />}
        FabProps={{
          color: "primary"
        }}
      >
        <SpeedDialAction
          icon={<UploadIcon />}
          tooltipTitle="Import CSV"
          onClick={() => setImportDialogOpen(true)}
        />
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
        <SpeedDialAction
          icon={<EditIcon />}
          tooltipTitle={isSelectMode ? "Exit Select Mode" : "Enter Select Mode"}
          onClick={() => {
            setIsSelectMode(!isSelectMode);
            setSelectedItems([]);
          }}
          sx={{
            '& .MuiSpeedDialAction-staticTooltipLabel': {
              backgroundColor: isSelectMode ? 'secondary.main' : 'primary.main',
              color: 'white',
              fontWeight: isSelectMode ? 'bold' : 'normal'
            },
            '& .MuiSpeedDialAction-fab': {
              bgcolor: isSelectMode ? 'secondary.main' : 'primary.main',
              color: 'white',
              border: isSelectMode ? 2 : 0,
              borderColor: 'white',
              '&:hover': {
                bgcolor: isSelectMode ? 'secondary.dark' : 'primary.dark',
                borderColor: isSelectMode ? 'white' : 'transparent'
              }
            }
          }}
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