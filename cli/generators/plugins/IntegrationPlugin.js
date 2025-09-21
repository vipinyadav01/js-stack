import fs from "fs-extra";
import path from "path";
import { GeneratorPlugin, HOOK_TYPES } from "../core/GeneratorPlugin.js";

export class IntegrationPlugin extends GeneratorPlugin {
  constructor() {
    super("IntegrationPlugin", "1.0.0");
    this.priority = 25; // After FilePlugin creates structure/templates
    this.dependencies = [];
    this.registerHook(HOOK_TYPES.GENERATE_FILES, this.generateIntegrations);
  }

  canHandle(config) {
    return true;
  }

  async generateIntegrations(context) {
    const config = context.config || context;
    const projectDir = context.projectDir;

    // Only act when backend is selected
    if (!config.backend || config.backend === "none") return context;

    const backendDir = path.join(projectDir, "backend");
    await fs.ensureDir(backendDir);

    // Create .env.example with minimal variables
    await this.ensureEnvExample(backendDir, config);
    // Create .env (runtime) if not present to enable immediate run
    await this.ensureEnvRuntime(backendDir, config);

    // For Express backend, synthesize a minimal server.js if missing
    if (config.backend === "express") {
      const serverPath = path.join(backendDir, "server.js");
      if (!(await this.exists(serverPath))) {
        const content = this.composeExpressServer(config);
        await fs.writeFile(serverPath, content);
      }
    }

    return context;
  }

  async ensureEnvExample(backendDir, config) {
    const envPath = path.join(backendDir, ".env.example");
    if (await this.exists(envPath)) return;
    const lines = [];
    lines.push("PORT=3001");
    if (config.database === "mongodb" || config.orm === "mongoose") {
      lines.push("MONGODB_URI=mongodb://localhost:27017/myapp");
    }
    if (config.auth === "jwt") {
      lines.push("JWT_SECRET=change_this_secret");
    }
    await fs.writeFile(envPath, lines.join("\n") + "\n");
  }

  async ensureEnvRuntime(backendDir, config) {
    const envRuntime = path.join(backendDir, ".env");
    if (await this.exists(envRuntime)) return;
    const example = path.join(backendDir, ".env.example");
    if (await this.exists(example)) {
      await fs.copy(example, envRuntime);
    }
  }

  composeExpressServer(config) {
    const wantMongo = config.database === "mongodb" || config.orm === "mongoose";
    const wantJwt = config.auth === "jwt";

    return `// Auto-generated minimal Express server with basic integrations
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 3001;

${wantMongo ? `// Database connection (MongoDB via Mongoose)
const mongoose = require('mongoose');
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp';
mongoose.connect(mongoUri).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
});

// Example model
const ItemSchema = new mongoose.Schema({ name: String }, { timestamps: true });
const Item = mongoose.model('Item', ItemSchema);
` : ''}

${wantJwt ? `// JWT middleware (minimal)
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.post('/auth/login', (req, res) => {
  // demo only: accept any user
  const user = { id: 'demo', name: 'Demo User' };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user });
});
` : ''}

// Health endpoint
app.get('/health', async (req, res) => {
  const status = { ok: true };
  ${wantMongo ? `try {
    await mongoose.connection.db.admin().ping();
    status.mongo = 'up';
  } catch {
    status.mongo = 'down';
  }` : ''}
  res.json(status);
});

${wantMongo ? `// Example CRUD route${wantJwt ? ' (protected)' : ''}
${wantJwt ? 'app.use(authenticate);' : ''}
app.get('/items', async (req, res) => {
  const items = await Item.find().lean();
  res.json(items);
});
` : ''}

app.listen(PORT, () => {
  console.log('🚀 Server listening on http://localhost:' + PORT);
});
`;
  }

  async exists(filePath) {
    try { const s = await fs.stat(filePath); return s.isFile(); } catch { return false; }
  }

  // Standard execute entry point for plugin manager
  async execute(config, context) {
    try {
      await this.generateIntegrations({ ...context, config });
      return { success: true, message: "Integrations wired successfully" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default IntegrationPlugin;


