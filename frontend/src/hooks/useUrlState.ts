import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useUrlState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateUrl = (wordId?: string, categoryId?: string, page?: number) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (wordId) {
      newParams.set('word', wordId);
    } else {
      newParams.delete('word');
    }
    
    if (categoryId !== undefined) {
      if (categoryId) {
        newParams.set('category', categoryId);
      } else {
        newParams.delete('category');
      }
      newParams.delete('page');
    }
    
    if (page !== undefined) {
      if (page > 1) {
        newParams.set('page', page.toString());
      } else {
        newParams.delete('page');
      }
    }
    
    setSearchParams(newParams);
  };

  const page = parseInt(searchParams.get('page') || '1');

  return {
    wordId: searchParams.get('word') || undefined,
    categoryId: searchParams.get('category') || undefined,
    page,
    updateUrl,
  };
}