import * as React from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Checkbox, 
  IconButton,
  Button,
  Chip,
  Stack,
  Collapse,
  Divider
} from '@mui/material';
import { 
  ChevronLeft, 
  ChevronRight,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import * as Icons from '@mui/icons-material';
import { Category } from '../types/dictionary';

interface CategoryGridProps {
  categories: Category[];
  selectedCategory?: string;
  onSelectCategory: (id: string) => void;
  isSelectMode?: boolean;
  selectedItems?: string[];
}

interface CategoryCarouselProps {
  categories: Category[];
  selectedCategory?: string;
  onSelectCategory: (id: string) => void;
  isSelectMode?: boolean;
  selectedItems?: string[];
  level: number;
  parentId?: string | null;
  isLastLevel: boolean;
  hasSelectedChild: boolean;
}

function CategoryCarousel({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  isSelectMode = false,
  selectedItems = [],
  level,
  parentId,
  isLastLevel,
  hasSelectedChild
}: CategoryCarouselProps & {
  isLastLevel: boolean;
  hasSelectedChild: boolean;
}) {
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Filter categories for this level
  const levelCategories = categories.filter(cat => cat.parentId === parentId);
  const hasChildren = levelCategories.some(cat => categories.some(c => c.parentId === cat.id));
  
  // Move selected category to front if it exists in this level
  const sortedCategories = selectedCategory 
    ? [
        ...levelCategories.filter(cat => cat.id === selectedCategory),
        ...levelCategories.filter(cat => cat.id !== selectedCategory)
      ]
    : levelCategories;
  
  if (sortedCategories.length === 0) {
    return null;
  }

  // Determine if this level should be expanded
  const shouldBeExpanded = 
    isLastLevel || // Always expand the last level
    (!hasSelectedChild && !selectedCategory) || // Expand first row when nothing is selected
    (!hasChildren && selectedCategory && levelCategories.some(cat => cat.id === selectedCategory)); // Expand if selected category is in this level and has no children

  const handleScroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = containerRef.current 
    ? scrollPosition < containerRef.current.scrollWidth - containerRef.current.clientWidth
    : false;

  const renderIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon sx={{ mb: 1 }} /> : null;
  };

  return (
    <Box>
      {level === 0 ? (
        <Box sx={{ 
          px: 1.5, 
          py: 0.75,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Typography variant="subtitle2">
            Categories
          </Typography>
        </Box>
      ) : null}

      <Box sx={{ position: 'relative', px: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        {canScrollLeft && (
          <IconButton
            onClick={() => handleScroll('left')}
            sx={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1,
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': { bgcolor: 'background.paper' }
            }}
            size="small"
          >
            <ChevronLeft />
          </IconButton>
        )}

        {canScrollRight && (
          <IconButton
            onClick={() => handleScroll('right')}
            sx={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1,
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': { bgcolor: 'background.paper' }
            }}
            size="small"
          >
            <ChevronRight />
          </IconButton>
        )}

        <Box
          ref={containerRef}
          sx={{
            display: 'flex',
            gap: 0.75,
            py: 1,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none'
          }}
        >
          {shouldBeExpanded ? (
            // Expanded view with icons and descriptions
            sortedCategories.map((category) => (
              <Paper
                key={category.id}
                elevation={0}
                sx={{
                  p: 1,
                  cursor: 'pointer',
                  bgcolor: selectedCategory === category.id ? 'primary.light' : 'grey.50',
                  minWidth: '140px',
                  maxWidth: '140px',
                  position: 'relative',
                  '&:hover': {
                    bgcolor: selectedCategory === category.id ? 'primary.light' : 'action.hover',
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.25,
                  borderRadius: 1,
                  border: 1,
                  borderColor: selectedCategory === category.id ? 'primary.main' : 'divider'
                }}
                onClick={() => onSelectCategory(category.id)}
              >
                {isSelectMode && (
                  <Checkbox
                    checked={selectedItems.includes(category.id)}
                    onChange={() => onSelectCategory(category.id)}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    sx={{ position: 'absolute', right: 2, top: 2 }}
                    size="small"
                  />
                )}
                {category.icon && renderIcon(category.icon)}
                <Typography variant="subtitle2" noWrap>
                  {category.name}
                </Typography>
                {category.description && (
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      textAlign: 'center'
                    }}
                  >
                    {category.description}
                  </Typography>
                )}
              </Paper>
            ))
          ) : (
            // Condensed view with chips
            <Stack 
              direction="row" 
              spacing={0.5} 
              flexWrap="wrap" 
              sx={{ 
                py: 0.5,
                gap: 0.5
              }}
            >
              {sortedCategories.map((category) => (
                <Chip
                  key={category.id}
                  label={category.name}
                  onClick={() => onSelectCategory(category.id)}
                  color={selectedCategory === category.id ? "primary" : "default"}
                  variant={selectedCategory === category.id ? "filled" : "outlined"}
                  size="small"
                  sx={{ 
                    '&:hover': { bgcolor: selectedCategory === category.id ? 'primary.light' : 'action.hover' },
                    m: 0.25,
                    ml: '0 !important'
                  }}
                  {...(isSelectMode && {
                    deleteIcon: (
                      <Checkbox
                        checked={selectedItems.includes(category.id)}
                        onChange={() => onSelectCategory(category.id)}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        size="small"
                        sx={{ mr: -1 }}
                      />
                    ),
                    onDelete: () => {} // Required for deleteIcon to show
                  })}
                />
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default function CategoryGrid(props: CategoryGridProps) {
  // Find the selected category to get its parent chain
  const selectedCategory = props.selectedCategory 
    ? props.categories.find(cat => cat.id === props.selectedCategory)
    : undefined;

  // Get parent chain
  const parentChain = React.useMemo(() => {
    if (!selectedCategory) return [];
    const chain = [];
    let current = selectedCategory;
    while (current.parentId) {
      chain.unshift(current.parentId);
      current = props.categories.find(cat => cat.id === current.parentId)!;
    }
    return chain;
  }, [selectedCategory, props.categories]);

  // Check if selected category has children
  const hasChildren = selectedCategory 
    ? props.categories.some(cat => cat.parentId === selectedCategory.id)
    : false;

  // Build all levels
  const levels = React.useMemo(() => {
    const result = [
      // Root level
      { parentId: null as string | null, level: 0 }
    ];

    // Add parent chain levels
    parentChain.forEach((parentId, index) => {
      result.push({ parentId: parentId as string | null, level: index + 1 });
    });

    // Add selected category's children level if it exists
    if (props.selectedCategory && hasChildren) {
      result.push({ 
        parentId: props.selectedCategory as string | null, 
        level: parentChain.length + 1 
      });
    }

    return result;
  }, [parentChain, props.selectedCategory, hasChildren]);

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        bgcolor: 'background.paper',
        borderRadius: 1,
        position: 'relative',
        overflow: 'hidden',
        mb: 2
      }}
    >
      {levels.map((level, index) => (
        <CategoryCarousel 
          key={level.parentId || 'root'} 
          {...props} 
          level={level.level} 
          parentId={level.parentId}
          isLastLevel={index === levels.length - 1}
          hasSelectedChild={index < levels.length - 1}
        />
      ))}
    </Paper>
  );
}