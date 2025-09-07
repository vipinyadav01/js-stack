# 📚 Complete Usage Guide - JS Stack Builder

A comprehensive guide to using all features of the JS Stack Builder - from CLI to web app, deployment, and collaboration.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [CLI Usage](#1-cli-usage)
3. [Web App Visual Builder](#2-web-app-visual-builder)
4. [Advanced Stack Builder Logic](#3-advanced-stack-builder-logic)
5. [One-Command Deployment](#4-one-command-deployment)
6. [Team Collaboration](#5-team-collaboration)
7. [Analytics & Tracking](#6-analytics--tracking)
8. [Extending the Architecture](#7-extending-the-architecture)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start everything
npm run dev

# Or run individually
npm run dev:cli   # CLI only
npm run dev:web   # Web app only
```

---

## 1. CLI Usage

### 🎨 Beautiful Terminal UI Experience

The CLI features gradient text, animations, and modern styling for an exceptional developer experience.

#### Basic Commands

```bash
# Interactive mode with beautiful prompts
npx create-js-stack init my-app

# Quick setup with defaults
npx create-js-stack init my-app --yes

# With specific options
npx create-js-stack init my-app \
  --backend express \
  --frontend react \
  --database postgres \
  --orm prisma \
  --auth jwt \
  --addons eslint prettier docker
```

#### Visual Features

When you run the CLI, you'll see:

1. **ASCII Art Banner** with gradient colors
2. **Step-by-step progress** with visual indicators
3. **Color-coded prompts** with helpful hints
4. **Configuration table** showing your selections
5. **Success animations** when complete

#### Advanced CLI Options

```bash
# List all available options in a beautiful grid
npx create-js-stack list

# Add features to existing project
npx create-js-stack add --addons testing docker

# Open documentation
npx create-js-stack docs
```

### CLI Configuration Examples

#### E-commerce Project
```bash
npx create-js-stack init my-store \
  --backend express \
  --frontend nextjs \
  --database postgres \
  --orm prisma \
  --auth jwt \
  --addons redis docker stripe
```

#### SaaS Platform
```bash
npx create-js-stack init my-saas \
  --backend nestjs \
  --frontend react \
  --database postgres \
  --orm prisma \
  --auth auth0 \
  --addons docker github-actions testing
```

#### API-Only Project
```bash
npx create-js-stack init my-api \
  --backend fastify \
  --frontend none \
  --database mongodb \
  --orm mongoose \
  --auth jwt
```

---

## 2. Web App Visual Builder

### 🎯 Getting Started

```bash
# Navigate to web app
cd apps/web

# Copy environment file
cp .env.example .env.local

# Add your Gemini API key
# Edit .env.local and add:
# NEXT_PUBLIC_GEMINI_API_KEY=your_key_here

# Start the web app
npm run dev

# Open http://localhost:3000
```

### Visual Builder Features

#### 1. **Drag & Drop Interface**

```typescript
// The visual builder allows:
- Drag technologies from the palette
- Drop them into your stack
- Automatic compatibility checking
- Real-time validation
- Conflict resolution
```

#### 2. **AI Assistant (Powered by Gemini)**

Click the "AI Assistant" button and describe your project:

```
"I need an e-commerce platform with:
- Product catalog
- Shopping cart
- Payment processing
- Admin dashboard
- Real-time inventory"
```

The AI will recommend:
- Optimal tech stack
- Alternative options
- Performance tips
- Cost estimates

#### 3. **Live Code Preview**

Watch your project structure generate in real-time:

```
my-app/
├── backend/
│   ├── server.js       # Generated Express server
│   ├── routes/         # API routes
│   └── middleware/     # Auth & validation
├── frontend/
│   ├── src/
│   │   ├── App.jsx     # React app entry
│   │   └── components/ # UI components
│   └── public/
├── database/
│   ├── schema.prisma   # Database schema
│   └── migrations/     # Database migrations
└── docker-compose.yml  # Container config
```

#### 4. **Stack Templates**

Pre-configured stacks for common use cases:

- **E-commerce**: Next.js + Express + PostgreSQL + Stripe
- **SaaS**: React + NestJS + PostgreSQL + Auth0
- **Blog**: Gatsby + Strapi + MongoDB
- **API**: Fastify + PostgreSQL + Redis
- **Mobile**: React Native + Express + MongoDB

---

## 3. Advanced Stack Builder Logic

### 🧠 Intelligent Stack Resolution

Our builder uses advanced logic different from better-t-stack:

#### Compatibility Matrix

```javascript
// Our system automatically handles:
const compatibilityRules = {
  // Frontend-Backend compatibility
  'nextjs': ['express', 'fastify', 'nestjs'],
  'nuxt': ['express', 'fastify'],
  'react-native': ['express', 'nestjs', 'fastify'],
  
  // Database-ORM compatibility
  'postgres': ['prisma', 'sequelize', 'typeorm'],
  'mongodb': ['mongoose', 'prisma'],
  'mysql': ['prisma', 'sequelize', 'typeorm'],
  
  // Auth compatibility
  'auth0': ['all-backends'],
  'firebase': ['all-frontends'],
  'jwt': ['express', 'fastify', 'nestjs']
};
```

#### Optimization Algorithm

```typescript
// Stack optimization based on:
interface OptimizationFactors {
  performance: number;      // Speed requirements
  scalability: number;      // Expected growth
  complexity: number;       // Team expertise
  cost: number;            // Budget constraints
  timeToMarket: number;    // Deadline pressure
}

// Scoring system
function calculateStackScore(stack: Stack, factors: OptimizationFactors) {
  let score = 0;
  
  // Performance scoring
  if (stack.backend === 'fastify') score += factors.performance * 10;
  if (stack.database === 'redis') score += factors.performance * 8;
  
  // Scalability scoring
  if (stack.backend === 'nestjs') score += factors.scalability * 9;
  if (stack.database === 'postgres') score += factors.scalability * 8;
  
  // Complexity scoring
  if (stack.frontend === 'react') score += (10 - factors.complexity) * 7;
  if (stack.orm === 'prisma') score += (10 - factors.complexity) * 8;
  
  return score;
}
```

#### Conflict Resolution

```javascript
// Automatic conflict resolution
const conflictResolver = {
  resolve(stack) {
    // MongoDB can't use Sequelize
    if (stack.database === 'mongodb' && stack.orm === 'sequelize') {
      stack.orm = 'mongoose'; // Auto-fix
    }
    
    // Next.js API routes conflict with separate backend
    if (stack.frontend === 'nextjs' && stack.backend !== 'none') {
      // Suggest using Next.js API routes instead
      stack.backend = 'next-api';
    }
    
    return stack;
  }
};
```

---

## 4. One-Command Deployment

### 🚀 Deploy Anywhere

#### Deploy to Vercel

```bash
# Configure Vercel
npm run deploy:vercel

# This will:
# 1. Build the project
# 2. Optimize for production
# 3. Deploy to Vercel
# 4. Set up environment variables
# 5. Configure domains
```

#### Deploy to Netlify

```bash
# Configure Netlify
npm run deploy:netlify

# Automatic:
# - Build optimization
# - Function deployment
# - Form handling
# - Split testing
```

#### Deploy to Railway

```bash
# Configure Railway
npm run deploy:railway

# Includes:
# - Database provisioning
# - Redis setup
# - Environment sync
# - Auto-scaling
```

#### Deploy to AWS

```bash
# Configure AWS
npm run deploy:aws

# Sets up:
# - EC2/ECS deployment
# - RDS database
# - S3 storage
# - CloudFront CDN
```

### Deployment Configuration

Create `deploy.config.js`:

```javascript
module.exports = {
  vercel: {
    projectName: 'my-app',
    env: ['DATABASE_URL', 'API_KEY'],
    regions: ['iad1'],
    functions: {
      'api/*': { maxDuration: 10 }
    }
  },
  netlify: {
    site: 'my-app',
    functions: './netlify/functions',
    redirects: [
      { from: '/api/*', to: '/.netlify/functions/:splat' }
    ]
  },
  railway: {
    services: ['web', 'api', 'database'],
    environment: 'production',
    healthCheck: '/api/health'
  }
};
```

---

## 5. Team Collaboration

### 👥 Workspace Features

#### Create a Workspace

```bash
# Initialize workspace
npm run workspace:init

# This creates:
# - Shared configuration
# - Team settings
# - Access controls
# - Collaboration tools
```

#### Share Configurations

```javascript
// Share your stack via URL
const shareUrl = 'https://js-stack.dev/share/abc123';

// Team members can:
// 1. View the stack
// 2. Clone it
// 3. Suggest changes
// 4. Leave comments
```

#### Real-time Collaboration

```typescript
// WebSocket-based collaboration
import { io } from 'socket.io-client';

const socket = io('wss://js-stack.dev');

// Join workspace
socket.emit('join-workspace', { workspaceId: 'abc123' });

// Listen for changes
socket.on('stack-updated', (update) => {
  console.log('Stack updated by:', update.user);
  applyChanges(update.changes);
});

// Broadcast changes
socket.emit('update-stack', {
  changes: stackDiff,
  user: currentUser
});
```

#### Version Control

```bash
# Save stack version
npm run stack:save --name "v1.0"

# List versions
npm run stack:list

# Restore version
npm run stack:restore --version "v1.0"
```

---

## 6. Analytics & Tracking

### 📊 Dashboard Features

#### Usage Analytics

```typescript
// Track stack generation
analytics.track('stack-created', {
  frontend: ['react'],
  backend: 'express',
  database: 'postgres',
  timestamp: Date.now()
});

// View analytics at: http://localhost:3000/analytics
```

#### Popular Stacks

```sql
-- Most used combinations
SELECT 
  frontend,
  backend,
  database,
  COUNT(*) as usage_count
FROM stacks
GROUP BY frontend, backend, database
ORDER BY usage_count DESC
LIMIT 10;
```

#### Performance Metrics

```javascript
// Track build times
const metrics = {
  scaffoldTime: 1.2,    // seconds
  installTime: 45.3,    // seconds
  buildTime: 12.7,      // seconds
  totalTime: 59.2,      // seconds
  filesCreated: 127,
  dependencies: 45
};

// Display in dashboard
<MetricsCard metrics={metrics} />
```

#### Success Tracking

```typescript
interface ProjectSuccess {
  id: string;
  stack: Stack;
  createdAt: Date;
  lastCommit: Date;
  commits: number;
  contributors: number;
  stars: number;
  issues: number;
  pullRequests: number;
}

// Calculate success score
function calculateSuccess(project: ProjectSuccess): number {
  const daysSinceCreation = (Date.now() - project.createdAt) / (1000 * 60 * 60 * 24);
  const activityScore = project.commits / daysSinceCreation;
  const popularityScore = project.stars + (project.contributors * 5);
  
  return (activityScore * 0.5) + (popularityScore * 0.5);
}
```

---

## 7. Extending the Architecture

### 🔧 Adding New Technologies

#### Add a New Frontend Framework

```typescript
// 1. Update types
// src/types.js
export const FRONTEND_OPTIONS = {
  // ...existing
  SOLIDJS: 'solidjs',  // Add new option
};

// 2. Create generator
// src/generators/frontend/solidjs.js
export async function generateSolidJS(config) {
  const template = `
    import { render } from 'solid-js/web';
    import App from './App';
    
    render(() => <App />, document.getElementById('root'));
  `;
  
  await writeFile('src/index.jsx', template);
}

// 3. Add to prompt
// src/prompts-modern.js
{ 
  value: FRONTEND_OPTIONS.SOLIDJS, 
  label: '⚡ SolidJS',
  hint: 'Fine-grained reactivity'
}
```

#### Add a New Database

```typescript
// 1. Update types
export const DATABASE_OPTIONS = {
  // ...existing
  CASSANDRA: 'cassandra',
};

// 2. Create connection config
// src/generators/database/cassandra.js
export function generateCassandraConfig() {
  return `
    const cassandra = require('cassandra-driver');
    
    const client = new cassandra.Client({
      contactPoints: ['127.0.0.1'],
      localDataCenter: 'datacenter1',
      keyspace: '${config.projectName}'
    });
    
    module.exports = client;
  `;
}
```

#### Add Custom Addons

```typescript
// Create addon generator
// src/generators/addons/custom-monitoring.js
export async function addMonitoring(config) {
  // Add dependencies
  await addPackages(config.projectDir, [
    '@opentelemetry/api',
    '@opentelemetry/sdk-node',
    'prom-client'
  ]);
  
  // Create monitoring setup
  const monitoringCode = `
    const { MeterProvider } = require('@opentelemetry/sdk-metrics');
    const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');
    
    const exporter = new PrometheusExporter({ port: 9090 });
    const meterProvider = new MeterProvider({ exporter });
  `;
  
  await writeFile('src/monitoring.js', monitoringCode);
}
```

### Plugin System

```typescript
// Create a plugin
// plugins/my-plugin.js
export default {
  name: 'my-custom-plugin',
  version: '1.0.0',
  
  // Hook into generation process
  hooks: {
    'before:create': async (config) => {
      console.log('Starting project creation...');
    },
    
    'after:backend': async (config) => {
      // Modify backend after generation
    },
    
    'after:create': async (config) => {
      console.log('Project created successfully!');
    }
  },
  
  // Add custom commands
  commands: {
    'custom:deploy': async (args) => {
      console.log('Custom deployment logic');
    }
  }
};
```

### Custom Templates

```javascript
// templates/custom-stack.json
{
  "name": "microservices",
  "description": "Microservices architecture",
  "stack": {
    "frontend": ["react"],
    "backend": "nestjs",
    "database": "postgres",
    "orm": "prisma",
    "auth": "jwt",
    "addons": [
      "docker",
      "kubernetes",
      "redis",
      "rabbitmq",
      "elasticsearch"
    ]
  },
  "structure": {
    "services/": {
      "auth/": {},
      "users/": {},
      "products/": {},
      "orders/": {}
    },
    "gateway/": {},
    "shared/": {}
  }
}
```

---

## 📈 Performance Tips

### Optimization Strategies

1. **Use Turbo Cache**
   ```bash
   # Enable remote caching
   npx turbo login
   npx turbo link
   ```

2. **Parallel Execution**
   ```bash
   # Run tasks in parallel
   npm run build --parallel
   ```

3. **Incremental Builds**
   ```javascript
   // turbo.json
   {
     "pipeline": {
       "build": {
         "outputs": ["dist/**"],
         "cache": true
       }
     }
   }
   ```

4. **Code Splitting**
   ```javascript
   // Dynamic imports for better performance
   const Component = lazy(() => import('./Component'));
   ```

---

## 🐛 Troubleshooting

### Common Issues

#### Issue: "Gemini API key not working"
```bash
# Solution:
1. Check .env.local file
2. Ensure key starts with "AI..."
3. Restart dev server
4. Check API quota at https://makersuite.google.com
```

#### Issue: "Port already in use"
```bash
# Solution:
# Kill the process
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

#### Issue: "Dependencies not installing"
```bash
# Solution:
# Clear cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules

# Reinstall
npm install
```

---

## 🎯 Best Practices

1. **Always use environment variables for sensitive data**
2. **Run tests before deployment**
3. **Use the visual builder for complex stacks**
4. **Leverage AI suggestions for optimization**
5. **Keep dependencies updated**
6. **Use workspace for team projects**
7. **Monitor analytics for insights**
8. **Extend with plugins for custom needs**

---

## 📚 Additional Resources

- [API Documentation](./docs/api.md)
- [Plugin Development](./docs/plugins.md)
- [Template Creation](./docs/templates.md)
- [Deployment Guide](./docs/deployment.md)
- [Video Tutorials](https://youtube.com/js-stack)
- [Discord Community](https://discord.gg/js-stack)

---

## 🤝 Support

Need help? 
- 📧 Email: vipinxdev@gmail.com
- 💬 Discord: https://discord.gg/js-stack
- 🐛 Issues: https://github.com/yourusername/create-js-stack-cli/issues
- 📖 Docs: https://js-stack.dev/docs

---

Built with ❤️ by the Vipin Yadav
