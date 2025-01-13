import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { storage } from '../utils/storage';

jest.mock('../utils/storage');

describe('CSV Import', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should open import dialog when clicking import button', async () => {
    render(<App />);
    
    // Open SpeedDial
    const speedDialButton = screen.getByLabelText('Add');
    await userEvent.click(speedDialButton);

    // Click import button
    const importButton = screen.getByLabelText('Import CSV');
    await userEvent.click(importButton);

    // Check if dialog is open
    expect(screen.getByText('Import Words from CSV')).toBeInTheDocument();
    expect(screen.getByText('Sample CSV Format:')).toBeInTheDocument();
  });

  it('should display sample data in a table format', async () => {
    render(<App />);
    
    // Open SpeedDial and import dialog
    const speedDialButton = screen.getByLabelText('Add');
    await userEvent.click(speedDialButton);
    const importButton = screen.getByLabelText('Import CSV');
    await userEvent.click(importButton);

    // Check table headers
    expect(screen.getByText('term')).toBeInTheDocument();
    expect(screen.getByText('definition')).toBeInTheDocument();
    expect(screen.getByText('path')).toBeInTheDocument();

    // Check sample data
    expect(screen.getByText('Orange')).toBeInTheDocument();
    expect(screen.getByText('Lemon')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('should handle file upload through drag and drop', async () => {
    const mockImportResponse = {
      categories: [
        { id: '1', name: 'Food', parentId: null },
        { id: '2', name: 'Fruits', parentId: '1' },
        { id: '3', name: 'Citrus', parentId: '2' }
      ],
      words: {
        words: [
          { id: '1', term: 'Orange', definition: 'A citrus fruit', category: '3' }
        ]
      }
    };

    (storage.importCSV as jest.Mock).mockResolvedValue(mockImportResponse);

    render(<App />);
    
    // Open import dialog
    const speedDialButton = screen.getByLabelText('Add');
    await userEvent.click(speedDialButton);
    const importButton = screen.getByLabelText('Import CSV');
    await userEvent.click(importButton);

    // Create a file and trigger drop
    const file = new File(
      ['term,definition,path\nOrange,A citrus fruit,Food > Fruits > Citrus'],
      'test.csv',
      { type: 'text/csv' }
    );

    const dropZone = screen.getByText(/Drag and drop a CSV file here/);
    await fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file]
      }
    });

    // Verify import was called
    await waitFor(() => {
      expect(storage.importCSV).toHaveBeenCalledWith(file);
    });
  });

  it('should handle file upload through file input', async () => {
    const mockImportResponse = {
      categories: [
        { id: '1', name: 'Food', parentId: null },
        { id: '2', name: 'Fruits', parentId: '1' },
        { id: '3', name: 'Citrus', parentId: '2' }
      ],
      words: {
        words: [
          { id: '1', term: 'Orange', definition: 'A citrus fruit', category: '3' }
        ]
      }
    };

    (storage.importCSV as jest.Mock).mockResolvedValue(mockImportResponse);

    render(<App />);
    
    // Open import dialog
    const speedDialButton = screen.getByLabelText('Add');
    await userEvent.click(speedDialButton);
    const importButton = screen.getByLabelText('Import CSV');
    await userEvent.click(importButton);

    // Trigger file input
    const fileInput = screen.getByLabelText('Upload CSV file');
    const file = new File(
      ['term,definition,path\nOrange,A citrus fruit,Food > Fruits > Citrus'],
      'test.csv',
      { type: 'text/csv' }
    );

    await userEvent.upload(fileInput, file);

    // Verify import was called
    await waitFor(() => {
      expect(storage.importCSV).toHaveBeenCalledWith(file);
    });
  });

  it('should handle paste input', async () => {
    const mockImportResponse = {
      categories: [
        { id: '1', name: 'Food', parentId: null },
        { id: '2', name: 'Fruits', parentId: '1' },
        { id: '3', name: 'Citrus', parentId: '2' }
      ],
      words: {
        words: [
          { id: '1', term: 'Orange', definition: 'A citrus fruit', category: '3' }
        ]
      }
    };

    (storage.importCSV as jest.Mock).mockResolvedValue(mockImportResponse);

    render(<App />);
    
    // Open import dialog
    const speedDialButton = screen.getByLabelText('Add');
    await userEvent.click(speedDialButton);
    const importButton = screen.getByLabelText('Import CSV');
    await userEvent.click(importButton);

    // Paste CSV content
    const textarea = screen.getByLabelText('Paste CSV content');
    const csvContent = 'term,definition,path\nOrange,A citrus fruit,Food > Fruits > Citrus';
    await userEvent.type(textarea, csvContent);

    // Click import button
    const importPasteButton = screen.getByText('Import from Paste');
    await userEvent.click(importPasteButton);

    // Verify import was called with a File object created from the pasted content
    await waitFor(() => {
      expect(storage.importCSV).toHaveBeenCalled();
      const calledFile = (storage.importCSV as jest.Mock).mock.calls[0][0];
      expect(calledFile).toBeInstanceOf(File);
      expect(calledFile.type).toBe('text/csv');
    });
  });
}); 