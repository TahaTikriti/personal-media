import type { MediaType, MediaStatus } from './types';

// Type configurations to reduce repetition
export const MEDIA_TYPES: Array<{value: MediaType, label: string, icon: string}> = [
  { value: 'movie', label: 'Movie', icon: '🎬' },
  { value: 'tv-show', label: 'TV Show', icon: '📺' },
  { value: 'music', label: 'Music', icon: '🎵' },
  { value: 'game', label: 'Game', icon: '🎮' },
  { value: 'book', label: 'Book', icon: '📚' },
];

export const MEDIA_STATUSES: Array<{value: MediaStatus, label: string, color: string}> = [
  { value: 'wishlist', label: 'Wishlist', color: 'bg-blue-100 text-blue-800' },
  { value: 'owned', label: 'Owned', color: 'bg-green-100 text-green-800' },
  { value: 'currently-using', label: 'Currently Using', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'completed', label: 'Completed', color: 'bg-purple-100 text-purple-800' },
];

export const SORT_OPTIONS = [
  { value: 'title', label: 'Title' },
  { value: 'creator', label: 'Creator' },
  { value: 'releaseDate', label: 'Release Date' },
  { value: 'dateAdded', label: 'Date Added' },
  { value: 'rating', label: 'Rating' },
] as const;

// Memoized lookup functions
export const getTypeIcon = (type: MediaType): string => {
  return MEDIA_TYPES.find(t => t.value === type)?.icon || '📱';
};

export const getStatusColor = (status: MediaStatus): string => {
  return MEDIA_STATUSES.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800';
};

export const getStatusLabel = (status: MediaStatus): string => {
  return MEDIA_STATUSES.find(s => s.value === status)?.label || status;
};
