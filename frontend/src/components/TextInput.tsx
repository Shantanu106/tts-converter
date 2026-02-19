import { useEffect, useRef } from 'react';
import { Zap } from 'lucide-react';

interface TextInputProps {
  text: string;
  onTextChange: (text: string) => void;
  maxLength?: number;
  isLoading?: boolean;
}

export const TextInput = ({
  text,
  onTextChange,
  maxLength = 1000,
  isLoading = false,
}: TextInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(120, textareaRef.current.scrollHeight)}px`;
    }
  }, [text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value.slice(0, maxLength);
    onTextChange(newText);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <Zap size={16} className="inline mr-2" />
          Text Input
        </label>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {text.length} / {maxLength}
        </span>
      </div>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleTextChange}
        placeholder="Enter text to convert to speech (max 1000 characters)..."
        disabled={isLoading}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ minHeight: '120px' }}
      />
      {text.length === maxLength && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          ⚠️ Maximum character limit reached
        </p>
      )}
    </div>
  );
};
