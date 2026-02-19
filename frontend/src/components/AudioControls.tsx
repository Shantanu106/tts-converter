import { useState } from 'react';
import { Volume2, Copy, Check } from 'lucide-react';

interface AudioControlsProps {
  audioUrl?: string;
  onDownload: () => void;
  onShare?: () => void;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export const AudioControls = ({
  audioUrl,
  onDownload,
  onShare,
  isPlaying,
  onPlayPause,
}: AudioControlsProps) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!audioUrl) return;

    try {
      const timestamp = new Date().getTime();
      const shareUrl = `${window.location.origin}?audio=${timestamp}`;

      if (navigator.share) {
        await navigator.share({
          title: 'TTS Generated Audio',
          text: 'Listen to this text-to-speech audio',
          url: shareUrl,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }

      onShare?.();
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {/* Play/Pause Button */}
      <button
        onClick={onPlayPause}
        disabled={!audioUrl}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          audioUrl
            ? isPlaying
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <Volume2 size={18} />
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      {/* Download Button */}
      <button
        onClick={onDownload}
        disabled={!audioUrl}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          audioUrl
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        📥 Download
      </button>

      {/* Share Button */}
      <button
        onClick={handleShare}
        disabled={!audioUrl}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          audioUrl
            ? 'bg-purple-500 hover:bg-purple-600 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {copied ? <Check size={18} /> : <Copy size={18} />}
        {copied ? 'Copied' : 'Share'}
      </button>
    </div>
  );
};
