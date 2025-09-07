# 🤖 Google Gemini AI Integration

This project uses **Google Gemini AI** (specifically Gemini 1.5 Pro) instead of OpenAI GPT-4 for all AI-powered features.

## 🌟 Why Gemini?

- **Free Tier Available**: Generous free quota for development
- **Superior Context Window**: 1 million tokens context length
- **Multimodal Capabilities**: Process text, images, and code
- **Lower Latency**: Fast response times
- **Better Code Understanding**: Excellent at understanding and generating code
- **Cost-Effective**: More affordable than GPT-4 for production use

## 🚀 Features Powered by Gemini

### 1. **Intelligent Stack Recommendations**
Gemini analyzes your project description and provides:
- Optimal technology stack based on requirements
- Alternative options for each component
- Detailed reasoning for choices
- Performance considerations

### 2. **Project Requirement Analysis**
Natural language processing to extract:
- Project type (e-commerce, SaaS, API, etc.)
- Required features
- Scale estimation
- Team size recommendations
- Deployment targets

### 3. **Code Generation**
Generate production-ready code:
- Boilerplate files
- API endpoints
- Database schemas
- Authentication logic
- Configuration files
- Docker setups

### 4. **Stack Optimization**
Get AI-powered suggestions for:
- Performance improvements
- Security enhancements
- Cost optimization
- Developer experience
- Scalability patterns

### 5. **Technology Explanations**
Understand your stack better:
- How technologies work together
- Best practices
- Common pitfalls
- Learning resources

## 🔧 Setup Guide

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new project or select existing
5. Copy your API key

### 2. Configure Environment

```bash
# In apps/web/.env.local
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Test the Integration

```bash
# Start the web app
cd apps/web
npm run dev

# Visit http://localhost:3000
# Click on "AI Assistant" to test Gemini
```

## 📡 API Endpoints

### `/api/ai/suggest`
Get stack suggestions based on requirements.

**Request:**
```json
{
  "description": "I need an e-commerce platform with real-time inventory",
  "scalability": "large",
  "teamSize": 5,
  "experience": "intermediate"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": {
      "frontend": ["nextjs"],
      "backend": "express",
      "database": "postgres",
      "orm": "prisma",
      "auth": "jwt",
      "addons": ["redis", "docker"],
      "reasoning": "..."
    },
    "explanation": "...",
    "optimizations": ["..."]
  }
}
```

### `/api/ai/generate`
Generate code based on stack.

**Request:**
```json
{
  "stack": {
    "frontend": ["react"],
    "backend": "express",
    "database": "postgres",
    "orm": "prisma",
    "auth": "jwt",
    "addons": ["eslint"]
  },
  "fileName": "server.js",
  "description": "Create an Express server with authentication"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fileName": "server.js",
    "code": "// Generated code...",
    "language": "javascript"
  }
}
```

## 🎯 Usage Examples

### React Component Usage

```typescript
import { geminiService } from '@/services/gemini';

// Get stack suggestions
const requirements = {
  projectType: 'saas',
  description: 'Multi-tenant SaaS with billing',
  scalability: 'large',
  teamSize: 10
};

const suggestions = await geminiService.getSuggestions(requirements);

// Generate code
const code = await geminiService.generateCode(
  suggestions,
  'api/auth.js',
  'Authentication endpoints with JWT'
);

// Get optimization tips
const tips = await geminiService.optimizeStack(suggestions);
```

### CLI Integration

```javascript
// In the CLI tool
const { geminiService } = require('./services/gemini');

async function getAISuggestions(description) {
  const requirements = await geminiService.analyzeRequirements(description);
  const stack = await geminiService.getSuggestions(requirements);
  return stack;
}
```

## 🔒 Safety & Security

### Built-in Safety Settings
- Harassment blocking
- Hate speech filtering
- Explicit content prevention
- Dangerous content blocking

### Rate Limiting
- Free tier: 60 requests per minute
- Pro tier: 1000 requests per minute

### Best Practices
1. Never expose API keys in client-side code
2. Implement rate limiting on your endpoints
3. Validate and sanitize all inputs
4. Cache responses when possible
5. Use environment variables for keys

## 💰 Pricing & Limits

### Free Tier (Perfect for Development)
- **Rate Limit**: 60 RPM (requests per minute)
- **Daily Limit**: 1,500 requests
- **Context Window**: 128k tokens
- **Cost**: $0

### Pay-as-you-go
- **Input**: $0.00025 per 1k tokens
- **Output**: $0.0005 per 1k tokens
- **Context Window**: 1M tokens
- **Rate Limit**: 1000 RPM

## 🛠️ Advanced Features

### 1. Multi-turn Conversations
```typescript
const chat = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })
  .startChat({
    history: messages,
    generationConfig,
  });

const result = await chat.sendMessage(prompt);
```

### 2. Streaming Responses
```typescript
const result = await model.generateContentStream(prompt);

for await (const chunk of result.stream) {
  console.log(chunk.text());
}
```

### 3. Function Calling
```typescript
const functions = {
  createProject: {
    description: "Create a new project",
    parameters: { /* ... */ }
  }
};

const result = await model.generateContent({
  contents: [{ role: 'user', parts: [{ text: prompt }] }],
  tools: [{ functionDeclarations: functions }],
});
```

## 🐛 Troubleshooting

### Common Issues

1. **"API key not configured"**
   - Ensure `NEXT_PUBLIC_GEMINI_API_KEY` is set in `.env.local`
   - Restart the development server

2. **"Rate limit exceeded"**
   - Implement caching
   - Upgrade to paid tier
   - Add request throttling

3. **"Invalid API key"**
   - Check key format
   - Verify key permissions
   - Regenerate if needed

4. **"Context length exceeded"**
   - Reduce prompt size
   - Use summarization
   - Split into multiple requests

## 📚 Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google AI Studio](https://makersuite.google.com/)
- [Gemini Cookbook](https://github.com/google-gemini/cookbook)
- [API Reference](https://ai.google.dev/api/rest)
- [Pricing Calculator](https://ai.google.dev/pricing)

## 🔄 Migration from OpenAI

If migrating from OpenAI:

1. **Response Format**: Gemini returns structured differently
2. **Token Counting**: Different tokenization method
3. **Model Names**: Use `gemini-1.5-pro` instead of `gpt-4`
4. **Safety Settings**: Configure appropriately
5. **Streaming**: Different API for streaming

## 🎉 Benefits Over OpenAI

| Feature | Gemini | OpenAI GPT-4 |
|---------|---------|--------------|
| Free Tier | ✅ Yes | ❌ No |
| Context Window | 1M tokens | 128k tokens |
| Multimodal | ✅ Native | ⚠️ Limited |
| Code Understanding | Excellent | Good |
| Response Speed | Fast | Moderate |
| Cost (per 1M tokens) | $0.25 | $30+ |
| Rate Limits (free) | 60 RPM | N/A |

---

Built with 💜 using Google Gemini AI
