import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Search, Filter, SortAsc, SortDesc, Sparkles, Loader2, Lightbulb } from 'lucide-react';
import type { SearchFilters, MediaItem } from '../types';
import { MEDIA_TYPES, MEDIA_STATUSES, SORT_OPTIONS } from '../constants';
import { enhanceSearchQuery, generateSearchSuggestions, type SearchSuggestion } from '../services/aiSearchService';

interface SearchAndFilterProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  totalItems: number;
  filteredItems: number;
  mediaItems: MediaItem[];
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  filters,
  onFiltersChange,
  totalItems,
  filteredItems,
  mediaItems,
}) => {
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiEnabled] = useState(!!import.meta.env.VITE_OPENAI_API_KEY);

  const updateFilter = useCallback((key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  }, [filters, onFiltersChange]);

  const clearFilters = useCallback(() => {
    onFiltersChange({
      query: '',
      type: undefined,
      status: undefined,
      genre: undefined,
      sortBy: 'title',
      sortOrder: 'asc',
    });
  }, [onFiltersChange]);

  const toggleSortOrder = useCallback(() => {
    updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc');
  }, [filters.sortOrder, updateFilter]);

  // AI Search Handler
  const handleAiSearch = useCallback(async () => {
    if (!aiEnabled || !filters.query.trim()) return;
    
    setIsAiSearching(true);
    try {
      const result = await enhanceSearchQuery(filters.query, mediaItems);
      updateFilter('query', result.enhancedQuery);
      setSearchSuggestions(result.suggestions);
    } catch (error) {
      console.error('AI search failed:', error);
    } finally {
      setIsAiSearching(false);
    }
  }, [aiEnabled, filters.query, mediaItems, updateFilter]);

  // Generate suggestions when component mounts
  useEffect(() => {
    if (mediaItems.length > 0) {
      const suggestions = generateSearchSuggestions(mediaItems);
      setSearchSuggestions(suggestions);
    }
  }, [mediaItems]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle suggestion click
  const applySuggestion = useCallback((suggestion: SearchSuggestion) => {
    updateFilter('query', suggestion.query);
    if (suggestion.filters) {
      Object.entries(suggestion.filters).forEach(([key, value]) => {
        if (value) updateFilter(key as keyof SearchFilters, value);
      });
    }
    setShowSuggestions(false);
  }, [updateFilter]);

  const hasActiveFilters = useMemo(() => 
    filters.query || filters.type || filters.status || filters.genre,
    [filters.query, filters.type, filters.status, filters.genre]
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {aiEnabled && filters.query === '' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <Sparkles className="h-4 w-4 text-blue-500 mr-2" />
            <span className="text-sm text-blue-700">
              <strong>AI Search:</strong> Try natural language queries like "action movies I haven't watched" or "programming books"
            </span>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={aiEnabled ? "Try: 'sci-fi movies', 'books I haven't read', 'games from the 90s'..." : "Search by title, creator, genre, or tags..."}
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && aiEnabled) {
                handleAiSearch();
              }
            }}
            className="block w-full pl-10 pr-20 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
            {aiEnabled && filters.query && (
              <button
                onClick={handleAiSearch}
                disabled={isAiSearching}
                className="flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors disabled:opacity-50"
                title="Enhance search with AI"
              >
                {isAiSearching ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <Sparkles className="h-3 w-3 mr-1" />
                )}
                AI
              </button>
            )}
            {aiEnabled && (
              <div className="text-blue-500" title="AI-powered search available">
                <Sparkles className="h-4 w-4" />
              </div>
            )}
            {!aiEnabled && (
              <div className="text-gray-400" title="Add OpenAI API key for AI search">
                <Search className="h-4 w-4" />
              </div>
            )}
          </div>
          
          {/* Search Suggestions Dropdown */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-64 overflow-y-auto">
              <div className="p-2 border-b border-gray-100">
                <div className="flex items-center text-xs text-gray-500">
                  <Lightbulb className="h-3 w-3 mr-1" />
                  Quick search suggestions
                </div>
              </div>
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => applySuggestion(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-800">
                    {suggestion.query}
                  </div>
                  <div className="text-xs text-gray-500">
                    {suggestion.description}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filters.type || ''}
              onChange={(e) => updateFilter('type', e.target.value || undefined)}
              className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              {MEDIA_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) => updateFilter('status', e.target.value || undefined)}
              className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              {MEDIA_STATUSES.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Genre</label>
            <input
              type="text"
              placeholder="Filter by genre"
              value={filters.genre || ''}
              onChange={(e) => updateFilter('genre', e.target.value || undefined)}
              className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Order</label>
            <button
              onClick={toggleSortOrder}
              className="w-full flex items-center justify-center gap-1 text-sm border border-gray-300 rounded-md px-2 py-1 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              {filters.sortOrder === 'asc' ? (
                <>
                  <SortAsc size={14} />
                  A-Z
                </>
              ) : (
                <>
                  <SortDesc size={14} />
                  Z-A
                </>
              )}
            </button>
          </div>

          <div className="flex items-end">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-md px-2 py-1 hover:bg-red-50 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Filter size={14} />
            <span>
              Showing {filteredItems} of {totalItems} items
              {hasActiveFilters && ` (filtered)`}
            </span>
          </div>
          
          {filteredItems !== totalItems && (
            <div className="text-blue-600">
              {Math.round((filteredItems / totalItems) * 100)}% match
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;
