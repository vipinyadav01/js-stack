// Advanced Stack Logic - Different from better-t-stack
// This implements unique optimization algorithms and compatibility checks

interface Technology {
  id: string;
  name: string;
  category: string;
  npmPackage?: string;
  githubRepo?: string;
  performance: number; // 0-100
  scalability: number; // 0-100
  learningCurve: number; // 0-100 (lower is easier)
  popularity: number; // 0-100
  maturity: number; // 0-100
  communitySupport: number; // 0-100
  enterpriseReady: boolean;
  cloudNative: boolean;
  serverless: boolean;
}

interface StackItem extends Technology {
  version?: string;
  downloads?: number;
  stars?: number;
}

interface StackConfig {
  id: string;
  name: string;
  items: StackItem[];
  score: number;
  compatibility: number;
  performance: number;
  popularity: number;
}

interface OptimizationOptions {
  performance?: boolean;
  scalability?: boolean;
  costEfficiency?: boolean;
  developerExperience?: boolean;
  timeToMarket?: boolean;
  security?: boolean;
  maintainability?: boolean;
}

// Compatibility matrix - more comprehensive than better-t-stack
const COMPATIBILITY_MATRIX: Record<string, Record<string, number>> = {
  // Frontend frameworks
  'react': {
    'nextjs': 100,
    'gatsby': 95,
    'remix': 90,
    'express': 85,
    'fastify': 85,
    'nestjs': 90,
    'graphql': 95,
    'rest': 90,
    'postgres': 85,
    'mongodb': 85,
    'redis': 90,
    'tailwind': 95,
    'mui': 90,
    'chakra': 90,
  },
  'vue': {
    'nuxt': 100,
    'vite': 95,
    'express': 85,
    'fastify': 85,
    'nestjs': 85,
    'graphql': 90,
    'rest': 90,
    'postgres': 85,
    'mongodb': 85,
    'vuetify': 95,
    'quasar': 90,
  },
  'angular': {
    'universal': 100,
    'nestjs': 95,
    'express': 80,
    'graphql': 85,
    'rest': 90,
    'postgres': 85,
    'mongodb': 80,
    'material': 95,
  },
  'svelte': {
    'sveltekit': 100,
    'vite': 95,
    'express': 85,
    'fastify': 90,
    'postgres': 85,
    'mongodb': 85,
  },
  
  // Backend frameworks
  'express': {
    'postgres': 90,
    'mongodb': 90,
    'mysql': 90,
    'redis': 95,
    'prisma': 90,
    'sequelize': 85,
    'typeorm': 85,
    'mongoose': 90,
    'jwt': 95,
    'passport': 95,
    'auth0': 90,
  },
  'fastify': {
    'postgres': 90,
    'mongodb': 85,
    'mysql': 90,
    'redis': 95,
    'prisma': 95,
    'typeorm': 85,
    'jwt': 95,
    'auth0': 90,
  },
  'nestjs': {
    'postgres': 95,
    'mongodb': 90,
    'mysql': 95,
    'redis': 95,
    'prisma': 95,
    'typeorm': 100,
    'mongoose': 90,
    'jwt': 95,
    'passport': 100,
    'auth0': 90,
    'graphql': 100,
  },
  
  // Databases
  'postgres': {
    'prisma': 95,
    'sequelize': 90,
    'typeorm': 90,
    'knex': 85,
    'redis': 90, // for caching
  },
  'mongodb': {
    'mongoose': 95,
    'prisma': 85,
    'redis': 90, // for caching
  },
  'mysql': {
    'prisma': 95,
    'sequelize': 90,
    'typeorm': 90,
    'knex': 85,
    'redis': 90,
  },
};

// Conflict matrix - technologies that don't work well together
const CONFLICT_MATRIX: Record<string, string[]> = {
  'nextjs': ['gatsby', 'nuxt', 'sveltekit'], // Can't use multiple meta-frameworks
  'gatsby': ['nextjs', 'nuxt', 'sveltekit'],
  'nuxt': ['nextjs', 'gatsby', 'sveltekit'],
  'sveltekit': ['nextjs', 'gatsby', 'nuxt'],
  'mongoose': ['sequelize', 'typeorm', 'knex'], // Can't use multiple ORMs
  'sequelize': ['mongoose', 'typeorm', 'prisma', 'knex'],
  'typeorm': ['mongoose', 'sequelize', 'prisma', 'knex'],
  'prisma': ['mongoose', 'sequelize', 'typeorm', 'knex'],
  'mui': ['chakra', 'antd', 'vuetify'], // UI library conflicts
  'chakra': ['mui', 'antd', 'vuetify'],
  'tailwind': [], // Tailwind works with everything
};

// Performance impact matrix
const PERFORMANCE_IMPACT: Record<string, number> = {
  // Positive impact
  'fastify': 15,
  'svelte': 12,
  'sveltekit': 12,
  'vite': 10,
  'redis': 15,
  'postgres': 8,
  'prisma': 5,
  'bun': 20,
  'esbuild': 10,
  
  // Neutral
  'react': 0,
  'vue': 0,
  'express': 0,
  'mongodb': 0,
  
  // Negative impact (but may be worth it for features)
  'angular': -5,
  'webpack': -5,
  'sequelize': -3,
};

// Validate compatibility between technologies
export function validateCompatibility(
  currentStack: StackItem[],
  newItem: StackItem
): boolean {
  // Check for direct conflicts
  const conflicts = CONFLICT_MATRIX[newItem.id] || [];
  const hasConflict = currentStack.some(item => 
    conflicts.includes(item.id) || 
    (CONFLICT_MATRIX[item.id] || []).includes(newItem.id)
  );
  
  if (hasConflict) {
    return false;
  }
  
  // Check category conflicts (e.g., can't have two databases)
  const singletonCategories = ['database', 'orm', 'auth'];
  if (singletonCategories.includes(newItem.category)) {
    const hasSameCategory = currentStack.some(
      item => item.category === newItem.category
    );
    if (hasSameCategory) {
      return false;
    }
  }
  
  // Calculate compatibility score
  let totalCompatibility = 0;
  let count = 0;
  
  currentStack.forEach(item => {
    const compatibility = 
      COMPATIBILITY_MATRIX[item.id]?.[newItem.id] ||
      COMPATIBILITY_MATRIX[newItem.id]?.[item.id] ||
      70; // Default compatibility
    
    totalCompatibility += compatibility;
    count++;
  });
  
  const avgCompatibility = count > 0 ? totalCompatibility / count : 100;
  
  // Require at least 60% compatibility
  return avgCompatibility >= 60;
}

// Advanced stack optimization algorithm
export async function optimizeStack(
  stack: StackConfig,
  options: OptimizationOptions = {}
): Promise<StackConfig> {
  const optimized = { ...stack };
  const items = [...stack.items];
  
  // Calculate optimization weights
  const weights = {
    performance: options.performance ? 0.25 : 0.1,
    scalability: options.scalability ? 0.25 : 0.1,
    cost: options.costEfficiency ? 0.2 : 0.1,
    dx: options.developerExperience ? 0.2 : 0.1,
    ttm: options.timeToMarket ? 0.15 : 0.1,
    security: options.security ? 0.15 : 0.1,
    maintainability: options.maintainability ? 0.15 : 0.1,
  };
  
  // Normalize weights
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  Object.keys(weights).forEach(key => {
    weights[key as keyof typeof weights] /= totalWeight;
  });
  
  // Score each technology
  const scores = items.map(item => {
    let score = 0;
    
    // Performance score
    score += weights.performance * (item.performance / 100);
    score += weights.performance * ((PERFORMANCE_IMPACT[item.id] || 0) / 100);
    
    // Scalability score
    score += weights.scalability * (item.scalability / 100);
    if (item.cloudNative) score += weights.scalability * 0.1;
    if (item.serverless) score += weights.scalability * 0.1;
    
    // Cost efficiency
    const costScore = item.enterpriseReady ? 0.6 : 0.9; // OSS is cheaper
    score += weights.cost * costScore;
    
    // Developer experience
    const dxScore = (100 - item.learningCurve) / 100;
    score += weights.dx * dxScore;
    score += weights.dx * (item.communitySupport / 100) * 0.5;
    
    // Time to market
    const ttmScore = (item.maturity / 100) * 0.7 + (item.popularity / 100) * 0.3;
    score += weights.ttm * ttmScore;
    
    // Security (higher for mature, enterprise-ready tools)
    const securityScore = (item.maturity / 100) * 0.6 + (item.enterpriseReady ? 0.4 : 0.2);
    score += weights.security * securityScore;
    
    // Maintainability
    const maintScore = (item.maturity / 100) * 0.5 + (item.communitySupport / 100) * 0.5;
    score += weights.maintainability * maintScore;
    
    return { item, score };
  });
  
  // Sort by score and suggest optimizations
  scores.sort((a, b) => b.score - a.score);
  
  // Calculate stack-wide metrics
  const avgPerformance = items.reduce((sum, item) => {
    const impact = PERFORMANCE_IMPACT[item.id] || 0;
    return sum + item.performance + impact;
  }, 0) / items.length;
  
  const avgPopularity = items.reduce((sum, item) => 
    sum + item.popularity, 0
  ) / items.length;
  
  const compatibility = calculateStackCompatibility(items);
  
  optimized.items = scores.map(s => s.item);
  optimized.score = Math.round(
    scores.reduce((sum, s) => sum + s.score, 0) / scores.length * 100
  );
  optimized.performance = Math.min(100, Math.round(avgPerformance));
  optimized.popularity = Math.round(avgPopularity);
  optimized.compatibility = compatibility;
  
  return optimized;
}

// Calculate overall stack compatibility
function calculateStackCompatibility(items: StackItem[]): number {
  if (items.length <= 1) return 100;
  
  let totalCompatibility = 0;
  let pairs = 0;
  
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const compatibility = 
        COMPATIBILITY_MATRIX[items[i].id]?.[items[j].id] ||
        COMPATIBILITY_MATRIX[items[j].id]?.[items[i].id] ||
        70; // Default compatibility
      
      totalCompatibility += compatibility;
      pairs++;
    }
  }
  
  return Math.round(totalCompatibility / pairs);
}

// AI-powered stack recommendations
export async function getAIRecommendations(
  requirements: string,
  currentStack?: StackItem[]
): Promise<{
  recommended: StackItem[];
  reasoning: string;
  alternatives: StackItem[][];
}> {
  // This would integrate with Gemini/OpenAI API
  // For now, return rule-based recommendations
  
  const keywords = requirements.toLowerCase();
  const recommended: StackItem[] = [];
  let reasoning = '';
  
  // Analyze requirements
  const isEcommerce = keywords.includes('ecommerce') || keywords.includes('shop');
  const isSaaS = keywords.includes('saas') || keywords.includes('subscription');
  const isRealtime = keywords.includes('realtime') || keywords.includes('real-time');
  const isMobile = keywords.includes('mobile') || keywords.includes('app');
  const isEnterprise = keywords.includes('enterprise') || keywords.includes('corporate');
  const needsAuth = keywords.includes('auth') || keywords.includes('login');
  const needsPayments = keywords.includes('payment') || keywords.includes('stripe');
  
  // Build recommendations based on requirements
  if (isEcommerce) {
    recommended.push(
      createTech('nextjs', 'frontend'),
      createTech('express', 'backend'),
      createTech('postgres', 'database'),
      createTech('prisma', 'orm'),
      createTech('stripe', 'payment'),
      createTech('redis', 'cache')
    );
    reasoning = 'For e-commerce, Next.js provides SSR for SEO, PostgreSQL for reliable transactions, and Stripe for payments.';
  } else if (isSaaS) {
    recommended.push(
      createTech('react', 'frontend'),
      createTech('nestjs', 'backend'),
      createTech('postgres', 'database'),
      createTech('prisma', 'orm'),
      createTech('auth0', 'auth'),
      createTech('redis', 'cache')
    );
    reasoning = 'SaaS platforms benefit from NestJS\'s enterprise architecture, Auth0 for secure authentication, and PostgreSQL for data integrity.';
  } else if (isRealtime) {
    recommended.push(
      createTech('react', 'frontend'),
      createTech('fastify', 'backend'),
      createTech('mongodb', 'database'),
      createTech('socketio', 'realtime'),
      createTech('redis', 'pubsub')
    );
    reasoning = 'Real-time applications need WebSocket support (Socket.io), fast backend (Fastify), and Redis for pub/sub messaging.';
  }
  
  // Generate alternatives
  const alternatives: StackItem[][] = [];
  
  if (recommended.length > 0) {
    // Alternative 1: More performant
    const performant = recommended.map(item => {
      if (item.id === 'react') return createTech('svelte', 'frontend');
      if (item.id === 'express') return createTech('fastify', 'backend');
      return item;
    });
    alternatives.push(performant);
    
    // Alternative 2: Easier to learn
    const easier = recommended.map(item => {
      if (item.id === 'nestjs') return createTech('express', 'backend');
      if (item.id === 'prisma') return createTech('mongoose', 'orm');
      return item;
    });
    alternatives.push(easier);
  }
  
  return {
    recommended,
    reasoning,
    alternatives,
  };
}

// Helper function to create technology objects
function createTech(id: string, category: string): StackItem {
  const techData: Record<string, Partial<StackItem>> = {
    // Frontend
    'react': {
      name: 'React',
      npmPackage: 'react',
      githubRepo: 'facebook/react',
      performance: 85,
      scalability: 90,
      learningCurve: 60,
      popularity: 95,
      maturity: 90,
      communitySupport: 95,
    },
    'nextjs': {
      name: 'Next.js',
      npmPackage: 'next',
      githubRepo: 'vercel/next.js',
      performance: 90,
      scalability: 95,
      learningCurve: 70,
      popularity: 90,
      maturity: 85,
      communitySupport: 90,
    },
    'svelte': {
      name: 'Svelte',
      npmPackage: 'svelte',
      githubRepo: 'sveltejs/svelte',
      performance: 95,
      scalability: 85,
      learningCurve: 50,
      popularity: 75,
      maturity: 75,
      communitySupport: 80,
    },
    
    // Backend
    'express': {
      name: 'Express',
      npmPackage: 'express',
      githubRepo: 'expressjs/express',
      performance: 80,
      scalability: 85,
      learningCurve: 30,
      popularity: 95,
      maturity: 95,
      communitySupport: 95,
    },
    'fastify': {
      name: 'Fastify',
      npmPackage: 'fastify',
      githubRepo: 'fastify/fastify',
      performance: 95,
      scalability: 90,
      learningCurve: 50,
      popularity: 70,
      maturity: 80,
      communitySupport: 85,
    },
    'nestjs': {
      name: 'NestJS',
      npmPackage: '@nestjs/core',
      githubRepo: 'nestjs/nest',
      performance: 85,
      scalability: 95,
      learningCurve: 75,
      popularity: 80,
      maturity: 85,
      communitySupport: 85,
      enterpriseReady: true,
    },
    
    // Database
    'postgres': {
      name: 'PostgreSQL',
      performance: 90,
      scalability: 95,
      learningCurve: 60,
      popularity: 90,
      maturity: 95,
      communitySupport: 90,
      enterpriseReady: true,
    },
    'mongodb': {
      name: 'MongoDB',
      performance: 85,
      scalability: 90,
      learningCurve: 40,
      popularity: 85,
      maturity: 85,
      communitySupport: 85,
    },
    'redis': {
      name: 'Redis',
      npmPackage: 'redis',
      performance: 95,
      scalability: 90,
      learningCurve: 50,
      popularity: 85,
      maturity: 90,
      communitySupport: 85,
    },
    
    // ORM
    'prisma': {
      name: 'Prisma',
      npmPackage: 'prisma',
      githubRepo: 'prisma/prisma',
      performance: 85,
      scalability: 90,
      learningCurve: 40,
      popularity: 80,
      maturity: 75,
      communitySupport: 85,
    },
    'mongoose': {
      name: 'Mongoose',
      npmPackage: 'mongoose',
      githubRepo: 'Automattic/mongoose',
      performance: 80,
      scalability: 85,
      learningCurve: 50,
      popularity: 85,
      maturity: 90,
      communitySupport: 85,
    },
    
    // Auth
    'auth0': {
      name: 'Auth0',
      performance: 85,
      scalability: 95,
      learningCurve: 40,
      popularity: 80,
      maturity: 90,
      communitySupport: 85,
      enterpriseReady: true,
    },
    
    // Other
    'stripe': {
      name: 'Stripe',
      npmPackage: 'stripe',
      performance: 90,
      scalability: 95,
      learningCurve: 50,
      popularity: 90,
      maturity: 95,
      communitySupport: 90,
      enterpriseReady: true,
    },
    'socketio': {
      name: 'Socket.io',
      npmPackage: 'socket.io',
      githubRepo: 'socketio/socket.io',
      performance: 85,
      scalability: 80,
      learningCurve: 50,
      popularity: 85,
      maturity: 90,
      communitySupport: 85,
    },
  };
  
  return {
    id,
    category,
    name: techData[id]?.name || id,
    icon: '📦',
    color: '#3B82F6',
    ...techData[id],
  } as StackItem;
}

// Export types
export type { Technology, StackItem, StackConfig, OptimizationOptions };
