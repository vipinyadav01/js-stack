import path from 'path';
import { ensureDir, writeJson, mergePackageJson } from '../utils/file-utils.js';
import { DATABASE_OPTIONS, ORM_OPTIONS } from '../types.js';

/**
 * Generate database configuration
 */
export async function generateDatabase(config) {
  const dbDir = path.join(config.projectDir, 'database');
  await ensureDir(dbDir);
  
  // Generate ORM configuration
  if (config.orm !== ORM_OPTIONS.NONE) {
    await generateORM(config, dbDir);
  }
  
  // Generate database connection
  await generateDatabaseConnection(config, dbDir);
}

async function generateORM(config, dbDir) {
  switch (config.orm) {
    case ORM_OPTIONS.PRISMA:
      await generatePrisma(config, dbDir);
      break;
    case ORM_OPTIONS.SEQUELIZE:
      await generateSequelize(config, dbDir);
      break;
    case ORM_OPTIONS.MONGOOSE:
      await generateMongoose(config, dbDir);
      break;
    case ORM_OPTIONS.TYPEORM:
      await generateTypeORM(config, dbDir);
      break;
  }
}

async function generateDatabaseConnection(config, dbDir) {
  let connectionContent = '';
  
  switch (config.database) {
    case DATABASE_OPTIONS.SQLITE:
      connectionContent = `// SQLite connection configuration
const Database = require('better-sqlite3');
const db = new Database('database.sqlite');

module.exports = db;
`;
      break;
    case DATABASE_OPTIONS.POSTGRES:
      connectionContent = `// PostgreSQL connection configuration
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || '${config.projectName}',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

module.exports = pool;
`;
      break;
    case DATABASE_OPTIONS.MYSQL:
      connectionContent = `// MySQL connection configuration
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || '${config.projectName}',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
});

module.exports = connection;
`;
      break;
    case DATABASE_OPTIONS.MONGODB:
      connectionContent = `// MongoDB connection configuration
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/${config.projectName}';
const client = new MongoClient(uri);

async function connect() {
  await client.connect();
  return client.db();
}

module.exports = { connect, client };
`;
      break;
  }
  
  await writeJson(path.join(dbDir, 'config.js'), connectionContent, { spaces: 0 });
}

async function generatePrisma(config, dbDir) {
  // Stub for Prisma
  await mergePackageJson(path.join(config.projectDir, 'package.json'), {
    devDependencies: {
      'prisma': '^5.7.1'
    },
    dependencies: {
      '@prisma/client': '^5.7.1'
    }
  });
}

async function generateSequelize(config, dbDir) {
  // Stub for Sequelize
  await mergePackageJson(path.join(config.projectDir, 'package.json'), {
    dependencies: {
      'sequelize': '^6.35.2'
    }
  });
}

async function generateMongoose(config, dbDir) {
  // Stub for Mongoose
  await mergePackageJson(path.join(config.projectDir, 'package.json'), {
    dependencies: {
      'mongoose': '^8.0.3'
    }
  });
}

async function generateTypeORM(config, dbDir) {
  // Stub for TypeORM
  await mergePackageJson(path.join(config.projectDir, 'package.json'), {
    dependencies: {
      'typeorm': '^0.3.17'
    }
  });
}

export default { generateDatabase };
