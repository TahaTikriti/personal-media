import type { MediaItem } from './types';

const STORAGE_KEY = 'personal-media-collection';

// Cache for localStorage operations
let itemsCache: MediaItem[] | null = null;

export const loadMediaItems = (): MediaItem[] => {
  if (itemsCache) return itemsCache;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    itemsCache = stored ? JSON.parse(stored) : [];
    return itemsCache || [];
  } catch (error) {
    console.error('Error loading media items:', error);
    itemsCache = [];
    return [];
  }
};

export const saveMediaItems = (items: MediaItem[]): void => {
  try {
    itemsCache = items;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving media items:', error);
  }
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return dateString;
  }
};

export const getGenreColor = (genre: string): string => {
  const colors: Record<string, string> = {
    action: '#ef4444',
    adventure: '#f97316',
    comedy: '#eab308',
    drama: '#8b5cf6',
    horror: '#dc2626',
    romance: '#ec4899',
    'sci-fi': '#06b6d4',
    fantasy: '#10b981',
    thriller: '#6366f1',
    mystery: '#64748b',
    animation: '#f59e0b',
    documentary: '#84cc16',
    biography: '#14b8a6',
    history: '#a855f7',
    war: '#71717a',
    western: '#d97706',
    crime: '#991b1b',
    family: '#22c55e',
    music: '#3b82f6',
    sport: '#059669',
  };
  
  return colors[genre.toLowerCase()] || '#6b7280';
};

// AI-powered genre suggestion based on title and creator
export const suggestGenre = (title: string, creator: string, type: string): string[] => {
  const suggestions: string[] = [];
  const lowerTitle = title.toLowerCase();
  const lowerCreator = creator.toLowerCase();
  
  // Simple keyword-based suggestions
  const keywords = {
    action: ['action', 'fight', 'battle', 'war', 'combat', 'gun', 'shoot'],
    comedy: ['comedy', 'funny', 'laugh', 'humor', 'joke', 'comic'],
    horror: ['horror', 'scary', 'fear', 'terror', 'ghost', 'zombie', 'demon'],
    romance: ['love', 'romance', 'romantic', 'heart', 'kiss', 'wedding'],
    'sci-fi': ['sci-fi', 'science', 'space', 'robot', 'alien', 'future', 'cyber'],
    fantasy: ['fantasy', 'magic', 'wizard', 'dragon', 'quest', 'adventure'],
    thriller: ['thriller', 'suspense', 'mystery', 'crime', 'detective'],
    drama: ['drama', 'life', 'story', 'character', 'emotional'],
  };
  
  for (const [genre, words] of Object.entries(keywords)) {
    if (words.some(word => lowerTitle.includes(word) || lowerCreator.includes(word))) {
      suggestions.push(genre);
    }
  }
  
  // Default suggestions based on media type
  if (suggestions.length === 0) {
    switch (type) {
      case 'movie':
        suggestions.push('drama', 'action', 'comedy');
        break;
      case 'game':
        suggestions.push('action', 'adventure', 'strategy');
        break;
      case 'music':
        suggestions.push('pop', 'rock', 'electronic');
        break;
      case 'book':
        suggestions.push('fiction', 'non-fiction', 'biography');
        break;
      default:
        suggestions.push('entertainment');
    }
  }
  
  return suggestions.slice(0, 3);
};

// Optimized smart search with better performance
export const smartSearch = (items: MediaItem[], query: string): MediaItem[] => {
  if (!query.trim()) return items;
  
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
  if (searchTerms.length === 0) return items;
  
  return items.filter(item => {
    // Pre-compile searchable text for better performance
    const searchableText = [
      item.title,
      item.creator,
      item.genre,
      item.type,
      item.status,
      item.notes || '',
      ...item.tags
    ].join(' ').toLowerCase();
    
    // Use every for AND logic (all terms must match)
    return searchTerms.every(term => searchableText.includes(term));
  });
};
