import React, { useState, useCallback, useEffect } from 'react';
import { Plus, FileText, Download, Upload, Database, CheckSquare, Trash2 } from 'lucide-react';
import type { MediaItem, SearchFilters } from './types';
import { useMediaCollection, useFilteredItems } from './hooks/useMediaCollection';
import MediaForm from './components/MediaForm';
import MediaCard from './components/MediaCard';
import SearchAndFilter from './components/SearchAndFilter';
import Statistics from './components/Statistics';
import MockDataModal from './components/MockDataModal';
import './App.css';

function App() {
  const { mediaItems, addItem, updateItem, deleteItem, importItems, addBulkItems } = useMediaCollection();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | undefined>();
  const [showStats, setShowStats] = useState(true);
  const [showMockData, setShowMockData] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showBulkHint, setShowBulkHint] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    sortBy: 'title',
    sortOrder: 'asc',
  });

  // Use custom hook for filtered items
  const filteredItems = useFilteredItems(mediaItems, filters);

  const handleSaveItem = useCallback((item: MediaItem) => {
    if (editingItem) {
      updateItem(item);
    } else {
      addItem(item);
    }
    setShowForm(false);
    setEditingItem(undefined);
  }, [editingItem, updateItem, addItem]);

  const handleEditItem = useCallback((item: MediaItem) => {
    setEditingItem(item);
    setShowForm(true);
  }, []);

  const handleDeleteItem = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(id);
    }
  }, [deleteItem]);

  const handleCancelForm = useCallback(() => {
    setShowForm(false);
    setEditingItem(undefined);
  }, []);

  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(mediaItems, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `media-collection-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [mediaItems]);

  // Show bulk hint after user has accumulated items
  useEffect(() => {
    if (mediaItems.length >= 5 && !isSelectionMode) {
      const hasSeenHint = localStorage.getItem('hasSeenBulkHint');
      if (!hasSeenHint) {
        setShowBulkHint(true);
        setTimeout(() => {
          setShowBulkHint(false);
          localStorage.setItem('hasSeenBulkHint', 'true');
        }, 5000);
      }
    }
  }, [mediaItems.length, isSelectionMode]);

  const handleToggleSelection = useCallback(() => {
    setIsSelectionMode(prev => !prev);
    setSelectedItems(new Set());
    setShowBulkHint(false);
  }, []);

  const handleSelectItem = useCallback((id: string, isSelected: boolean) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    const allIds = new Set(filteredItems.map(item => item.id));
    setSelectedItems(selectedItems.size === filteredItems.length ? new Set() : allIds);
  }, [filteredItems, selectedItems.size]);

  const handleBulkDelete = useCallback(() => {
    if (selectedItems.size === 0) return;
    
    const count = selectedItems.size;
    if (window.confirm(`Are you sure you want to delete ${count} item${count > 1 ? 's' : ''}?`)) {
      selectedItems.forEach(id => deleteItem(id));
      setSelectedItems(new Set());
      setIsSelectionMode(false);
    }
  }, [selectedItems, deleteItem]);

  const importData = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedData)) {
          importItems(importedData);
          alert(`Successfully imported ${importedData.length} items!`);
        } else {
          alert('Invalid file format');
        }
      } catch (error) {
        alert('Error importing file');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }, [importItems]);

  const handleLoadMockData = useCallback((mockItems: MediaItem[], replace: boolean = true) => {
    if (replace) {
      importItems(mockItems);
    } else {
      addBulkItems(mockItems);
    }
  }, [importItems, addBulkItems]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSelectionMode) {
        setIsSelectionMode(false);
        setSelectedItems(new Set());
      }
      if (e.key === 'a' && e.ctrlKey && isSelectionMode) {
        e.preventDefault();
        handleSelectAll();
      }
      if (e.key === 'Delete' && isSelectionMode && selectedItems.size > 0) {
        e.preventDefault();
        handleBulkDelete();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSelectionMode, selectedItems, handleSelectAll, handleBulkDelete]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col space-y-4">
            {/* Title Section */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Personal Media Collection
              </h1>
              <p className="text-gray-600">
                Track your movies, music, games, books, and more with AI-powered features
              </p>
            </div>
            
            {/* Action Buttons Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Primary Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Plus size={16} className="mr-2" />
                  Add Media
                </button>
                
                {mediaItems.length === 0 && (
                  <button
                    onClick={() => setShowMockData(true)}
                    className="inline-flex items-center px-4 py-2 border border-blue-600 rounded-lg text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <Database size={16} className="mr-2" />
                    Try Demo Data
                  </button>
                )}
                
                {mediaItems.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={handleToggleSelection}
                      className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 ${
                        isSelectionMode 
                          ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100 shadow-sm ring-2 ring-red-200' 
                          : 'border-orange-300 text-orange-700 bg-orange-50 hover:bg-orange-100 shadow-sm'
                      }`}
                    >
                      <CheckSquare size={16} className="mr-2" />
                      {isSelectionMode ? 'Exit Selection Mode' : 'Bulk Select & Delete'}
                    </button>
                    
                    {showBulkHint && !isSelectionMode && (
                      <div className="absolute top-full left-0 mt-2 p-3 bg-yellow-100 border border-yellow-300 rounded-lg shadow-lg max-w-xs z-10">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <span className="text-yellow-600">💡</span>
                          </div>
                          <div className="ml-2">
                            <p className="text-sm text-yellow-800 font-medium">
                              New Feature!
                            </p>
                            <p className="text-xs text-yellow-700 mt-1">
                              Select multiple items and delete them all at once using this button.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Secondary Actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <FileText size={14} className="mr-1" />
                  {showStats ? 'Hide Stats' : 'Show Stats'}
                </button>
                
                {mediaItems.length > 0 && (
                  <button
                    onClick={() => setShowMockData(true)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Database size={14} className="mr-1" />
                    Demo Data
                  </button>
                )}
                
                <button
                  onClick={exportData}
                  disabled={mediaItems.length === 0}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Download size={14} className="mr-1" />
                  Export
                </button>
                
                <label className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                  <Upload size={14} className="mr-1" />
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {showStats && <Statistics items={mediaItems} />}

        {/* Selection Mode Indicator */}
        {isSelectionMode && (
          <div className="mb-4 p-3 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckSquare className="h-5 w-5 text-orange-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-orange-700">
                  <strong>Selection Mode Active</strong> - Click on items to select them for bulk actions
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <SearchAndFilter
          filters={filters}
          onFiltersChange={setFilters}
          totalItems={mediaItems.length}
          filteredItems={filteredItems.length}
          mediaItems={mediaItems}
        />

        {/* Bulk Actions Bar */}
        {isSelectionMode && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Select All
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-blue-600">{selectedItems.size}</span>
                  <span className="text-gray-600"> of </span>
                  <span className="font-semibold text-gray-700">{filteredItems.length}</span>
                  <span className="text-gray-600"> items selected</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                  💡 Tip: Click items or use Ctrl+A, Delete, Esc
                </div>
                
                <button
                  onClick={handleToggleSelection}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  title="Press Esc to cancel selection mode"
                >
                  Cancel
                </button>
                
                {selectedItems.size > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
                    title="Press Delete key to remove selected items"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Delete {selectedItems.size} Item{selectedItems.size > 1 ? 's' : ''}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Media Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {mediaItems.length === 0 ? (
                <>
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-lg font-medium mb-2">No media items yet</h3>
                  <p className="mb-4">Start building your personal media collection!</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => setShowMockData(true)}
                      className="inline-flex items-center px-4 py-2 border border-blue-600 rounded-md text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <Database size={16} className="mr-1" />
                      Try Demo Data
                    </button>
                    <button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={16} className="mr-1" />
                      Add Your First Item
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium mb-2">No items match your search</h3>
                  <p>Try adjusting your filters or search terms</p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-300 ${
            isSelectionMode ? 'transform scale-[0.98]' : ''
          }`}>
            {filteredItems.map(item => (
              <MediaCard
                key={item.id}
                item={item}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                isSelectionMode={isSelectionMode}
                isSelected={selectedItems.has(item.id)}
                onSelect={handleSelectItem}
              />
            ))}
          </div>
        )}

        {/* Media Form Modal */}
        {showForm && (
          <MediaForm
            item={editingItem}
            onSave={handleSaveItem}
            onCancel={handleCancelForm}
          />
        )}

        {/* Mock Data Modal */}
        <MockDataModal
          isOpen={showMockData}
          onClose={() => setShowMockData(false)}
          onLoadData={(items, replace) => handleLoadMockData(items, replace)}
          currentItemCount={mediaItems.length}
        />
      </div>
    </div>
  );
}

export default App;
