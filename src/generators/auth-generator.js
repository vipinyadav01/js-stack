import path from "path";
import {
  ensureDir,
  writeJson,
  writeFile,
  mergePackageJson,
  copyTemplates,
  getTemplateDir,
} from "../utils/file-utils.js";
import { AUTH_OPTIONS } from "../types.js";

/**
 * Generate authentication setup
 */
export async function generateAuth(config) {
  if (config.auth === AUTH_OPTIONS.NONE) return;

  const authDir = path.join(config.projectDir, "auth");
  await ensureDir(authDir);

  const templateDir = getTemplateDir();

  const context = {
    projectName: config.projectName,
    backend: {
      [config.backend]: config.backend !== "none",
    },
    database: {
      [config.database]: config.database !== "none",
    },
    orm: {
      [config.orm]: config.orm !== "none",
    },
    auth: {
      [config.auth]: true,
    },
    typescript: config.typescript || false,
    useTypeScript: config.typescript || false,
    oauth: config.auth === "oauth" || config.addons?.includes("oauth") || false,
  };

  try {
    const authTemplateDir = path.join(templateDir, "auth", config.auth);
    await copyTemplates(authTemplateDir, authDir, context);
  } catch (error) {
    console.warn(
      `Warning: Could not find templates for ${config.auth} auth. Using fallback generation.`,
    );
    await generateFallbackAuth(config, authDir);
  }
}

async function generateFallbackAuth(config, authDir) {
  // Basic JWT auth fallback
  const authContent = `const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '24h';

// Generate JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: TOKEN_EXPIRY });
}

// Verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}

// Hash password
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

// Compare password
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Authentication middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  req.userId = decoded.userId;
  next();
}

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  authMiddleware
};
`;

  await writeFile(path.join(authDir, "auth.js"), authContent);

  await mergePackageJson(path.join(config.projectDir, "package.json"), {
    dependencies: {
      jsonwebtoken: "^9.0.2",
      bcrypt: "^5.1.1",
    },
  });
}

export default generateAuth;
