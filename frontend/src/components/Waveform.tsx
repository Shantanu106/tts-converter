import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformProps {
  audioUrl?: string;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}

export const Waveform = ({ audioUrl, isPlaying, onPlay, onPause }: WaveformProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create WaveSurfer instance
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#3b82f6',
      progressColor: '#1e40af',
      cursorColor: '#1f2937',
      barWidth: 3,
      barHeight: 1,
      barRadius: 3,
      height: 100,
    });

    // Load audio if URL is provided
    if (audioUrl) {
      wavesurfer.load(audioUrl);
    }

    // Handle play/pause
    wavesurfer.on('play', onPlay);
    wavesurfer.on('pause', onPause);

    wavesurferRef.current = wavesurfer;

    return () => {
      wavesurfer.destroy();
    };
  }, []);

  // Update audio when URL changes
  useEffect(() => {
    if (audioUrl && wavesurferRef.current) {
      wavesurferRef.current.load(audioUrl);
    }
  }, [audioUrl]);

  // Handle external play/pause
  useEffect(() => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.play();
      } else {
        wavesurferRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div
      ref={containerRef}
      className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
    />
  );
};
