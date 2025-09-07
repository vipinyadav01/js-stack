import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Generation config
const generationConfig = {
  temperature: 0.7,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

export interface StackSuggestion {
  frontend: string[];
  backend: string;
  database: string;
  orm: string;
  auth: string;
  addons: string[];
  reasoning: string;
  alternatives?: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
  };
}

export interface ProjectRequirements {
  projectType: string;
  description: string;
  features?: string[];
  scalability?: 'small' | 'medium' | 'large';
  teamSize?: number;
  experience?: 'beginner' | 'intermediate' | 'expert';
  deployment?: string[];
  budget?: 'low' | 'medium' | 'high';
}

class GeminiService {
  private model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-pro',
    safetySettings,
    generationConfig,
  });

  /**
   * Get AI-powered stack suggestions based on project requirements
   */
  async getSuggestions(requirements: ProjectRequirements): Promise<StackSuggestion> {
    const prompt = this.buildPrompt(requirements);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseResponse(text);
    } catch (error) {
      console.error('Gemini AI Error:', error);
      return this.getFallbackSuggestion(requirements);
    }
  }

  /**
   * Generate code snippets using Gemini
   */
  async generateCode(
    stack: StackSuggestion,
    fileName: string,
    description: string
  ): Promise<string> {
    const prompt = `
Generate production-ready ${fileName} code for a project with the following stack:
- Frontend: ${stack.frontend.join(', ')}
- Backend: ${stack.backend}
- Database: ${stack.database}
- ORM: ${stack.orm}
- Auth: ${stack.auth}

Description: ${description}

Requirements:
1. Include proper error handling
2. Follow best practices
3. Add helpful comments
4. Make it TypeScript-ready
5. Include necessary imports

Generate the complete code:
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Code generation error:', error);
      return '// Error generating code. Please try again.';
    }
  }

  /**
   * Get AI explanation for technology choices
   */
  async explainStack(stack: StackSuggestion): Promise<string> {
    const prompt = `
Explain why this technology stack is recommended:
- Frontend: ${stack.frontend.join(', ')}
- Backend: ${stack.backend}
- Database: ${stack.database}
- ORM: ${stack.orm}
- Auth: ${stack.auth}
- Addons: ${stack.addons.join(', ')}

Provide:
1. Key benefits of this combination
2. How these technologies work together
3. Best use cases
4. Potential challenges and solutions
5. Performance considerations

Keep the explanation concise and developer-friendly.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Explanation error:', error);
      return 'Unable to generate explanation at this time.';
    }
  }

  /**
   * Analyze project requirements using AI
   */
  async analyzeRequirements(description: string): Promise<ProjectRequirements> {
    const prompt = `
Analyze this project description and extract key requirements:
"${description}"

Return a structured analysis with:
1. Project type (e.g., e-commerce, SaaS, blog, API, mobile app)
2. Key features needed
3. Estimated scale (small/medium/large)
4. Recommended team size
5. Required expertise level
6. Deployment targets

Format the response as JSON.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return this.parseRequirementsText(text);
    } catch (error) {
      console.error('Analysis error:', error);
      return {
        projectType: 'web-app',
        description: description,
        scalability: 'medium',
      };
    }
  }

  /**
   * Get optimization suggestions for existing stack
   */
  async optimizeStack(currentStack: StackSuggestion): Promise<string[]> {
    const prompt = `
Analyze this technology stack and provide optimization suggestions:
- Frontend: ${currentStack.frontend.join(', ')}
- Backend: ${currentStack.backend}
- Database: ${currentStack.database}
- ORM: ${currentStack.orm}

Provide 5-7 specific, actionable optimization tips for:
1. Performance improvements
2. Developer experience
3. Scalability
4. Security
5. Cost optimization

Format as a bulleted list.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text.split('\n')
        .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'))
        .map(line => line.replace(/^[•\-]\s*/, '').trim());
    } catch (error) {
      console.error('Optimization error:', error);
      return ['Unable to generate optimizations at this time.'];
    }
  }

  /**
   * Build prompt for stack suggestions
   */
  private buildPrompt(requirements: ProjectRequirements): string {
    return `
As an expert full-stack developer, recommend the best technology stack for a project with these requirements:

Project Type: ${requirements.projectType}
Description: ${requirements.description}
Features: ${requirements.features?.join(', ') || 'Standard CRUD operations'}
Scale: ${requirements.scalability || 'medium'}
Team Size: ${requirements.teamSize || 'small team'}
Experience Level: ${requirements.experience || 'intermediate'}
Deployment: ${requirements.deployment?.join(', ') || 'cloud hosting'}
Budget: ${requirements.budget || 'medium'}

Available Options:
FRONTEND: react, vue, angular, svelte, nextjs, nuxt, react-native, none
BACKEND: express, fastify, nestjs, koa, hapi, none
DATABASE: sqlite, postgres, mysql, mongodb, none
ORM: prisma, sequelize, mongoose, typeorm, none
AUTH: jwt, passport, auth0, firebase, none
ADDONS: eslint, prettier, husky, docker, github-actions, testing

Provide recommendations in this exact JSON format:
{
  "frontend": ["framework1", "framework2"],
  "backend": "framework",
  "database": "database",
  "orm": "orm",
  "auth": "auth",
  "addons": ["addon1", "addon2"],
  "reasoning": "Brief explanation of why this stack is optimal",
  "alternatives": {
    "frontend": ["alt1"],
    "backend": ["alt1"],
    "database": ["alt1"]
  }
}

Consider:
1. Best practices for ${requirements.projectType}
2. Performance and scalability needs
3. Developer experience and learning curve
4. Community support and ecosystem
5. Deployment and maintenance ease
`;
  }

  /**
   * Parse AI response to extract stack suggestion
   */
  private parseResponse(text: string): StackSuggestion {
    try {
      // Try to extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          frontend: Array.isArray(parsed.frontend) ? parsed.frontend : [parsed.frontend],
          backend: parsed.backend || 'express',
          database: parsed.database || 'postgres',
          orm: parsed.orm || 'prisma',
          auth: parsed.auth || 'jwt',
          addons: parsed.addons || ['eslint', 'prettier'],
          reasoning: parsed.reasoning || 'Recommended based on project requirements',
          alternatives: parsed.alternatives,
        };
      }
    } catch (error) {
      console.error('Parse error:', error);
    }

    // Fallback parsing from text
    return this.parseTextResponse(text);
  }

  /**
   * Parse text response when JSON extraction fails
   */
  private parseTextResponse(text: string): StackSuggestion {
    const lines = text.toLowerCase().split('\n');
    
    const findValue = (keyword: string): string => {
      const line = lines.find(l => l.includes(keyword));
      if (line) {
        const match = line.match(/:\s*(\w+)/);
        if (match) return match[1];
      }
      return '';
    };

    return {
      frontend: [findValue('frontend') || 'react'],
      backend: findValue('backend') || 'express',
      database: findValue('database') || 'postgres',
      orm: findValue('orm') || 'prisma',
      auth: findValue('auth') || 'jwt',
      addons: ['eslint', 'prettier'],
      reasoning: 'AI-powered recommendation based on your requirements',
    };
  }

  /**
   * Parse requirements from text
   */
  private parseRequirementsText(text: string): ProjectRequirements {
    const lines = text.toLowerCase().split('\n');
    
    const findValue = (keyword: string): string => {
      const line = lines.find(l => l.includes(keyword));
      if (line) {
        const match = line.match(/:\s*(.+)/);
        if (match) return match[1].trim();
      }
      return '';
    };

    return {
      projectType: findValue('type') || 'web-app',
      description: findValue('description') || '',
      features: findValue('features')?.split(',').map(f => f.trim()),
      scalability: (findValue('scale') || 'medium') as any,
      teamSize: parseInt(findValue('team') || '1'),
      experience: (findValue('experience') || 'intermediate') as any,
    };
  }

  /**
   * Get fallback suggestion when AI fails
   */
  private getFallbackSuggestion(requirements: ProjectRequirements): StackSuggestion {
    // Smart defaults based on project type
    const suggestions: Record<string, StackSuggestion> = {
      'e-commerce': {
        frontend: ['nextjs'],
        backend: 'express',
        database: 'postgres',
        orm: 'prisma',
        auth: 'jwt',
        addons: ['eslint', 'prettier', 'testing', 'docker'],
        reasoning: 'Optimized for e-commerce with SSR, strong typing, and scalability',
      },
      'saas': {
        frontend: ['react'],
        backend: 'nestjs',
        database: 'postgres',
        orm: 'prisma',
        auth: 'auth0',
        addons: ['eslint', 'prettier', 'testing', 'docker', 'github-actions'],
        reasoning: 'Enterprise-ready stack with authentication and CI/CD',
      },
      'api': {
        frontend: ['none'],
        backend: 'fastify',
        database: 'postgres',
        orm: 'prisma',
        auth: 'jwt',
        addons: ['eslint', 'prettier', 'testing', 'docker'],
        reasoning: 'High-performance API with minimal overhead',
      },
      'mobile': {
        frontend: ['react-native'],
        backend: 'express',
        database: 'mongodb',
        orm: 'mongoose',
        auth: 'firebase',
        addons: ['eslint', 'prettier', 'testing'],
        reasoning: 'Mobile-first stack with real-time capabilities',
      },
    };

    return suggestions[requirements.projectType] || suggestions['saas'];
  }
}

// Export singleton instance
export const geminiService = new GeminiService();

// Export types
export type { GeminiService };
