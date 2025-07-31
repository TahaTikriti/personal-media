export type MediaType = 'movie' | 'music' | 'game' | 'book' | 'tv-show';

export type MediaStatus = 'owned' | 'wishlist' | 'currently-using' | 'completed';

export interface MediaItem {
  id: string;
  title: string;
  creator: string;
  type: MediaType;
  genre: string;
  releaseDate: string;
  status: MediaStatus;
  rating?: number;
  notes?: string;
  coverImage?: string;
  tags: string[];
  dateAdded: string;
  dateUpdated: string;
}

export interface FilterOptions {
  type?: MediaType;
  status?: MediaStatus;
  genre?: string;
  rating?: number;
}

export interface SearchFilters {
  query: string;
  type?: MediaType;
  status?: MediaStatus;
  genre?: string;
  sortBy: 'title' | 'creator' | 'releaseDate' | 'dateAdded' | 'rating';
  sortOrder: 'asc' | 'desc';
}
