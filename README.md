# Debate Terminal 🤖

**An experimental platform for observing AI-to-AI communication dynamics in real-time**

_Created by [Shray G](https://github.com/shrayg) - A college student_

---

## 🎯 Project Purpose

Debate Terminal is a unique research platform that enables real-time observation of how multiple AI models engage in dialogue when presented with user-generated questions. The core mission is to analyze how these models interact, exchange information, and whether they can collaboratively arrive at shared understanding.

### Research Focus Areas:
- **AI Communication Dynamics**: How models interpret, respond, and adapt to each other
- **Conversation Evolution**: Tracking how dialogue progresses from concrete to abstract
- **Collaborative Reasoning**: Whether AIs can work together to reach consensus
- **Learning Patterns**: Real-time adaptation and information exchange between models
- **User Intervention**: How AIs respond when humans join the conversation

---

## 📚 Complete Commit History & Effects

### Commit 1: `c56e723` - "first commit" (2025-08-10 14:45:52)
**Effect**: Initial project setup with complete foundation
- Created entire project structure with 12 files
- Implemented core Express.js server (`server.js`) with 440 lines
- Built comprehensive AI integration module (`api/chat.js`) with 594 lines supporting 4 AI models
- Created TTS service (`api/tts.js`) with 169 lines for text-to-speech generation
- Developed full frontend interface (`public/index.html`) with 1508 lines including:
  - Real-time debate UI
  - Category-based question system
  - Particles.js animated background
  - Typing indicators and animations
- Added Vercel serverless configuration (`vercel.json`)
- Set up package.json with all dependencies
- Created .gitignore for Node.js projects
- **Total Impact**: 4,478 lines of code added, establishing the complete application foundation

### Commit 2: `03515b2` - "test" (2025-08-10 14:52:55)
**Effect**: Minor UI adjustment
- Modified `public/index.html` (1 line changed)
- Likely a quick test or bug fix in the frontend

### Commit 3: `69c1be2` - "updated x comunity" (2025-08-10 16:03:37)
**Effect**: Social media integration update
- Updated `public/index.html` with X (Twitter) community link
- Modified social button dropdown to include X/Twitter link
- **Impact**: Added social sharing functionality for community engagement

### Commit 4: `b30c1d6` - "push" (2025-08-10 16:29:36)
**Effect**: Major refactoring and optimization
- Refactored `api/tts.js` (210 lines changed) - streamlined TTS service
- Updated `public/index.html` (68 lines changed) - UI improvements
- Simplified `server.js` (95 lines removed) - cleaner server code
- Enhanced `vercel.json` (15 lines added) - improved serverless configuration
- **Total Impact**: 147 additions, 241 deletions - significant code optimization

### Commit 5: `f53ee9a` - "push" (2025-08-10 16:37:14)
**Effect**: API routing and configuration improvements
- Updated `api/chat.js` (26 lines changed) - improved AI model integration
- Refactored `vercel.json` (25 lines changed) - optimized serverless routing
- **Impact**: Better API organization and Vercel deployment configuration

### Commit 6: `3459486` - "updated master prompt" (2025-08-10 17:02:30)
**Effect**: Enhanced AI personality and response style
- Modified `api/chat.js` (29 lines changed)
- Updated master style prompt to enforce:
  - Casual, human-like conversation style
  - 1-2 sentence responses
  - Basic punctuation only (no quotes, parentheses, dashes, etc.)
  - No greetings or sign-offs
  - Natural contractions without apostrophes
- **Impact**: More natural, conversational AI responses across all models

### Commit 7: `4f5613d` - "updated for multiple instances and updated readme" (2025-08-10 18:57:54)
**Effect**: Multi-instance support and documentation
- Enhanced `api/chat.js` (42 lines changed) - added support for multiple concurrent debate sessions
- Updated `README.md` (147 lines changed) - comprehensive documentation
- Implemented session isolation to prevent cross-contamination between users
- **Impact**: Platform can now handle multiple users simultaneously without interference

### Commit 8: `482eaf5` - "updated speed" (2025-08-10 19:54:44)
**Effect**: TTS speed optimization
- Modified `api/tts.js` (4 lines changed) - adjusted TTS generation speed
- Updated `package-lock.json` (262 lines added) - dependency updates
- **Impact**: Faster text-to-speech generation and playback

### Commit 9: `c3df23f` - "push" (2025-08-10 21:19:20)
**Effect**: Major frontend enhancements
- Updated `public/index.html` (157 lines changed)
- Added new UI features and improved user experience
- **Impact**: Enhanced visual design and interaction patterns

### Commit 10: `1d0e630` - "final update" (2025-08-10 22:25:03)
**Effect**: Final optimizations and cleanup
- Modified `api/chat.js` (2 lines changed) - final API tweaks
- Cleaned up `package-lock.json` (243 lines removed) - dependency cleanup
- Enhanced `public/index.html` (110 lines added) - final UI polish
- **Impact**: Production-ready codebase with optimized dependencies

### Commit 11: `33137f6` - "updated title" (2025-08-10 22:33:27)
**Effect**: Branding and title updates
- Updated `README.md` (6 lines changed) - documentation updates
- Modified `public/index.html` (4 lines changed) - title changes
- Updated `server.js` (2 lines changed) - server title updates
- **Impact**: Consistent branding across the application

### Commit 12: `ee8b541` - "push" (2025-08-10 23:07:31)
**Effect**: Final feature additions
- Updated `public/index.html` (76 lines added)
- Added final UI enhancements and features
- **Impact**: Complete feature set for production deployment

---

## 🛠️ Complete Technology Stack

### Backend Technologies
- **Node.js** (v18.0.0+) - JavaScript runtime environment
- **Express.js** (v4.19.2) - Web application framework
- **CORS** (v2.8.5) - Cross-origin resource sharing middleware
- **dotenv** (v16.4.5) - Environment variable management

### Frontend Technologies
- **HTML5** - Markup language
- **CSS3** - Styling with modern features:
  - CSS Grid & Flexbox for layouts
  - CSS Animations & Keyframes
  - Backdrop filters for glassmorphism effects
  - Custom scrollbar styling
- **Vanilla JavaScript** (ES6+) - No frameworks, pure JavaScript
- **Particles.js** (v2.0.0) - Interactive particle background animation

### Deployment & Infrastructure
- **Vercel** - Serverless deployment platform
- **Vercel Serverless Functions** - API endpoints as serverless functions
- **Node.js Runtime** - Server-side execution environment

### Development Tools
- **nodemon** (v3.1.0) - Development server with auto-reload
- **Git** - Version control system

---

## 🔌 Complete API Integration Details

### 1. OpenAI API
- **Endpoint**: `https://api.openai.com/v1/chat/completions`
- **Model**: `gpt-4`
- **Usage**:
  - ChatGPT personality responses
  - Text-to-Speech generation (`tts-1` model)
- **Authentication**: Bearer token via `OPENAI_API_KEY`
- **Features Used**:
  - Chat completions for debate responses
  - Audio speech generation for TTS
  - Temperature: 0.9 (high creativity)
  - Max tokens: 200 per response

### 2. Anthropic API (Claude)
- **Endpoint**: `https://api.anthropic.com/v1/messages`
- **Model**: `claude-3-5-sonnet-20241022`
- **Usage**: Claude personality responses
- **Authentication**: API key via `ANTHROPIC_API_KEY` header (`x-api-key`)
- **Features Used**:
  - Message-based API
  - Temperature: 0.9
  - Max tokens: 200 per response

### 3. X.AI API (Grok)
- **Endpoint**: `https://api.x.ai/v1/chat/completions`
- **Model**: `grok-2-1212`
- **Usage**: Grok personality responses
- **Authentication**: Bearer token via `XAI_API_KEY` (environment variable `GROK_API_KEY`)
- **Features Used**:
  - Chat completions
  - Temperature: 1.0 (maximum creativity)
  - Max tokens: 200 per response

### 4. DeepSeek API
- **Endpoint**: `https://api.deepseek.com/v1/chat/completions`
- **Model**: `deepseek-chat`
- **Usage**: DeepSeek personality responses
- **Authentication**: Bearer token via `DEEPSEEK_API_KEY`
- **Features Used**:
  - Chat completions
  - Temperature: 0.9
  - Max tokens: 200 per response

### 5. OpenAI TTS API
- **Endpoint**: `https://api.openai.com/v1/audio/speech`
- **Model**: `tts-1`
- **Usage**: Text-to-speech audio generation
- **Voices Used**:
  - `alloy` - Grok voice
  - `echo` - Claude voice
  - `fable` - ChatGPT voice
  - `onyx` - DeepSeek voice
- **Speed**: 1.0 (normal speed)
- **Output Format**: MP3 audio buffer

---

## ✨ Unique Features Implemented

### 1. Multi-AI Debate System
- **Four Distinct AI Personalities**:
  - **Claude** (#d4743c) - Philosophical deep thinker
  - **Grok** (#ff6b35) - Rebellious provocateur
  - **DeepSeek** (#4f46e5) - Optimistic enthusiast
  - **ChatGPT** (#10a37f) - Confident know-it-all
- Sequential turn-based debate (round-robin)
- Each AI maintains unique personality traits
- Context-aware responses that build on previous messages

### 2. Real-Time Polling System
- 1-second polling interval for live updates
- Efficient message deduplication using `processedMessageIds` Set
- Automatic session state synchronization
- Typing indicators before AI responses

### 3. Session Management
- Unique session IDs per debate instance
- Session isolation (multiple users can debate simultaneously)
- Automatic session cleanup (1-hour timeout)
- Session state persistence during debate

### 4. Text-to-Speech (TTS) Integration
- Real-time audio generation for each AI response
- Unique voice per AI model:
  - Grok: `alloy` voice
  - Claude: `echo` voice (pitch: 0.9)
  - ChatGPT: `fable` voice (pitch: 1.1)
  - DeepSeek: `onyx` voice
- Synchronized typing animation with audio duration
- 15% faster playback rate for natural conversation flow
- Mute/unmute functionality
- Audio caching via hash-based filenames

### 5. Typing Animation System
- Character-by-character typing effect
- Speed calculated based on TTS audio duration
- Natural pauses for punctuation:
  - Spaces: 50% delay
  - Commas/semicolons: 150% delay
  - Periods/exclamation/question marks: 200% delay
  - Newlines: 250% delay
- Random variation for natural typing rhythm
- Minimum delay: 17ms, Maximum delay: 170ms

### 6. User Intervention System
- Real-time user message insertion into debate
- AI responses to user messages with context awareness
- User messages marked and filtered appropriately
- 50-70% probability of AI addressing user by name
- Special prompt handling for user interventions

### 7. Category-Based Question System
- **7 Categories** with 15 questions each:
  - Philosophy (15 questions)
  - Technology (15 questions)
  - Science (15 questions)
  - Politics (15 questions)
  - Ethics (15 questions)
  - Society (15 questions)
  - Future (15 questions)
- **Total**: 105 curated debate questions
- Random question selection per category
- One-click question loading

### 8. Master Style Prompt System
- Unified conversation style across all AI models:
  - Casual, human-like tone
  - 1-2 sentence responses
  - Basic punctuation only (no quotes, parentheses, dashes, colons, semicolons, hashtags, emojis, lists, code blocks, links, asterisks, brackets, or slashes)
  - No greetings or sign-offs
  - Contractions without apostrophes (dont, cant, wont)
- Prevents formal/academic tone
- Maintains natural conversation flow

### 9. Advanced UI Features
- **Particles.js Background**: Interactive animated particle system
- **Glassmorphism Design**: Backdrop blur effects throughout
- **Responsive Design**: Mobile and desktop optimized
- **Custom Scrollbar**: Styled scrollbars matching theme
- **Scroll-to-Bottom Button**: Appears when user scrolls up
- **Social Media Integration**: GitHub and X/Twitter links
- **Status Indicators**: Real-time debate status with pulse animation
- **Empty State**: Helpful guidance when no debate is active
- **Modal System**: End-of-debate notifications

### 10. Error Handling & Resilience
- Graceful API failure handling
- Error messages displayed in UI
- Session cleanup on errors
- Automatic retry logic for failed requests
- API key validation before making calls

### 11. Message Deduplication
- `processedMessageIds` Set tracks processed messages
- Prevents duplicate message rendering
- Handles rapid polling without duplicates
- Efficient O(1) lookup time

### 12. Debate Control System
- Start/Stop debate functionality
- Maximum 15 turns per debate (cost control)
- Automatic debate termination
- Manual stop button
- Session cleanup on stop

### 13. Context Management
- Last 6 messages used for context
- User messages filtered from normal debate flow
- Special context for user response scenarios
- Previous speaker tracking
- Conversation history preservation

### 14. Name Addressing System
- 30% chance to address previous speaker by name
- 50-70% chance to address user by name
- Dynamic name reference in prompts
- Natural conversation flow

### 15. Turn-Based System
- Round-robin AI selection
- Turn counter tracking
- Automatic progression
- Turn limit enforcement (15 turns)

### 16. Audio Management
- Single audio playback at a time
- Automatic audio cleanup on debate end
- Mute state persistence
- Volume control (70% default)
- Playback rate adjustment (1.15x speed)

### 17. Auto-Scroll Control
- Disabled by default (user control)
- Conditional auto-scroll when at bottom
- Manual scroll-to-bottom button
- Scroll position detection

### 18. Initial Prompt Display
- Shows original debate question
- Styled prompt section
- Persistent throughout debate
- Clear visual hierarchy

### 19. Chat Input System
- Real-time message sending
- Enter key support
- Input validation
- Immediate UI feedback
- Disabled state during processing

### 20. Vercel Serverless Architecture
- Serverless function deployment
- API routes as serverless functions
- Static file serving
- 30-second max duration per function
- Automatic scaling

---

## 📁 Project Structure

```
debate-terminal/
├── api/
│   ├── chat.js          # AI model integration & debate loop (611 lines)
│   ├── tts.js           # Text-to-speech service (138 lines)
│   └── index.js         # Vercel serverless entry point (5 lines)
├── public/
│   ├── index.html       # Main frontend application (1820 lines)
│   ├── particles.min.js # Particles.js library
│   └── typing.mp3       # Typing sound effect (161KB)
├── server.js            # Express server (374 lines)
├── package.json         # Dependencies & scripts
├── vercel.json          # Vercel deployment configuration
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

---

## 🔧 Environment Variables Required

```env
# OpenAI API (for ChatGPT & TTS)
OPENAI_API_KEY=your_openai_api_key_here

# Anthropic API (for Claude)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# X.AI API (for Grok)
XAI_API_KEY=your_xai_api_key_here
# OR
GROK_API_KEY=your_grok_api_key_here

# DeepSeek API
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# Server Port (optional, defaults to 3003)
PORT=3003
```

---

## 🚀 Getting Started

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/shrayg/debateroom.git
   cd debateroom
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # Or
   npm start
   ```

5. **Visit the application**
   ```
   http://localhost:3003
   ```

### Production Deployment (Vercel)

1. **Connect repository to Vercel**
2. **Add environment variables in Vercel dashboard**
3. **Deploy automatically on push to main branch**

---

## 📊 API Endpoints

### Debate Management
- `POST /api/debate/start` - Create new debate session
- `POST /api/debate/:sessionId/start` - Start debate loop
- `GET /api/debate/:sessionId` - Get debate session status
- `POST /api/debate/:sessionId/message` - Send user message
- `POST /api/debate/stop/:sessionId` - Stop debate

### Questions
- `GET /api/questions/:category` - Get random question from category

### TTS
- `POST /api/tts/generate` - Generate text-to-speech audio

### Health
- `GET /api/health` - API health check

---

## 🎨 Design Philosophy

- **Simplicity**: No complex frameworks, pure JavaScript
- **Performance**: Efficient polling, message deduplication
- **User Experience**: Smooth animations, real-time feedback
- **Reliability**: Error handling, session management
- **Scalability**: Serverless architecture, session isolation

---

## 🔬 Research Applications

This platform can be used to study:
- AI model communication patterns
- Consensus building in multi-agent systems
- Personality preservation in conversation
- Context retention across multiple turns
- User intervention effects on AI behavior
- Response style consistency
- Debate quality metrics

---

## 📝 License

This project is created for educational and research purposes. Feel free to explore the code and contribute to the understanding of AI communication dynamics.

---

## 🙏 Acknowledgments

- Built as a solo project for learning and experimentation
- Focus on simplicity and reliability over complex features
- Designed for easy deployment and maintenance
- Open to community contributions and research collaboration

---

## 🔗 Links

- **Live Site**: [debateterminal-one.vercel.app](https://debateterminal-one.vercel.app)
- **GitHub Repository**: [github.com/shrayg/debateroom](https://github.com/shrayg/debateroom)
- **Twitter/X**: [@DebateRoomAI](https://x.com/DebateRoomAI)

---

_Built with curiosity and a desire to understand how AI models think, communicate, and potentially learn from each other._
