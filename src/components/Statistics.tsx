import React from 'react';
import { BarChart3, TrendingUp, Clock, Star } from 'lucide-react';
import type { MediaItem } from '../types';

interface StatisticsProps {
  items: MediaItem[];
}

const Statistics: React.FC<StatisticsProps> = ({ items }) => {
  const getStats = () => {
    const total = items.length;
    const byStatus = items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byType = items.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const ratedItems = items.filter(item => item.rating);
    const averageRating = ratedItems.length > 0
      ? ratedItems.reduce((sum, item) => sum + (item.rating || 0), 0) / ratedItems.length
      : 0;

    const recentlyAdded = items.filter(item => {
      const addedDate = new Date(item.dateAdded);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return addedDate >= weekAgo;
    }).length;

    return {
      total,
      byStatus,
      byType,
      averageRating,
      ratedItems: ratedItems.length,
      recentlyAdded,
    };
  };

  const stats = getStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'owned': return 'bg-green-500';
      case 'wishlist': return 'bg-blue-500';
      case 'currently-using': return 'bg-yellow-500';
      case 'completed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'movie': return '🎬';
      case 'tv-show': return '📺';
      case 'music': return '🎵';
      case 'game': return '🎮';
      case 'book': return '📚';
      default: return '📱';
    }
  };

  if (stats.total === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
          <p>No media items yet. Add some to see your statistics!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Items</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </div>

      {/* Average Rating */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Avg Rating</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
            </p>
            {stats.ratedItems > 0 && (
              <p className="text-xs text-gray-400">{stats.ratedItems} rated items</p>
            )}
          </div>
        </div>
      </div>

      {/* Recently Added */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Clock className="h-8 w-8 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">This Week</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.recentlyAdded}</p>
            <p className="text-xs text-gray-400">newly added</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Completed</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.byStatus.completed || 0}
            </p>
            <p className="text-xs text-gray-400">
              {stats.total > 0 ? Math.round(((stats.byStatus.completed || 0) / stats.total) * 100) : 0}% done
            </p>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:col-span-2">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Status Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(stats.byStatus).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(status)} mr-3`}></div>
                <span className="text-sm text-gray-700 capitalize">
                  {status.replace('-', ' ')}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900 mr-2">{count}</span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getStatusColor(status)}`}
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Type Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:col-span-2">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Media Types</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(stats.byType).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center">
                <span className="text-lg mr-2">{getTypeIcon(type)}</span>
                <span className="text-sm text-gray-700 capitalize">
                  {type.replace('-', ' ')}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
