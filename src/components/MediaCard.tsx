import React, { memo, useCallback } from 'react';
import { Edit2, Trash2, Star, Calendar, User, Tag } from 'lucide-react';
import type { MediaItem } from '../types';
import { formatDate, getGenreColor } from '../utils';
import { getTypeIcon, getStatusColor } from '../constants';

interface MediaCardProps {
  item: MediaItem;
  onEdit: (item: MediaItem) => void;
  onDelete: (id: string) => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string, isSelected: boolean) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ 
  item, 
  onEdit, 
  onDelete, 
  isSelectionMode = false, 
  isSelected = false, 
  onSelect 
}) => {
  const handleEdit = useCallback(() => onEdit(item), [item, onEdit]);
  const handleDelete = useCallback(() => onDelete(item.id), [item.id, onDelete]);
  const handleSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect?.(item.id, e.target.checked);
  }, [item.id, onSelect]);

  const handleCardClick = useCallback(() => {
    if (isSelectionMode) {
      onSelect?.(item.id, !isSelected);
    }
  }, [item.id, onSelect, isSelectionMode, isSelected]);

  const renderStars = useCallback((rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={14}
            className={rating >= star * 2 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">{rating}/10</span>
      </div>
    );
  }, []);

  return (
    <div className={`bg-white rounded-lg shadow-md border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
      isSelectionMode && isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
    }`}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          {isSelectionMode && (
            <div className="mr-3 pt-1">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={handleSelect}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{getTypeIcon(item.type)}</span>
              <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                {item.title}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-gray-600 mb-2">
              <User size={14} />
              <span className="text-sm">{item.creator}</span>
            </div>
          </div>
          
          <div className="flex gap-1 ml-2">
            <button
              onClick={handleEdit}
              className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-all"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
            >
              {item.status.replace('-', ' ')}
            </span>
            
            <span
              className="px-2 py-1 rounded text-xs text-white font-medium"
              style={{ backgroundColor: getGenreColor(item.genre) }}
            >
              {item.genre}
            </span>
          </div>

          {item.rating && (
            <div className="flex items-center">
              {renderStars(item.rating)}
            </div>
          )}

          {item.releaseDate && (
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Calendar size={14} />
              <span>{formatDate(item.releaseDate)}</span>
            </div>
          )}

          {item.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              <Tag size={14} className="text-gray-400" />
              {item.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{item.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {item.notes && (
            <p className="text-sm text-gray-600 line-clamp-2 mt-2">
              {item.notes}
            </p>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-400">
            Added {formatDate(item.dateAdded)}
            {item.dateUpdated !== item.dateAdded && (
              <span> • Updated {formatDate(item.dateUpdated)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(MediaCard);
