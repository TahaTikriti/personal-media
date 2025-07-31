import { useState, useEffect, useCallback, useMemo } from 'react';
import type { MediaItem, SearchFilters } from '../types';
import { loadMediaItems, saveMediaItems, smartSearch } from '../utils';

export const useMediaCollection = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  
  // Load data on mount
  useEffect(() => {
    const items = loadMediaItems();
    setMediaItems(items);
  }, []);

  // Auto-save when items change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveMediaItems(mediaItems);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [mediaItems]);

  const addItem = useCallback((item: MediaItem) => {
    setMediaItems(prev => [...prev, item]);
  }, []);

  const updateItem = useCallback((updatedItem: MediaItem) => {
    setMediaItems(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const importItems = useCallback((items: MediaItem[]) => {
    setMediaItems(items);
  }, []);

  const addBulkItems = useCallback((items: MediaItem[]) => {
    setMediaItems(prev => [...prev, ...items]);
  }, []);

  return {
    mediaItems,
    addItem,
    updateItem,
    deleteItem,
    importItems,
    addBulkItems,
  };
};

export const useFilteredItems = (items: MediaItem[], filters: SearchFilters) => {
  return useMemo(() => {
    let filtered = items;

    // Apply search with early return for performance
    if (filters.query) {
      filtered = smartSearch(filtered, filters.query);
    }

    // Chain filters efficiently
    if (filters.type) {
      filtered = filtered.filter(item => item.type === filters.type);
    }

    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    if (filters.genre) {
      const lowerGenre = filters.genre.toLowerCase();
      filtered = filtered.filter(item => 
        item.genre.toLowerCase().includes(lowerGenre)
      );
    }

    // Optimized sorting with value caching
    if (filters.sortBy) {
      const sortMultiplier = filters.sortOrder === 'asc' ? 1 : -1;
      
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (filters.sortBy) {
          case 'title':
          case 'creator':
            aValue = a[filters.sortBy].toLowerCase();
            bValue = b[filters.sortBy].toLowerCase();
            break;
          case 'releaseDate':
            aValue = new Date(a.releaseDate || '1900-01-01').getTime();
            bValue = new Date(b.releaseDate || '1900-01-01').getTime();
            break;
          case 'dateAdded':
            aValue = new Date(a.dateAdded).getTime();
            bValue = new Date(b.dateAdded).getTime();
            break;
          case 'rating':
            aValue = a.rating || 0;
            bValue = b.rating || 0;
            break;
          default:
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
        }

        return aValue < bValue ? -sortMultiplier : aValue > bValue ? sortMultiplier : 0;
      });
    }

    return filtered;
  }, [items, filters]);
};
