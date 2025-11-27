-- Story 1.4: Organization Settings Table
-- Creates org_settings for storing plan, features, and preferences per org

-- ===================
-- Table: org_settings
-- ===================
CREATE TABLE org_settings (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free',
  features JSONB NOT NULL DEFAULT '{}',
  preferences JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT org_settings_org_id_unique UNIQUE (org_id)
);

-- ===================
-- Indexes
-- ===================
CREATE INDEX idx_org_settings_org_id ON org_settings(org_id);

-- ===================
-- Row Level Security (Fail-Closed Pattern)
-- ===================

-- Enable RLS
ALTER TABLE org_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_settings FORCE ROW LEVEL SECURITY;

-- Read policy: Org members can read their org's settings
CREATE POLICY org_settings_read ON org_settings
  FOR SELECT
  USING (
    current_setting('app.current_org_id', true) IS NOT NULL
    AND org_id = current_setting('app.current_org_id', true)
  );

-- Insert policy: Allow insert when org context is set and matches
CREATE POLICY org_settings_insert ON org_settings
  FOR INSERT
  WITH CHECK (
    current_setting('app.current_org_id', true) IS NOT NULL
    AND org_id = current_setting('app.current_org_id', true)
  );

-- Update policy: Only allow update when org context matches
-- Note: Owner-only enforcement happens at application layer via clerkAuthMiddleware
CREATE POLICY org_settings_update ON org_settings
  FOR UPDATE
  USING (
    current_setting('app.current_org_id', true) IS NOT NULL
    AND org_id = current_setting('app.current_org_id', true)
  )
  WITH CHECK (
    current_setting('app.current_org_id', true) IS NOT NULL
    AND org_id = current_setting('app.current_org_id', true)
  );

-- ===================
-- Updated At Trigger (self-contained)
-- ===================
CREATE OR REPLACE FUNCTION update_updated_at_org_settings()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER org_settings_updated_at
  BEFORE UPDATE ON org_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_org_settings();
