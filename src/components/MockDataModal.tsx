import React, { useState } from 'react';
import { Database, Download, X } from 'lucide-react';
import { getDemoScenarios } from '../data/mockData';
import type { MediaItem } from '../types';

interface MockDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadData: (items: MediaItem[], replace?: boolean) => void;
  currentItemCount: number;
}

const MockDataModal: React.FC<MockDataModalProps> = ({ 
  isOpen, 
  onClose, 
  onLoadData, 
  currentItemCount 
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string>('quickDemo');
  const [replaceData, setReplaceData] = useState(true);
  
  const scenarios = getDemoScenarios();
  
  if (!isOpen) return null;

  const handleLoadData = () => {
    const scenario = scenarios[selectedScenario as keyof typeof scenarios];
    if (scenario) {
      onLoadData(scenario.data, replaceData);
      onClose();
    }
  };

  const getActionText = () => {
    const scenario = scenarios[selectedScenario as keyof typeof scenarios];
    const itemCount = scenario?.data.length || 0;
    
    if (replaceData) {
      return `Replace with ${itemCount} demo items`;
    } else {
      return `Add ${itemCount} demo items`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Database className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Demo Data</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-gray-600 text-sm mb-4">
              Load sample data to explore the app's features without manually adding items.
            </p>
            
            {currentItemCount > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> You currently have {currentItemCount} items in your collection.
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Demo Scenario
            </label>
            <div className="space-y-2">
              {Object.entries(scenarios).map(([key, scenario]) => (
                <label
                  key={key}
                  className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="scenario"
                    value={key}
                    checked={selectedScenario === key}
                    onChange={(e) => setSelectedScenario(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{scenario.name}</div>
                    <div className="text-sm text-gray-600">{scenario.description}</div>
                    <div className="text-xs text-blue-600 mt-1">
                      {scenario.data.length} items
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {currentItemCount > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Action
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="action"
                    checked={replaceData}
                    onChange={() => setReplaceData(true)}
                  />
                  <span className="text-sm">Replace existing data</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="action"
                    checked={!replaceData}
                    onChange={() => setReplaceData(false)}
                  />
                  <span className="text-sm">Add to existing data</span>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLoadData}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Download size={16} />
            {getActionText()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockDataModal;
