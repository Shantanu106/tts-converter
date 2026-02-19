import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000';

class TTSService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get available voices
   */
  async getVoices() {
    try {
      const response = await this.api.get('/voices');
      return response.data;
    } catch (error) {
      console.error('Error fetching voices:', error);
      throw error;
    }
  }

  /**
   * Synthesize text to speech
   */
  async synthesize(text: string, voice: string, speed: number, language: string = 'en') {
    try {
      const response = await this.api.post(
        '/synthesize',
        {
          text,
          voice,
          speed,
          language,
        },
        {
          responseType: 'blob',
        }
      );

      // Create blob URL for audio
      const audioBlob = new Blob([response.data], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      return audioUrl;
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      throw error;
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats() {
    try {
      const response = await this.api.get('/cache-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching cache stats:', error);
      throw error;
    }
  }

  /**
   * Clear cache
   */
  async clearCache() {
    try {
      const response = await this.api.post('/clear-cache');
      return response.data;
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error health check:', error);
      throw error;
    }
  }
}

export default new TTSService();
