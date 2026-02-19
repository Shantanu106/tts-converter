import { useState, useEffect } from 'react';
import './index.css';
import { Header } from './components/Header';
import { TextInput } from './components/TextInput';
import { VoiceSelector } from './components/VoiceSelector';
import { SpeedControl } from './components/SpeedControl';
import { AudioControls } from './components/AudioControls';
import { Alert } from './components/Alert';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Waveform } from './components/Waveform';
import { HistoryPanel } from './components/HistoryPanel';
import ttsService from './services/ttsService';
import { Zap } from 'lucide-react';

interface Voice {
  id: string;
  name: string;
  language: string;
}

interface HistoryItem {
  id: string;
  text: string;
  voice: string;
  timestamp: number;
  audioUrl: string;
}

function App() {
  // State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('default');
  const [speed, setSpeed] = useState(1.0);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('ttsHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Load voices on mount
  useEffect(() => {
    loadVoices();
  }, []);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('ttsHistory', JSON.stringify(history));
  }, [history]);

  const loadVoices = async () => {
    try {
      const voiceList = await ttsService.getVoices();
      setVoices(voiceList);
      if (voiceList.length > 0 && !selectedVoice) {
        setSelectedVoice(voiceList[0].id);
      }
    } catch (err) {
      console.error('Failed to load voices:', err);
      setError('Failed to load available voices');
    }
  };

  const handleSynthesize = async () => {
    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const url = await ttsService.synthesize(text, selectedVoice, speed);
      setAudioUrl(url);
      setSuccess('✅ Speech generated successfully!');

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        text,
        voice: selectedVoice,
        timestamp: Date.now(),
        audioUrl: url,
      };
      setHistory((prev) => [newHistoryItem, ...prev].slice(0, 50)); // Keep last 50
    } catch (err) {
      setError(`Failed to generate speech: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;

    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `speech_${Date.now()}.wav`;
    link.click();
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setText(item.text);
    setSelectedVoice(item.voice);
    setAudioUrl(item.audioUrl);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
        <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Alerts */}
          <div className="space-y-3 mb-6">
            {error && (
              <Alert
                type="error"
                message={error}
                onClose={() => setError(null)}
              />
            )}
            {success && (
              <Alert
                type="success"
                message={success}
                onClose={() => setSuccess(null)}
              />
            )}
          </div>

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
            {/* Text Input */}
            <TextInput
              text={text}
              onTextChange={setText}
              maxLength={1000}
              isLoading={loading}
            />

            {/* Voice Selector and Speed Control */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VoiceSelector
                voices={voices}
                selectedVoice={selectedVoice}
                onVoiceChange={setSelectedVoice}
              />
              <SpeedControl speed={speed} onSpeedChange={setSpeed} />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleSynthesize}
              disabled={loading || !text.trim()}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                loading || !text.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Generating Speech...
                </>
              ) : (
                <>
                  <Zap size={20} />
                  Generate Speech
                </>
              )}
            </button>

            {/* Loading State */}
            {loading && (
              <div className="py-8">
                <LoadingSpinner message="🎤 Generating your speech... This may take a moment" />
              </div>
            )}

            {/* Waveform and Controls */}
            {audioUrl && !loading && (
              <>
                <div className="pt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Waveform Visualization
                  </p>
                  <Waveform
                    audioUrl={audioUrl}
                    isPlaying={isPlaying}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                </div>

                <div className="pt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Audio Controls
                  </p>
                  <AudioControls
                    audioUrl={audioUrl}
                    onDownload={handleDownload}
                    onShare={() => setSuccess('Link copied to clipboard!')}
                    isPlaying={isPlaying}
                    onPlayPause={handlePlayPause}
                  />
                </div>
              </>
            )}
          </div>

          {/* Stats Footer */}
          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              🚀 Powered by Hugging Face Transformers • GPU Optimized • Open Source
            </p>
          </div>
        </main>

        {/* History Panel */}
        <HistoryPanel
          items={history}
          onSelect={handleHistorySelect}
          onClear={handleClearHistory}
        />
      </div>
    </div>
  );
}

export default App;
