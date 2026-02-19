import { History, X } from 'lucide-react';
import { useState } from 'react';

interface HistoryItem {
  id: string;
  text: string;
  voice: string;
  timestamp: number;
  audioUrl: string;
}

interface HistoryPanelProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export const HistoryPanel = ({ items, onSelect, onClear }: HistoryPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center gap-2 transition-all"
      >
        <History size={20} />
        {items.length > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {items.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 top-0 w-80 max-w-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">History</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No history yet. Generate some speech!
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className="w-full p-4 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
              >
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {item.text}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {item.voice} • {new Date(item.timestamp).toLocaleTimeString()}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onClear}
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Clear History
          </button>
        </div>
      )}
    </div>
  );
};
