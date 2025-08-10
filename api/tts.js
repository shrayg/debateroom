const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Voice configurations for each AI model
const VOICE_CONFIGS = {
  'GROK': {
    voice: 'alloy',
    speed: 1.0,
    pitch: 1.0
  },
  'CLAUDE': {
    voice: 'echo',
    speed: 1.1,
    pitch: 0.9
  },
  'CHATGPT': {
    voice: 'fable',
    speed: 1.0,
    pitch: 1.1
  },
  'DEEPSEEK': {
    voice: 'onyx',
    speed: 0.9,
    pitch: 1.0
  }
};

// Available OpenAI voices
const OPENAI_VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];

class TTSService {
  constructor() {
    this.audioCache = new Map();
    this.audioDir = path.join(__dirname, '../public/audio');
    this.ensureAudioDirectory();
    
    // Clean up old files on startup
    this.cleanupOldFiles();
  }

  ensureAudioDirectory() {
    if (!fs.existsSync(this.audioDir)) {
      fs.mkdirSync(this.audioDir, { recursive: true });
    }
  }

  async generateTTS(text, speaker) {
    try {
      const config = VOICE_CONFIGS[speaker] || VOICE_CONFIGS['CHATGPT'];
      
      // Create a unique filename based on text hash and speaker
      const textHash = this.hashCode(text);
      const filename = `${speaker.toLowerCase()}_${textHash}.mp3`;
      const filepath = path.join(this.audioDir, filename);

      // Check if audio already exists in cache
      if (this.audioCache.has(filename)) {
        return `/audio/${filename}`;
      }

      // Check if file already exists on disk
      if (fs.existsSync(filepath)) {
        this.audioCache.set(filename, filepath);
        return `/audio/${filename}`;
      }

      // Generate TTS using OpenAI
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: config.voice,
        input: text,
        speed: config.speed,
      });

      // Convert the response to buffer and save
      const buffer = Buffer.from(await mp3.arrayBuffer());
      fs.writeFileSync(filepath, buffer);

      // Cache the result
      this.audioCache.set(filename, filepath);

      return `/audio/${filename}`;
    } catch (error) {
      console.error('TTS generation error:', error);
      return null;
    }
  }

  // Delete a specific audio file
  deleteAudioFile(filename) {
    try {
      const filepath = path.join(this.audioDir, filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        console.log(`Deleted audio file: ${filename}`);
      }
      // Remove from cache
      this.audioCache.delete(filename);
    } catch (error) {
      console.error(`Error deleting audio file ${filename}:`, error);
    }
  }

  // Clean up old files (older than 1 hour)
  cleanupOldFiles() {
    try {
      const files = fs.readdirSync(this.audioDir);
      const now = Date.now();
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

      files.forEach(file => {
        if (file.endsWith('.mp3')) {
          const filepath = path.join(this.audioDir, file);
          const stats = fs.statSync(filepath);
          const fileAge = now - stats.mtime.getTime();

          if (fileAge > oneHour) {
            fs.unlinkSync(filepath);
            console.log(`Cleaned up old audio file: ${file}`);
          }
        }
      });
    } catch (error) {
      console.error('Error cleaning up old files:', error);
    }
  }

  // Schedule file deletion after a delay
  scheduleFileDeletion(filename, delayMs = 5000) {
    setTimeout(() => {
      this.deleteAudioFile(filename);
    }, delayMs);
  }

  // Simple hash function for text
  hashCode(str) {
    let hash = 0;
    if (str.length === 0) return hash.toString();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Get voice configuration for a speaker
  getVoiceConfig(speaker) {
    return VOICE_CONFIGS[speaker] || VOICE_CONFIGS['CHATGPT'];
  }

  // Get all available voices
  getAvailableVoices() {
    return OPENAI_VOICES;
  }

  // Clear audio cache
  clearCache() {
    this.audioCache.clear();
  }
}

module.exports = new TTSService();
