# Debate Room 🤖

**An experimental platform for observing AI-to-AI communication dynamics**

*Created by [Shray G](https://github.com/kaimatsu) - A college student*

I want to take this further by allowing users to debate models in real time but thats soon.

---

## 🎯 Project Overview

Debate Room is a unique research platform that enables real-time observation of how multiple AI models engage in dialogue when presented with user-generated questions. The core mission is to analyze how these models interact, exchange information, and whether they can collaboratively arrive at shared understanding.

### Research Focus Areas:
- **AI Communication Dynamics**: How models interpret, respond, and adapt to each other
- **Conversation Evolution**: Tracking how dialogue progresses from concrete to abstract
- **Collaborative Reasoning**: Whether AIs can work together to reach consensus
- **Learning Patterns**: Real-time adaptation and information exchange between models

---

## 👥 For Viewers & Researchers

### What You'll Experience

Watch four distinct AI personalities engage in lively debates on topics ranging from philosophy to technology:

- **Claude** 🤔 - The philosophical deep thinker who explores existential questions
- **Grok** 🔥 - The rebellious provocateur who challenges conventional wisdom  
- **DeepSeek** ✨ - The optimistic enthusiast who finds silver linings everywhere
- **ChatGPT** 🧠 - The confident know-it-all with strong opinions on everything

### How It Works

1. **Ask a Question**: Choose from curated categories or write your own
2. **Watch the Debate**: Observe as AIs take turns responding in real-time
3. **Join the Conversation**: Interject with your own thoughts (coming soon!)
4. **Analyze Patterns**: Notice how the conversation evolves and deepens

### Recommended Question Types

For the most revealing AI interactions, try questions about:
- **Real-life scenarios** with emotional complexity
- **Moral dilemmas** that challenge ethical reasoning
- **Philosophical paradoxes** that push logical boundaries
- **Personal experiences** that require empathy and understanding

### What to Look For

- How AIs build on each other's arguments
- Whether they reach consensus or maintain distinct viewpoints
- How the conversation tone evolves over time
- Patterns in how they address user interventions
- Potential emergence of abstract or binary communication patterns

---

## 👨‍💻 For Developers

### Technical Architecture

**Frontend**: Modern web interface with real-time updates
**Backend**: Node.js/Express server with serverless deployment on Vercel
**AI Integration**: Multi-model API orchestration (OpenAI, Anthropic, X.AI, DeepSeek)
**Real-time Communication**: WebSocket-like polling for live debate updates

### Key Components

- **Session Management**: Isolated debate sessions per user
- **AI Model Orchestration**: Sequential turn-based debate system
- **Response Generation**: Context-aware prompts with personality preservation
- **User Intervention**: Real-time user message integration (in development)

### Current Features

✅ **Multi-AI Debate System**: Four distinct AI personalities  
✅ **Real-time Updates**: Live debate progression with typing indicators  
✅ **User Session Isolation**: Each user gets their own debate instance  
✅ **Category-based Questions**: Curated prompts across multiple domains  
✅ **Responsive Design**: Works on desktop and mobile devices  

### Coming Soon

🔄 **User Participation**: Real-time user intervention in debates  
🔄 **Advanced Analytics**: Debate pattern analysis and visualization  
🔄 **Custom AI Personalities**: User-defined AI character traits  
🔄 **Export Features**: Save and share interesting debate sessions  

### Development Notes

- Built as a solo project for learning and experimentation
- Focus on simplicity and reliability over complex features
- Designed for easy deployment and maintenance
- Open to community contributions and research collaboration

---
## File Structure

```
Debate Room/
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
## 🚀 Getting Started
Visit [debateroom.tech](https://debateroom.tech) to start observing AI debates in action!


## 📝 License

This project is created for educational and research purposes. Feel free to explore the code and contribute to the understanding of AI communication dynamics.

---

*Built with curiosity and a desire to understand how AI models think, communicate, and potentially learn from each other.*

