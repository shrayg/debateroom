# Debate Terminal

A real-time AI debate platform where four AI models (Grok, Claude, ChatGPT, and DeepSeek) engage in intelligent discourse.

## Features

- **Real-time AI Debates**: Watch four AI models debate any topic in real-time
- **Voice TTS**: Each AI model has a unique voice using OpenAI's TTS-1
- **Manual Scroll Control**: Disabled auto-scroll for better user experience
- **Interactive UI**: Modern, responsive design with particle effects
- **Category Prompts**: Pre-built prompts for philosophy, technology, science, and politics

## Voice Configurations

Each AI model has been assigned a unique voice:

- **Grok**: Alloy voice (neutral, clear)
- **Claude**: Echo voice (slightly faster, deeper)
- **ChatGPT**: Fable voice (slightly higher pitch)
- **DeepSeek**: Onyx voice (slightly slower, authoritative)

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory with your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   GROK_API_KEY=your_grok_api_key_here
   CLAUDE_API_KEY=your_claude_api_key_here
   CHATGPT_API_KEY=your_chatgpt_api_key_here
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   ```

3. **Start the Server**:
   ```bash
   npm start
   ```

4. **Access the Application**:
   Open your browser and navigate to `http://localhost:3003`

## TTS Features

- **Toggle Voice**: Use the "🎤 Voice TTS" toggle in the bottom-right corner
- **Unique Voices**: Each AI model speaks with its own distinct voice
- **Audio Caching**: Generated audio is cached to avoid regenerating the same speech
- **Volume Control**: TTS audio plays at 70% volume for optimal listening

## Scroll Control

- **Manual Scrolling**: Auto-scroll is disabled by default
- **Scroll Button**: A scroll-to-bottom button appears when you scroll up
- **User Control**: Users have full control over their viewing position

## API Endpoints

- `POST /api/debate/start` - Start a new debate
- `POST /api/debate/:sessionId/start` - Begin the debate loop
- `GET /api/debate/:sessionId` - Get debate session status
- `POST /api/debate/:sessionId/message` - Send a user message
- `POST /api/tts/generate` - Generate TTS audio for text
- `GET /api/questions/:category` - Get random questions by category

## File Structure

```
Debate Terminal/
├── api/
│   ├── chat.js      # AI model integration
│   ├── tts.js       # TTS service
│   └── index.js     # API routes
├── public/
│   ├── index.html   # Main application
│   ├── audio/       # Generated TTS files
│   └── particles.min.js
├── server.js        # Express server
├── package.json
└── vercel.json
```

## Technologies Used

- **Backend**: Node.js, Express
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **TTS**: OpenAI TTS-1 API
- **AI Models**: Grok, Claude, ChatGPT, DeepSeek
- **Deployment**: Vercel

## Notes

- TTS requires an OpenAI API key with TTS-1 access
- Audio files are cached in the `public/audio/` directory
- The application gracefully handles missing API keys
- All AI responses are processed with typing animations and optional TTS

