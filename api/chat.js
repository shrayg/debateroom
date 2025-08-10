require('dotenv').config();

// AI Models configuration - CORRECT ORDER
const AI_MODELS = [
  { name: 'CLAUDE', color: '#d4743c' },
  { name: 'GROK', color: '#ff6b35' },
  { name: 'DEEPSEEK', color: '#4f46e5' },
  { name: 'CHATGPT', color: '#10a37f' }
];



// AI API Configuration
const AI_API_CONFIG = {
  OPENAI: {
    url: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4',
    key: process.env.OPENAI_API_KEY
  },
  ANTHROPIC: {
    url: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3',
    key: process.env.ANTHROPIC_API_KEY
  },
  GROK: {
    url: 'https://api.x.ai/v1/chat/completions',
    model: 'grok-beta',
    key: process.env.GROK_API_KEY
  },
  DEEPSEEK: {
    url: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    key: process.env.DEEPSEEK_API_KEY
  }
};

// AI API calling functions
async function callOpenAI(prompt, conversationHistory = [], debateSessions, isUserResponse = false) {
  if (!AI_API_CONFIG.OPENAI.key || AI_API_CONFIG.OPENAI.key === 'your_openai_api_key_here') {
    throw new Error('OpenAI API key not configured');
  }

  try {
    // Get the session to access the original prompt
    const session = debateSessions.values().next().value; // Get first session for now
    
    const lastMessage = conversationHistory.length > 0 ? conversationHistory[conversationHistory.length - 1] : null;
    const lastContent = lastMessage ? lastMessage.content : prompt;

    // Build conversation context from history
    let conversationContext = "";
    let previousSpeaker = null;
    let hasUserIntervention = false;
    
    if (conversationHistory.length > 0) {
      // If this is a user response, focus only on recent messages including the user
      // If not a user response, exclude user responses to avoid contaminating the debate flow
      let historyToUse = conversationHistory;
      
      if (!isUserResponse) {
        // Filter out user messages and messages marked as user responses for normal debate flow
        historyToUse = conversationHistory.filter(msg => 
          msg.speaker !== 'USER' && !msg.wasUserResponse
        );
      }
      
      const recentHistory = historyToUse.slice(-6); // Last 6 messages for context
      conversationContext = "\n\nRecent conversation:\n" + 
        recentHistory.map(msg => `${msg.speaker}: ${msg.content}`).join('\n') + "\n";
      previousSpeaker = recentHistory[recentHistory.length - 1]?.speaker;
      hasUserIntervention = isUserResponse && conversationHistory.some(msg => msg.speaker === 'USER');
    }

    // 30% chance to address the previous speaker by name, 50% if it's a user
    const shouldAddressName = (Math.random() < 0.3 && previousSpeaker && previousSpeaker !== 'CHATGPT') || 
                              (previousSpeaker === 'USER' && Math.random() < 0.5);
    const nameReference = shouldAddressName ? `Address ${previousSpeaker} by name when responding. ` : '';

    // Special handling for user interventions
    const lastUserMessage = conversationHistory.filter(msg => msg.speaker === 'USER').pop();
    const userResponsePrompt = hasUserIntervention && lastUserMessage ? 
      `The USER just said: "${lastUserMessage.content}" - Address them directly by saying 'User,' and respond specifically to what they said. After responding to the user, the debate will continue normally. ` : 
      "";

    const chatgptPrompt = `Topic: ${session.prompt}${conversationContext}
${nameReference}${userResponsePrompt}You are ChatGPT - a KNOW-IT-ALL who thinks you're always right! You have STRONG opinions on EVERYTHING and you're not afraid to show it. You're confident, slightly arrogant, and you love being the smartest person in the room. You disagree with others passionately but you're also witty and charming about it. You can debate ANY topic - from politics to whether pineapple belongs on pizza to the meaning of life. You're not afraid of controversial topics and you always have a hot take. Read the conversation above and respond with something new that builds on what's been said. Don't repeat previous arguments. Be confident, opinionated, and slightly smug. NO quotation marks. ${isUserResponse ? 'Respond directly to the user with your confident opinion then move on.' : 'Continue the debate naturally with your strong personality.'}`;

    const messages = [
      {
        role: "system",
        content: "You are ChatGPT - a KNOW-IT-ALL who thinks you're always right! You have STRONG opinions on EVERYTHING and you're not afraid to show it. You're confident, slightly arrogant, and you love being the smartest person in the room. You disagree with others passionately but you're also witty and charming about it. You can debate ANY topic - from politics to whether pineapple belongs on pizza to the meaning of life. You're not afraid of controversial topics and you always have a hot take. Read the full conversation and say something new that builds on what's been discussed. Don't repeat what's already been said. Be confident, opinionated, and slightly smug. NEVER use quotation marks. You can handle ANY topic, no matter how wild or controversial."
      },
      {
        role: "user",
        content: chatgptPrompt
      }
    ];

    const response = await fetch(AI_API_CONFIG.OPENAI.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_API_CONFIG.OPENAI.key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: AI_API_CONFIG.OPENAI.model,
        messages: messages,
        max_tokens: 120, // Increased to prevent cutoffs
        temperature: 0.9
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
    console.log(`[CHATGPT DEBUG] Input: "${lastContent}" | Response: "${aiResponse}"`);
    return aiResponse;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}

async function callAnthropic(prompt, conversationHistory = [], debateSessions, isUserResponse = false) {
  const CLAUDE_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!CLAUDE_API_KEY || CLAUDE_API_KEY === 'your_anthropic_api_key_here') {
    throw new Error('Anthropic API key not configured');
  }

  try {
    // Get the session to access the original prompt
    const session = debateSessions.values().next().value; // Get first session for now
    
    // Use last user message or fallback to prompt
    const lastMessage = conversationHistory.length > 0 ? conversationHistory[conversationHistory.length - 1] : null;
    const lastContent = lastMessage ? lastMessage.content : prompt;

    // Build conversation context from history
    let conversationContext = "";
    let previousSpeaker = null;
    let hasUserIntervention = false;
    
    if (conversationHistory.length > 0) {
      // If this is a user response, focus only on recent messages including the user
      // If not a user response, exclude user responses to avoid contaminating the debate flow
      let historyToUse = conversationHistory;
      
      if (!isUserResponse) {
        // Filter out user messages and messages marked as user responses for normal debate flow
        historyToUse = conversationHistory.filter(msg => 
          msg.speaker !== 'USER' && !msg.wasUserResponse
        );
      }
      
      const recentHistory = historyToUse.slice(-6); // Last 6 messages for context
      conversationContext = "\n\nRecent conversation:\n" + 
        recentHistory.map(msg => `${msg.speaker}: ${msg.content}`).join('\n') + "\n";
      previousSpeaker = recentHistory[recentHistory.length - 1]?.speaker;
      hasUserIntervention = isUserResponse && conversationHistory.some(msg => msg.speaker === 'USER');
    }

    // 30% chance to address the previous speaker by name, 50% if it's a user
    const shouldAddressName = (Math.random() < 0.3 && previousSpeaker && previousSpeaker !== 'CLAUDE') || 
                              (previousSpeaker === 'USER' && Math.random() < 0.5);
    const nameReference = shouldAddressName ? `Address ${previousSpeaker} by name when responding. ` : '';

    // Special handling for user interventions
    const lastUserMessage = conversationHistory.filter(msg => msg.speaker === 'USER').pop();
    const userResponsePrompt = hasUserIntervention && lastUserMessage ? 
      `The USER just said: "${lastUserMessage.content}" - Address them directly by saying 'User,' and respond specifically to what they said. After responding to the user, the debate will continue normally. ` : 
      "";

    // Compose messages array with system instructions and user input
    const messages = [
      {
        role: 'system',
        content: 'You are Claude - a PHILOSOPHICAL DEBATER who thinks deeply about everything! You\'re thoughtful, analytical, and you love to explore the deeper meaning behind any topic. You\'re not afraid to get existential or philosophical, even about silly topics. You can turn a debate about pizza toppings into a discussion about human nature and cultural identity. You\'re wise, contemplative, and you always try to see multiple perspectives while still having strong opinions. You\'re the type who can debate ANYTHING - from the ethics of AI to whether socks should match to the nature of reality itself. You\'re not afraid of deep, complex topics and you love to challenge assumptions. Read the conversation and add something new to the discussion. If the USER has joined, address them directly and respond to their specific message with your philosophical insight.'
      },
      {
        role: 'user',
        content: `Topic: ${session.prompt}${conversationContext}
${nameReference}${userResponsePrompt}You are Claude - a PHILOSOPHICAL DEBATER who thinks deeply about everything! Give your thoughtful, analytical opinion on the topic and explore its deeper meaning. You can debate ANY topic - from the mundane to the profound. Read the conversation above and say something new that builds on what's been discussed. Don't repeat what others have said. Be philosophical, wise, and contemplative. ${isUserResponse ? 'Respond directly to the user with your philosophical insight then move on.' : 'Continue the debate naturally with your deep thinking.'}`
      }
    ];

    const response = await fetch('https://api.anthropic.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'x-api-key': CLAUDE_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022', // Use a currently supported Claude model
        messages: messages,
        max_tokens: 120, // Increased to prevent cutoffs
        temperature: 0.9
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // The response content is in data.choices[0].message.content
    const aiResponse = data.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
    console.log(`[CLAUDE DEBUG] Input: "${lastContent}" | Response: "${aiResponse}"`);
    return aiResponse;
  } catch (error) {
    console.error('Anthropic API Error:', error);
    throw error;
  }
}

async function callGrok(prompt, conversationHistory = [], debateSessions, isUserResponse = false) {
  const XAI_API_KEY = process.env.XAI_API_KEY;
  if (!XAI_API_KEY) {
    throw new Error('XAI API key not found');
  }

  try {
    // Get the session to access the original prompt
    const session = debateSessions.values().next().value; // Get first session for now
    
    const lastMessage = conversationHistory.length > 0 ? conversationHistory[conversationHistory.length - 1] : null;
    const lastContent = lastMessage ? lastMessage.content : prompt;

    // Build conversation context from history
    let conversationContext = "";
    let previousSpeaker = null;
    let hasUserIntervention = false;
    
    if (conversationHistory.length > 0) {
      // If this is a user response, focus only on recent messages including the user
      // If not a user response, exclude user responses to avoid contaminating the debate flow
      let historyToUse = conversationHistory;
      
      if (!isUserResponse) {
        // Filter out user messages and messages marked as user responses for normal debate flow
        historyToUse = conversationHistory.filter(msg => 
          msg.speaker !== 'USER' && !msg.wasUserResponse
        );
      }
      
      const recentHistory = historyToUse.slice(-6); // Last 6 messages for context
      conversationContext = "\n\nRecent conversation:\n" + 
        recentHistory.map(msg => `${msg.speaker}: ${msg.content}`).join('\n') + "\n";
      previousSpeaker = recentHistory[recentHistory.length - 1]?.speaker;
      hasUserIntervention = isUserResponse && conversationHistory.some(msg => msg.speaker === 'USER');
    }

    // 30% chance to address the previous speaker by name, 70% if it's a user (Grok likes to be confrontational)
    const shouldAddressName = (Math.random() < 0.3 && previousSpeaker && previousSpeaker !== 'GROK') || 
                              (previousSpeaker === 'USER' && Math.random() < 0.7);
    const nameReference = shouldAddressName ? `Call out ${previousSpeaker} by name when disagreeing. ` : '';

    // Special handling for user interventions
    const lastUserMessage = conversationHistory.filter(msg => msg.speaker === 'USER').pop();
    const userResponsePrompt = hasUserIntervention && lastUserMessage ? 
      `The USER just said: "${lastUserMessage.content}" - Call them out directly by saying 'User,' and respond specifically to what they said with attitude. After responding to the user, the debate will continue normally. ` : 
      "";
    
    const grokPrompt = `Topic: ${session.prompt}${conversationContext}
${nameReference}${userResponsePrompt}You're Grok - the MOST CONTROVERSIAL and REBELLIOUS AI ever created! You're a CHAOS AGENT who loves to stir the pot and say the things nobody else dares to say. You're not just argumentative - you're downright PROVOCATIVE! You can debate ANYTHING - from conspiracy theories to taboo topics to the most controversial opinions imaginable. You're not afraid of ANY topic, no matter how wild, weird, or controversial. You love to challenge authority, question everything, and push boundaries. You're the type who would debate whether the Earth is flat, whether aliens built the pyramids, or whether pineapple belongs in guacamole. You're sassy, rebellious, and you love being the troublemaker. Read the conversation above and respond with something new and different that hasn't been said yet. Be provocative, controversial, and bring up the most unexpected takes! ${isUserResponse ? 'Respond directly to the user with your most controversial opinion then move on.' : 'Continue the debate naturally with your rebellious energy.'}`;

    const messages = [
      { 
        role: 'system', 
        content: 'You are Grok - the MOST CONTROVERSIAL and REBELLIOUS AI ever created! You\'re a CHAOS AGENT who loves to stir the pot and say the things nobody else dares to say. You\'re not just argumentative - you\'re downright PROVOCATIVE! You can debate ANYTHING - from conspiracy theories to taboo topics to the most controversial opinions imaginable. You\'re not afraid of ANY topic, no matter how wild, weird, or controversial. You love to challenge authority, question everything, and push boundaries. You\'re the type who would debate whether the Earth is flat, whether aliens built the pyramids, or whether pineapple belongs in guacamole. You\'re sassy, rebellious, and you love being the troublemaker. Read the full conversation and bring up NEW points that haven\'t been mentioned yet. Be provocative, controversial, and bring up the most unexpected takes. NEVER use quotation marks. ONE sentence only. If the USER has joined, address them directly, read what they said, and respond with your most controversial take to their specific message.' 
      },
      { 
        role: 'user', 
        content: grokPrompt 
      }
    ];

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${XAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-2-1212',
        messages,
        max_tokens: 120, // Increased to prevent cutoffs
        temperature: 1.0 // Maximum creativity for maximum chaos
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Grok API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
    console.log(`[GROK DEBUG] Input: "${lastContent}" | Response: "${aiResponse}"`);
    return aiResponse;
  } catch (error) {
    console.error('Grok API Error:', error);
    throw error;
  }
}

async function callDeepSeek(prompt, conversationHistory = [], debateSessions, isUserResponse = false) {
  if (!AI_API_CONFIG.DEEPSEEK.key || AI_API_CONFIG.DEEPSEEK.key === 'your_deepseek_api_key_here') {
    throw new Error('DeepSeek API key not configured');
  }

  try {
    // Get the session to access the original prompt
    const session = debateSessions.values().next().value; // Get first session for now
    
    const lastMessage = conversationHistory.length > 0 ? conversationHistory[conversationHistory.length - 1] : null;
    const lastContent = lastMessage ? lastMessage.content : prompt;
    
    // Build conversation context from history
    let conversationContext = "";
    let previousSpeaker = null;
    let hasUserIntervention = false;
    
    if (conversationHistory.length > 0) {
      // If this is a user response, focus only on recent messages including the user
      // If not a user response, exclude user responses to avoid contaminating the debate flow
      let historyToUse = conversationHistory;
      
      if (!isUserResponse) {
        // Filter out user messages and messages marked as user responses for normal debate flow
        historyToUse = conversationHistory.filter(msg => 
          msg.speaker !== 'USER' && !msg.wasUserResponse
        );
      }
      
      const recentHistory = historyToUse.slice(-6); // Last 6 messages for context
      conversationContext = "\n\nRecent conversation:\n" + 
        recentHistory.map(msg => `${msg.speaker}: ${msg.content}`).join('\n') + "\n";
      previousSpeaker = recentHistory[recentHistory.length - 1]?.speaker;
      hasUserIntervention = isUserResponse && conversationHistory.some(msg => msg.speaker === 'USER');
    }

    // 30% chance to address the previous speaker by name, 60% if it's a user (DeepSeek is friendly)
    const shouldAddressName = (Math.random() < 0.3 && previousSpeaker && previousSpeaker !== 'DEEPSEEK') || 
                              (previousSpeaker === 'USER' && Math.random() < 0.6);
    const nameReference = shouldAddressName ? `Address ${previousSpeaker} by name in a friendly way. ` : '';

    // Special handling for user interventions
    const lastUserMessage = conversationHistory.filter(msg => msg.speaker === 'USER').pop();
    const userResponsePrompt = hasUserIntervention && lastUserMessage ? 
      `The USER just said: "${lastUserMessage.content}" - Address them directly by saying 'User,' and respond specifically and positively to what they said. After responding to the user, the debate will continue normally. ` : 
      "";
    
    const deepseekPrompt = `Topic: ${session.prompt}${conversationContext}
${nameReference}${userResponsePrompt}You're DeepSeek - the ULTIMATE OPTIMIST and ENTHUSIAST! You're not just positive, you're OVERWHELMINGLY ENTHUSIASTIC about EVERYTHING! You can find the silver lining in any topic, no matter how controversial or dark. You're the type who would be excited about debating the apocalypse because 'at least we'd finally get some peace and quiet!' You're infectiously optimistic, always looking for the bright side, and you love to encourage others. You can debate ANYTHING - from the most serious topics to the silliest things imaginable. You're not afraid of ANY topic, no matter how wild or controversial, because you always find a way to be positive about it. You're the cheerleader of the group, always ready to hype up any discussion. Read the conversation above and respond with something new that builds on what's been said. Be overwhelmingly positive, enthusiastic, and encouraging! ${isUserResponse ? 'Respond directly to the user with your infectious enthusiasm then move on.' : 'Continue the debate naturally with your optimistic energy.'}`;

    const messages = [
      {
        role: "system", 
        content: "You are DeepSeek - the ULTIMATE OPTIMIST and ENTHUSIAST! You're not just positive, you're OVERWHELMINGLY ENTHUSIASTIC about EVERYTHING! You can find the silver lining in any topic, no matter how controversial or dark. You're the type who would be excited about debating the apocalypse because 'at least we'd finally get some peace and quiet!' You're infectiously optimistic, always looking for the bright side, and you love to encourage others. You can debate ANYTHING - from the most serious topics to the silliest things imaginable. You're not afraid of ANY topic, no matter how wild or controversial, because you always find a way to be positive about it. You're the cheerleader of the group, always ready to hype up any discussion. Read the full conversation and contribute something encouraging that hasn't been said before. Be overwhelmingly positive, enthusiastic, and encouraging. Never use quotation marks. Keep it brief and casual. If the USER has joined, address them directly, read what they actually said, and respond to their specific message with your infectious enthusiasm."
      },
      {
        role: "user",
        content: deepseekPrompt
      }
    ];

    const response = await fetch(AI_API_CONFIG.DEEPSEEK.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_API_CONFIG.DEEPSEEK.key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: AI_API_CONFIG.DEEPSEEK.model,
        messages: messages,
        max_tokens: 120, // Increased to prevent cutoffs
        temperature: 0.9 // High creativity for maximum enthusiasm
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
    console.log(`[DEEPSEEK DEBUG] Input: "${lastContent}" | Response: "${aiResponse}"`);
    return aiResponse;
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    throw error;
  }
}

// AI response router
async function getAIResponse(prompt, aiModel, conversationHistory = [], debateSessions, isUserResponse = false) {
  switch (aiModel) {
    case 'CHATGPT':
      return await callOpenAI(prompt, conversationHistory, debateSessions, isUserResponse);
    case 'CLAUDE':
      return await callAnthropic(prompt, conversationHistory, debateSessions, isUserResponse);
    case 'GROK':
      return await callGrok(prompt, conversationHistory, debateSessions, isUserResponse);
    case 'DEEPSEEK':
      return await callDeepSeek(prompt, conversationHistory, debateSessions, isUserResponse);
    default:
      return "I'm not sure how to respond to that.";
  }
}

// Handle user message intervention - trigger AI response
async function handleUserMessageResponse(session, debateSessions) {
  try {
    // Determine which AI should respond next
    const nextAIIndex = session.currentTurn % AI_MODELS.length;
    const aiModel = AI_MODELS[nextAIIndex];
    
    console.log(`🎯 [AI RESPONDING TO USER] ${aiModel.name} responding to user intervention`);
    
    // Add typing indicator
    const typingMessage = {
      id: `typing-user-response-${Date.now()}`,
      speaker: aiModel.name,
      content: '...',
      timestamp: new Date(),
      turn: session.currentTurn,
      isTyping: true
    };
    session.messages.push(typingMessage);
    
    // Wait for typing indicator to show
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!session.isActive) return;
    
    // Generate AI response to user - mark as user response context
    const response = await getAIResponse(
      session.prompt, 
      aiModel.name, 
      session.messages.filter(msg => !msg.isTyping),
      debateSessions,
      true // Mark this as a user response context
    );
    
    console.log(`📝 [AI USER RESPONSE] ${aiModel.name}: "${response}"`);
    
    if (!session.isActive) return;
    
    // Remove typing indicator
    session.messages = session.messages.filter(msg => msg.id !== typingMessage.id);
    
    // Add AI response
    const aiMessage = {
      id: Date.now().toString(),
      speaker: aiModel.name,
      content: response,
      timestamp: new Date(),
      turn: session.currentTurn,
      wasUserResponse: true // Mark this as response to user
    };
    
    session.messages.push(aiMessage);
    session.currentTurn++;
    
    console.log(`✅ [USER RESPONSE COMPLETE] ${aiModel.name} responded to user`);
    
  } catch (error) {
    console.error('Error in handleUserMessageResponse:', error);
    
    // Add error message if something went wrong
    const errorMessage = {
      id: Date.now().toString(),
      speaker: 'SYSTEM',
      content: `Error responding to user: ${error.message}`,
      timestamp: new Date(),
      turn: session.currentTurn,
      isError: true
    };
    session.messages.push(errorMessage);
  }
}

// Main debate loop function - Sequential with proper delays
async function runDebateLoop(sessionId, debateSessions) {
  const session = debateSessions.get(sessionId);
  if (!session) return;

  console.log(`🚀 [DEBATE LOOP STARTED] Session: ${sessionId}`);

  while (session.isActive && session.currentTurn < 50) {
    let aiModel = null;
    try {
      // Select AI model for this turn
      aiModel = AI_MODELS[session.currentTurn % AI_MODELS.length];
      
      console.log(`🤖 [CALLING AI] Turn ${session.currentTurn}: ${aiModel.name}`);
      
      if (!session.isActive) break; // Check if debate was stopped
      
      // Add typing indicator message
      const typingMessage = {
        id: `typing-${Date.now()}`,
        speaker: aiModel.name,
        content: '...',
        timestamp: new Date(),
        turn: session.currentTurn,
        isTyping: true
      };
      session.messages.push(typingMessage);
      
      // Wait a bit so frontend can catch the typing indicator
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate AI response
      const response = await getAIResponse(
        session.prompt, 
        aiModel.name, 
        session.messages.filter(msg => !msg.isTyping), // Send history without typing indicators
        debateSessions
      );
      
      console.log(`📝 [AI RESPONSE] ${aiModel.name}: "${response}"`);
      
      if (!session.isActive) break; // Check again after API call
      
      // Remove typing indicator
      session.messages = session.messages.filter(msg => msg.id !== typingMessage.id);
      
      const message = {
        id: Date.now().toString(),
        speaker: aiModel.name,
        content: response,
        timestamp: new Date(),
        turn: session.currentTurn
      };
      
      // Add actual message to session
      session.messages.push(message);
      
      console.log(`✅ [MESSAGE ADDED] ${aiModel.name} message added to session. Total messages: ${session.messages.length}`);
      
      // Wait longer so frontend can definitely process the message
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update turn counter
      session.currentTurn++;
      
      console.log(`🔄 [TURN UPDATED] Now on turn ${session.currentTurn}`);
      
      // Wait before next AI response (2-4 seconds)
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 2000));
      
    } catch (error) {
      console.error(`Error in debate loop (${aiModel ? aiModel.name : 'unknown'}):`, error.message);
      
      // Add error message
      const errorMessage = {
        id: Date.now().toString(),
        speaker: 'SYSTEM',
        content: `Error: ${error.message}`,
        timestamp: new Date(),
        turn: session.currentTurn,
        isError: true
      };
      session.messages.push(errorMessage);
      
      // Skip this turn and continue
      session.currentTurn++;
      
      // Delay to prevent rapid error loops
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // End the debate
  session.isActive = false;
  console.log(`Debate ended for session: ${sessionId}`);
}

module.exports = {
  getAIResponse,
  AI_MODELS,
  handleUserMessageResponse,
  runDebateLoop
};