const OpenAI = require('openai');

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
    speed: 1.0,
    pitch: 0.9
  },
  'CHATGPT': {
    voice: 'fable',
    speed: 1.0,
    pitch: 1.1
  },
  'DEEPSEEK': {
    voice: 'onyx',
    speed: 1.0,
    pitch: 1.0
  }
};

// Simple hash function for text
function hashCode(str) {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

// Vercel serverless function handler
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const { text, speaker } = req.body;

    // Validate input
    if (!text || !speaker) {
      return res.status(400).json({ 
        success: false, 
        error: 'Text and speaker are required' 
      });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ 
        success: false, 
        error: 'TTS service not available - missing OpenAI API key' 
      });
    }

    // Get voice configuration
    const config = VOICE_CONFIGS[speaker] || VOICE_CONFIGS['CHATGPT'];

    console.log(`🎤 [TTS GENERATION] Generating audio for ${speaker}: "${text.substring(0, 50)}..."`);

    // Generate TTS using OpenAI
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: config.voice,
      input: text,
      speed: config.speed,
    });

    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Create a unique filename for caching purposes
    const textHash = hashCode(text);
    const filename = `${speaker.toLowerCase()}_${textHash}.mp3`;

    console.log(`✅ [TTS SUCCESS] Generated audio: ${filename} (${buffer.length} bytes)`);

    // Return the audio data directly
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.setHeader('X-Audio-Filename', filename);
    
    res.status(200).send(buffer);

  } catch (error) {
    console.error('❌ [TTS ERROR]', error);
    
    // Handle specific OpenAI errors
    if (error.status === 401) {
      return res.status(503).json({ 
        success: false, 
        error: 'TTS service not available - invalid OpenAI API key' 
      });
    }
    
    if (error.status === 429) {
      return res.status(429).json({ 
        success: false, 
        error: 'TTS service rate limited - please try again later' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      error: 'TTS generation failed: ' + error.message 
    });
  }
};
