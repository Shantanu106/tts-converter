import { Volume2 } from 'lucide-react';

interface SpeedControlProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export const SpeedControl = ({ speed, onSpeedChange }: SpeedControlProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <Volume2 size={16} className="inline mr-2" />
          Speed Control
        </label>
        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{speed.toFixed(1)}x</span>
      </div>
      <input
        type="range"
        min="0.5"
        max="2"
        step="0.1"
        value={speed}
        onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>0.5x (Slower)</span>
        <span>1x (Normal)</span>
        <span>2x (Faster)</span>
      </div>
    </div>
  );
};
