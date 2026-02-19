// Voice selector component
import { Mic } from 'lucide-react';

interface VoiceSelectorProps {
  voices: Array<{ id: string; name: string; language: string }>;
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
}

export const VoiceSelector = ({ voices, selectedVoice, onVoiceChange }: VoiceSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        <Mic size={16} className="inline mr-2" />
        Select Voice
      </label>
      <select
        value={selectedVoice}
        onChange={(e) => onVoiceChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {voices.map((voice) => (
          <option key={voice.id} value={voice.id}>
            {voice.name} ({voice.language})
          </option>
        ))}
      </select>
    </div>
  );
};
