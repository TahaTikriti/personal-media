import React, { useCallback, useMemo } from 'react';
import { Search, Filter, SortAsc, SortDesc, Sparkles } from 'lucide-react';
import type { SearchFilters } from '../types';
import { MEDIA_TYPES, MEDIA_STATUSES, SORT_OPTIONS } from '../constants';

interface SearchAndFilterProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  totalItems: number;
  filteredItems: number;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  filters,
  onFiltersChange,
  totalItems,
  filteredItems,
}) => {
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

  const hasActiveFilters = useMemo(() => 
    filters.query || filters.type || filters.status || filters.genre,
    [filters.query, filters.type, filters.status, filters.genre]
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by title, creator, genre, or tags..."
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {filters.query && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center" title="AI-powered search">
              <Sparkles className="h-4 w-4 text-blue-500" />
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
