import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Word, Category } from '../types/dictionary';

interface WordDetailsProps {
  word: Word | null;
  category?: Category;
  onClose: () => void;
}

export default function WordDetails({ word, category, onClose }: WordDetailsProps) {
  if (!word) return null;

  return (
    <Dialog 
      open={Boolean(word)} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" component="span">
            {word.term}
          </Typography>
          {category && (
            <Chip
              label={category.name}
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Definition
            </Typography>
            <Typography variant="body1">
              {word.definition}
            </Typography>
          </Box>

          {word.customFields && word.customFields.length > 0 && (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Additional Information
                </Typography>
                <Stack spacing={1}>
                  {word.customFields.map((field, index) => (
                    <Box key={index}>
                      <Typography variant="subtitle2">
                        {field.name}
                      </Typography>
                      <Typography variant="body2">
                        {field.value}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </>
          )}

          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Created: {word.createdAt.toLocaleDateString()}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
} 