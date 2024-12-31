import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useUrlState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateUrl = (wordId?: string, categoryId?: string) => {
    const newParams = new URLSearchParams();
    if (wordId) newParams.set('word', wordId);
    if (categoryId) newParams.set('category', categoryId);
    setSearchParams(newParams);
  };

  return {
    wordId: searchParams.get('word') || null,
    categoryId: searchParams.get('category') || null,
    updateUrl,
  };
}