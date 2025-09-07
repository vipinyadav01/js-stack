import path from 'path';
import { ensureDir, writeJson, mergePackageJson } from '../utils/file-utils.js';
import { AUTH_OPTIONS } from '../types.js';

/**
 * Generate authentication setup
 */
export async function generateAuth(config) {
  if (config.auth === AUTH_OPTIONS.NONE) return;
  
  const authDir = path.join(config.projectDir, 'auth');
  await ensureDir(authDir);
  
  switch (config.auth) {
    case AUTH_OPTIONS.JWT:
      await generateJWTAuth(config, authDir);
      break;
    case AUTH_OPTIONS.PASSPORT:
      await generatePassportAuth(config, authDir);
      break;
    case AUTH_OPTIONS.AUTH0:
      await generateAuth0(config, authDir);
      break;
    case AUTH_OPTIONS.FIREBASE:
      await generateFirebaseAuth(config, authDir);
      break;
  }
}

async function generateJWTAuth(config, authDir) {
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

  await writeJson(path.join(authDir, 'jwt.js'), authContent, { spaces: 0 });
  
  await mergePackageJson(path.join(config.projectDir, 'package.json'), {
    dependencies: {
      'jsonwebtoken': '^9.0.2',
      'bcrypt': '^5.1.1'
    }
  });
}

async function generatePassportAuth(config, authDir) {
  // Stub for Passport
  await mergePackageJson(path.join(config.projectDir, 'package.json'), {
    dependencies: {
      'passport': '^0.7.0',
      'passport-local': '^1.0.0',
      'passport-jwt': '^4.0.1'
    }
  });
}

async function generateAuth0(config, authDir) {
  // Stub for Auth0
  await mergePackageJson(path.join(config.projectDir, 'package.json'), {
    dependencies: {
      'auth0': '^4.3.0'
    }
  });
}

async function generateFirebaseAuth(config, authDir) {
  // Stub for Firebase
  await mergePackageJson(path.join(config.projectDir, 'package.json'), {
    dependencies: {
      'firebase': '^10.7.1',
      'firebase-admin': '^12.0.0'
    }
  });
}

export default { generateAuth };
