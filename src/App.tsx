import React, { useState, useCallback } from 'react';
import { Plus, FileText, Download, Upload, Database, CheckSquare, Trash2, Square } from 'lucide-react';
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

  const handleToggleSelection = useCallback(() => {
    setIsSelectionMode(prev => !prev);
    setSelectedItems(new Set());
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Personal Media Collection
              </h1>
              <p className="text-gray-600">
                Track your movies, music, games, books, and more with AI-powered features
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
              <button
                onClick={() => setShowStats(!showStats)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <FileText size={16} className="mr-1" />
                {showStats ? 'Hide' : 'Show'} Stats
              </button>
              
              <button
                onClick={() => setShowMockData(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Database size={16} className="mr-1" />
                Demo Data
              </button>
              
              {mediaItems.length > 0 && (
                <button
                  onClick={handleToggleSelection}
                  className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                    isSelectionMode 
                      ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100' 
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  <CheckSquare size={16} className="mr-1" />
                  {isSelectionMode ? 'Cancel' : 'Select Items'}
                </button>
              )}
              
              <button
                onClick={exportData}
                disabled={mediaItems.length === 0}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download size={16} className="mr-1" />
                Export
              </button>
              
              <label className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                <Upload size={16} className="mr-1" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
              
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} className="mr-1" />
                Add Media
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {showStats && <Statistics items={mediaItems} />}

        {/* Search and Filters */}
        <SearchAndFilter
          filters={filters}
          onFiltersChange={setFilters}
          totalItems={mediaItems.length}
          filteredItems={filteredItems.length}
        />

        {/* Bulk Actions Bar */}
        {isSelectionMode && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Select All ({selectedItems.size} of {filteredItems.length} selected)
                  </span>
                </label>
              </div>
              
              {selectedItems.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete Selected ({selectedItems.size})
                </button>
              )}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
