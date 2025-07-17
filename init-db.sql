-- Database schema for KlinkyLinks - Enhanced per blueprint specifications
-- Run this in Replit Shell: psql $DATABASE_URL -f init-db.sql

-- Users table (enhanced from existing schema)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  profile_image_url VARCHAR(255),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'free',
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content items table (comprehensive fingerprinting support)
CREATE TABLE IF NOT EXISTS content_items (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  s3_key TEXT NOT NULL,
  s3_url TEXT NOT NULL,
  fingerprint TEXT, -- JSON stored perceptual hash/embedding
  metadata JSONB, -- title, description, tags, etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Infringements/violations table (multi-platform support)
CREATE TABLE IF NOT EXISTS infringements (
  id SERIAL PRIMARY KEY,
  content_id INTEGER NOT NULL REFERENCES content_items(id),
  user_id VARCHAR NOT NULL REFERENCES users(id),
  platform TEXT NOT NULL, -- google_images, google_videos, bing_images, bing_videos, etc.
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  screenshot_s3_key TEXT,
  screenshot_url TEXT,
  priority TEXT DEFAULT 'medium', -- low, medium, high
  status TEXT DEFAULT 'detected', -- detected, dmca_pending, dmca_sent, resolved, ignored
  similarity DECIMAL(5,4), -- 0.0000 to 1.0000
  detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DMCA notices table (comprehensive notice management)
CREATE TABLE IF NOT EXISTS dmca_notices (
  id SERIAL PRIMARY KEY,
  infringement_id INTEGER NOT NULL REFERENCES infringements(id),
  user_id VARCHAR NOT NULL REFERENCES users(id),
  recipient_email TEXT,
  platform TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT DEFAULT 'draft', -- draft, approved, sent, delivered, responded
  template_used TEXT DEFAULT 'standard', -- standard, detailed, urgent
  review_comments TEXT,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP,
  sent_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table (Stripe integration)
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id),
  tier VARCHAR(50) NOT NULL, -- free, basic, pro, enterprise
  status VARCHAR(50) NOT NULL, -- active, cancelled, past_due, unpaid
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent activity logs table (monitoring and analytics)
CREATE TABLE IF NOT EXISTS agent_logs (
  id SERIAL PRIMARY KEY,
  agent_name VARCHAR(50) NOT NULL, -- POA, SCA, PMA, DTA
  activity_type VARCHAR(100) NOT NULL, -- scan, fingerprint, dmca_generate, etc.
  status VARCHAR(50) NOT NULL, -- success, error, pending
  data JSONB, -- activity-specific data
  error_message TEXT,
  execution_time INTEGER, -- milliseconds
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table (required for Replit Auth)
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

-- Monitoring scans table (comprehensive scan tracking)
CREATE TABLE IF NOT EXISTS monitoring_scans (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id),
  content_id INTEGER REFERENCES content_items(id),
  scan_type VARCHAR(50) NOT NULL, -- scheduled, manual, triggered
  platforms_scanned TEXT[], -- array of platforms
  total_results INTEGER DEFAULT 0,
  matches_found INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'running', -- running, completed, failed
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  scan_data JSONB -- detailed results
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_items_user_id ON content_items(user_id);
CREATE INDEX IF NOT EXISTS idx_content_items_active ON content_items(is_active);
CREATE INDEX IF NOT EXISTS idx_infringements_content_id ON infringements(content_id);
CREATE INDEX IF NOT EXISTS idx_infringements_user_id ON infringements(user_id);
CREATE INDEX IF NOT EXISTS idx_infringements_status ON infringements(status);
CREATE INDEX IF NOT EXISTS idx_dmca_notices_user_id ON dmca_notices(user_id);
CREATE INDEX IF NOT EXISTS idx_dmca_notices_status ON dmca_notices(status);
CREATE INDEX IF NOT EXISTS idx_agent_logs_agent_name ON agent_logs(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_logs_created_at ON agent_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_monitoring_scans_user_id ON monitoring_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expire ON sessions(expire);

-- Insert sample data for testing (optional)
INSERT INTO users (id, email, first_name, last_name) VALUES 
('demo_user_1', 'demo@klinkylinks.com', 'Demo', 'User') 
ON CONFLICT (id) DO NOTHING;

-- Create database functions for common operations
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON content_items 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_infringements_updated_at BEFORE UPDATE ON infringements 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dmca_notices_updated_at BEFORE UPDATE ON dmca_notices 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant appropriate permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO PUBLIC;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO PUBLIC;

-- Success message
SELECT 'KlinkyLinks database schema initialized successfully!' as status;