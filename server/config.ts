// Environment variable validation and configuration
export interface Config {
  DATABASE_URL: string;
  SESSION_SECRET: string;
  OPENAI_API_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET?: string;
  NODE_ENV: string;
  PORT: number;
}

function validateEnvVar(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

export function loadConfig(): Config {
  const config: Config = {
    DATABASE_URL: validateEnvVar('DATABASE_URL', process.env.DATABASE_URL),
    SESSION_SECRET: validateEnvVar('SESSION_SECRET', process.env.SESSION_SECRET),
    OPENAI_API_KEY: validateEnvVar('OPENAI_API_KEY', process.env.OPENAI_API_KEY),
    STRIPE_SECRET_KEY: validateEnvVar('STRIPE_SECRET_KEY', process.env.STRIPE_SECRET_KEY),
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '5000', 10),
  };

  // Validate minimum lengths for security
  if (config.SESSION_SECRET.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters long');
  }

  if (!config.STRIPE_SECRET_KEY.startsWith('sk_')) {
    throw new Error('STRIPE_SECRET_KEY must start with sk_');
  }

  if (!config.OPENAI_API_KEY.startsWith('sk-')) {
    throw new Error('OPENAI_API_KEY must start with sk-');
  }

  console.log('[CONFIG] Environment validation successful');
  return config;
}

export const config = loadConfig();