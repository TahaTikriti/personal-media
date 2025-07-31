import React, { useState, useCallback, useMemo } from 'react';
import { X, Sparkles, Wand2, Loader2 } from 'lucide-react';
import type { MediaItem, MediaType, MediaStatus } from '../types';
import { generateId, suggestGenre } from '../utils';
import { MEDIA_TYPES, MEDIA_STATUSES } from '../constants';
import { enrichMediaData, isAIEnabled } from '../services/aiService';

interface MediaFormProps {
  item?: MediaItem;
  onSave: (item: MediaItem) => void;
  onCancel: () => void;
}

const MediaForm: React.FC<MediaFormProps> = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<MediaItem>>({
    title: '',
    creator: '',
    type: 'movie',
    genre: '',
    releaseDate: '',
    status: 'wishlist',
    rating: undefined,
    notes: '',
    tags: [],
    ...item,
  });

  const [tagInput, setTagInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Memoize genre suggestions for better performance
  const genreSuggestions = useMemo(() => {
    if (formData.title && formData.creator && formData.type) {
      return suggestGenre(formData.title, formData.creator, formData.type);
    }
    return [];
  }, [formData.title, formData.creator, formData.type]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.creator) {
      alert('Title and Creator are required');
      return;
    }

    const now = new Date().toISOString();
    const mediaItem: MediaItem = {
      id: item?.id || generateId(),
      title: formData.title,
      creator: formData.creator,
      type: formData.type as MediaType,
      genre: formData.genre || 'Other',
      releaseDate: formData.releaseDate || '',
      status: formData.status as MediaStatus,
      rating: formData.rating,
      notes: formData.notes,
      tags: formData.tags || [],
      dateAdded: item?.dateAdded || now,
      dateUpdated: now,
    };

    onSave(mediaItem);
  }, [formData, item, onSave]);

  const addTag = useCallback(() => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  }, [tagInput, formData.tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target === e.currentTarget) {
      e.preventDefault();
      addTag();
    }
  }, [addTag]);

  // AI Enhancement function
  const enhanceWithAI = useCallback(async () => {
    if (!formData.title || !formData.creator || !formData.type) {
      setAiError('Please enter title, creator, and select type first');
      return;
    }

    setAiLoading(true);
    setAiError(null);

    try {
      const result = await enrichMediaData(formData.title, formData.creator, formData.type);
      
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          genre: result.genre || prev.genre,
          releaseDate: result.releaseDate || prev.releaseDate,
          notes: result.description || prev.notes,
          tags: result.tags?.length ? [...(prev.tags || []), ...result.tags] : prev.tags,
          rating: result.rating || prev.rating
        }));
        setAiError(null);
      } else {
        setAiError(result.error || 'AI enhancement failed');
      }
    } catch (error) {
      setAiError('Failed to enhance with AI. Please try again.');
    } finally {
      setAiLoading(false);
    }
  }, [formData.title, formData.creator, formData.type]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {item ? 'Edit Media Item' : 'Add New Media Item'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* AI Enhancement Section */}
          {isAIEnabled() && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wand2 size={20} className="text-blue-600" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">AI Enhancement</h3>
                    <p className="text-xs text-gray-600">Automatically fill details with AI</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={enhanceWithAI}
                  disabled={aiLoading || !formData.title || !formData.creator}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Enhance with AI
                    </>
                  )}
                </button>
              </div>
              {aiError && (
                <div className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
                  {aiError}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Creator *
              </label>
              <input
                type="text"
                required
                value={formData.creator}
                onChange={(e) => setFormData(prev => ({ ...prev, creator: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Director, Artist, Author, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as MediaType }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {MEDIA_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as MediaStatus }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {MEDIA_STATUSES.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <input
                type="text"
                value={formData.genre}
                onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Action, Comedy, Drama, etc."
              />
              {genreSuggestions.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                    <Sparkles size={12} />
                    AI Suggestions:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {genreSuggestions.map(suggestion => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, genre: suggestion }))}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Release Date
              </label>
              <input
                type="date"
                value={formData.releaseDate}
                onChange={(e) => setFormData(prev => ({ ...prev, releaseDate: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.rating || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  rating: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a tag and press Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
              placeholder="Any additional notes..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              {item ? 'Update' : 'Add'} Media
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MediaForm;
