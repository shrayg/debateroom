const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Try to import chat functionality, but handle errors gracefully
let chatModule = null;
try {
  chatModule = require('./api/chat');
} catch (error) {
  console.warn('Warning: Chat module failed to load:', error.message);
  console.warn('Debate functionality will be limited without API keys');
}



const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Wire TTS endpoint for local development (Vercel uses serverless handler directly)
try {
  const ttsHandler = require('./api/tts');
  app.post('/api/tts/generate', ttsHandler);
} catch (err) {
  console.warn('TTS handler not available locally:', err?.message || err);
}

// Debate questions for each category
const debateQuestions = {
  philosophy: [
    "Should we prioritize individual freedom or collective well-being in society?",
    "Is consciousness just an emergent property of complex information processing?",
    "Can moral truths exist independently of human opinion?",
    "Is the meaning of life something we discover or create?",
    "Should we embrace or resist technological augmentation of human capabilities?",
    "Is free will an illusion or a fundamental aspect of human existence?",
    "Should we judge historical figures by modern moral standards?",
    "Is beauty objective or purely subjective?",
    "Should we prioritize happiness or meaning in life?",
    "Is the concept of justice universal or culturally relative?",
    "Should we value truth over happiness when they conflict?",
    "Is the self a unified entity or a collection of experiences?",
    "Should we prioritize individual rights or community harmony?",
    "Is morality grounded in reason or emotion?",
    "Should we seek immortality if technology makes it possible?"
  ],
  technology: [
    "Will artificial intelligence ultimately benefit or threaten humanity?",
    "Should there be limits on genetic engineering and human enhancement?",
    "Is privacy a fundamental right in the digital age?",
    "Will automation create more jobs than it destroys?",
    "Should tech companies be regulated like public utilities?",
    "Should social media platforms be held accountable for content moderation?",
    "Is cryptocurrency the future of money or a speculative bubble?",
    "Should we develop autonomous weapons systems?",
    "Will virtual reality replace physical social interactions?",
    "Should we prioritize AI safety over AI advancement?",
    "Is the metaverse a positive development for society?",
    "Should we allow brain-computer interfaces for consumer use?",
    "Will quantum computing revolutionize or destabilize cybersecurity?",
    "Should we regulate AI-generated content and deepfakes?",
    "Is blockchain technology overhyped or revolutionary?"
  ],
  science: [
    "Is the multiverse theory scientifically valid or just speculation?",
    "Should we prioritize space exploration or fixing Earth's problems?",
    "Is consciousness reducible to purely physical processes?",
    "Can we achieve sustainable energy without nuclear power?",
    "Should human cloning be permitted for medical purposes?",
    "Is climate change primarily caused by human activity?",
    "Should we genetically modify crops to address food security?",
    "Is the search for extraterrestrial life worth the investment?",
    "Should we allow human-animal hybrid research?",
    "Is the Big Bang theory the best explanation for the universe's origin?",
    "Should we prioritize renewable energy over nuclear fusion research?",
    "Is the placebo effect a legitimate medical treatment?",
    "Should we allow human enhancement through genetic engineering?",
    "Is the concept of race biologically meaningful?",
    "Should we invest more in ocean exploration than space exploration?"
  ],
  politics: [
    "Is democracy the best form of government for all societies?",
    "Should wealth inequality be addressed through redistribution?",
    "Can capitalism and environmental sustainability coexist?",
    "Is globalization beneficial or harmful to developing nations?",
    "Should voting be mandatory in democratic societies?",
    "Should there be term limits for all elected officials?",
    "Is universal basic income a viable solution to economic inequality?",
    "Should corporations have the same rights as individuals?",
    "Is nationalism a positive or negative force in modern politics?",
    "Should we prioritize economic growth or environmental protection?",
    "Is the electoral college system still relevant in modern democracy?",
    "Should we allow unlimited campaign spending in elections?",
    "Is the two-party system beneficial for political discourse?",
    "Should we implement stricter gun control laws?",
    "Is the concept of national borders becoming obsolete?"
  ],
  ethics: [
    "Should we prioritize human lives over animal welfare?",
    "Is it morally acceptable to lie to protect someone's feelings?",
    "Should we allow euthanasia for terminally ill patients?",
    "Is it ethical to use animals for medical research?",
    "Should we hold children responsible for their parents' actions?",
    "Is it morally acceptable to break the law for a good cause?",
    "Should we prioritize present needs over future generations?",
    "Is it ethical to use psychological manipulation in advertising?",
    "Should we allow genetic selection of children's traits?",
    "Is it morally acceptable to profit from others' suffering?",
    "Should we prioritize individual privacy over public safety?",
    "Is it ethical to use artificial intelligence in warfare?",
    "Should we allow the wealthy to buy advantages in education?",
    "Is it morally acceptable to eat meat in modern society?",
    "Should we prioritize human rights over cultural traditions?"
  ],
  society: [
    "Should social media be regulated to prevent mental health issues?",
    "Is traditional education still relevant in the digital age?",
    "Should we prioritize work-life balance over economic productivity?",
    "Is the nuclear family structure still ideal for modern society?",
    "Should we allow children to make major life decisions?",
    "Is the concept of retirement becoming obsolete?",
    "Should we prioritize individual achievement or community cooperation?",
    "Is the traditional 9-to-5 work schedule outdated?",
    "Should we allow genetic testing for employment decisions?",
    "Is the concept of gender becoming more fluid or rigid?",
    "Should we prioritize local communities over global connections?",
    "Is the traditional university model still valuable?",
    "Should we allow children to use technology from birth?",
    "Is the concept of marriage evolving or becoming obsolete?",
    "Should we prioritize individual expression or social harmony?"
  ],
  future: [
    "Will humans eventually merge with artificial intelligence?",
    "Should we prioritize colonizing Mars or fixing Earth?",
    "Is immortality desirable or would it destroy human meaning?",
    "Will virtual reality replace physical reality for most people?",
    "Should we allow human genetic enhancement for non-medical purposes?",
    "Will traditional jobs become obsolete in the next century?",
    "Should we prioritize human exploration or robotic exploration of space?",
    "Is the concept of death becoming optional through technology?",
    "Will traditional education be replaced by AI tutors?",
    "Should we allow human consciousness to be uploaded to computers?",
    "Will physical travel become obsolete in a virtual world?",
    "Should we prioritize human creativity or AI-generated content?",
    "Is the concept of privacy becoming obsolete in the digital age?",
    "Will traditional relationships be replaced by AI companions?",
    "Should we allow human modification beyond current biological limits?"
  ]
};

// Store active debate sessions
const debateSessions = new Map();

// API Routes
app.get('/api/questions/:category', (req, res) => {
  const { category } = req.params;
  if (debateQuestions[category]) {
    const questions = debateQuestions[category];
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    res.json({ success: true, question: randomQuestion });
  } else {
    res.status(400).json({ success: false, error: 'Invalid category' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    sessions: debateSessions.size
  });
});

app.post('/api/debate/start', (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    // Clean up any old sessions that might be lingering
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    for (const [sessionId, session] of debateSessions.entries()) {
      if (session.createdAt < oneHourAgo || !session.isActive) {
        debateSessions.delete(sessionId);
        console.log(`🧹 [CLEANUP] Removed old session: ${sessionId}`);
      }
    }

    const sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    const session = {
      id: sessionId,
      prompt: prompt.trim(),
      messages: [],
      currentTurn: 0,
      isActive: false,
      createdAt: new Date()
    };

    debateSessions.set(sessionId, session);
    
    console.log(`🆕 [NEW SESSION] Created session: ${sessionId} with prompt: "${prompt.trim()}"`);

    res.json({
      success: true,
      sessionId,
      message: 'Debate session created successfully'
    });
  } catch (error) {
    console.error('Error in /api/debate/start:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error: ' + error.message 
    });
  }
});

app.post('/api/debate/stop/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  if (debateSessions.has(sessionId)) {
    const session = debateSessions.get(sessionId);
    session.isActive = false;
    
    // Delete the session to prevent any state confusion
    debateSessions.delete(sessionId);
    
    console.log(`🗑️ [SESSION DELETED] Session ${sessionId} deleted after stop`);
    
    res.json({ success: true, message: 'Debate stopped and session cleared' });
  } else {
    res.status(404).json({ success: false, error: 'Session not found' });
  }
});

// Get debate session status and messages
app.get('/api/debate/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  if (debateSessions.has(sessionId)) {
    const session = debateSessions.get(sessionId);
    
    console.log(`📡 [API POLL] Session ${sessionId} polled. Messages in session: ${session.messages.length}`);
    session.messages.forEach((msg, index) => {
      console.log(`  ${index}: ${msg.speaker} - "${msg.content.substring(0, 30)}..." (isTyping: ${msg.isTyping})`);
    });
    
    res.json({
      success: true,
      session: {
        id: session.id,
        prompt: session.prompt,
        messages: session.messages,
        isActive: session.isActive,
        currentTurn: session.currentTurn
      }
    });
  } else {
    res.status(404).json({ success: false, error: 'Session not found' });
  }
});

// Start the debate
app.post('/api/debate/:sessionId/start', async (req, res) => {
  const { sessionId } = req.params;
  
  if (!debateSessions.has(sessionId)) {
    return res.status(404).json({ success: false, error: 'Session not found' });
  }

  const session = debateSessions.get(sessionId);
  session.isActive = true;
  
  console.log(`Starting debate for session: ${sessionId}`);
  
  // Start the debate loop in background using chat.js function
  if (chatModule && chatModule.runDebateLoop) {
    chatModule.runDebateLoop(sessionId, debateSessions);
  } else {
    console.warn('Chat module not available - debate loop cannot start');
    return res.status(500).json({ 
      success: false, 
      error: 'Chat functionality not available - missing API keys' 
    });
  }
  
  res.json({ success: true, message: 'Debate started' });
});

// Add user message to debate
app.post('/api/debate/:sessionId/message', async (req, res) => {
  const { sessionId } = req.params;
  const { content } = req.body;
  
  if (!debateSessions.has(sessionId)) {
    return res.status(404).json({ success: false, error: 'Session not found' });
  }

  const session = debateSessions.get(sessionId);
  
  const message = {
    id: Date.now().toString(),
    speaker: 'USER',
    content: content,
    timestamp: new Date(),
    turn: session.messages.length
  };
  
  session.messages.push(message);
  
  console.log(`👤 [USER MESSAGE] Session ${sessionId}: "${content}"`);
  
  // If debate is active, trigger an AI response to the user message
  if (session.isActive) {
    console.log(`🤖 [TRIGGERING AI RESPONSE] to user message`);
    
    // Use the chat.js function to handle the AI response
    if (chatModule && chatModule.handleUserMessageResponse) {
      setTimeout(async () => {
        await chatModule.handleUserMessageResponse(session, debateSessions);
      }, 2000);
    } else {
      console.warn('Chat module not available - cannot respond to user message');
    }
  }
  
  res.json({ success: true, message: 'Message added' });
});





// Cleanup old sessions (run every hour)
setInterval(() => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  for (const [sessionId, session] of debateSessions.entries()) {
    if (session.createdAt < oneHourAgo) {
      debateSessions.delete(sessionId);
      console.log(`Cleaned up old session: ${sessionId}`);
    }
  }
}, 60 * 60 * 1000);

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// For Vercel serverless deployment
module.exports = app;

// For local development
if (require.main === module) {
  // Robustly parse and validate PORT to avoid issues like "3003image.png"
  const rawPort = process.env.PORT;
  const parsed = Number.parseInt(rawPort, 10);
  const PORT = Number.isFinite(parsed) && parsed > 0 && parsed < 65536 ? parsed : 3003;

  app.listen(PORT, () => {
    console.log(`Debate Terminal server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to access the application`);
  });
}
