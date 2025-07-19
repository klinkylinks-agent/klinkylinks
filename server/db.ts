import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '@shared/schema';
import { config } from './config';

// Configure Neon for serverless
neonConfig.webSocketConstructor = ws;

console.log('[DB] Initializing database connection...');
console.log('[DB] Database URL configured:', !!config.DATABASE_URL);

export const pool = new Pool({ 
  connectionString: config.DATABASE_URL,
  // Optimize for serverless
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export const db = drizzle({ 
  client: pool, 
  schema,
  logger: config.NODE_ENV === 'development'
});

// Test database connection
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    console.log('[DB] Testing database connection...');
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('[DB] Database connection successful:', result.rows[0].current_time);
    return true;
  } catch (error) {
    console.error('[DB] Database connection failed:', error);
    return false;
  }
}

// Initialize database tables if they don't exist
export async function initializeTables(): Promise<void> {
  try {
    console.log('[DB] Checking/creating database tables...');
    
    // Check if users table exists
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'content_items', 'infringements', 'dmca_notices', 'monitoring_scans')
    `);
    
    const existingTables = tablesResult.rows.map(row => row.table_name);
    const requiredTables = ['users', 'content_items', 'infringements', 'dmca_notices', 'monitoring_scans'];
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    
    if (missingTables.length > 0) {
      console.log('[DB] Missing tables:', missingTables);
      console.log('[DB] Run "npm run db:push" to create missing tables');
    } else {
      console.log('[DB] All required tables exist');
    }
  } catch (error) {
    console.error('[DB] Failed to check tables:', error);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('[DB] Closing database connections...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('[DB] Closing database connections...');
  await pool.end();
  process.exit(0);
});