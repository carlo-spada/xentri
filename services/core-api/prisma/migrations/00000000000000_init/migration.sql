-- Xentri Initial Migration
-- Enables Row Level Security with fail-closed policies per ADR-003

-- ===================
-- Extensions
-- ===================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===================
-- Enums
-- ===================
CREATE TYPE member_role AS ENUM ('owner', 'admin', 'member');

-- ===================
-- Tables
-- ===================

-- Organizations (tenant boundary)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users (authentication identity)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Members (user-org junction with roles)
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role member_role NOT NULL DEFAULT 'member',
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

-- System Events (append-only event log)
CREATE TABLE system_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  actor_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  payload_schema TEXT NOT NULL,
  payload JSONB NOT NULL,
  meta JSONB,
  dedupe_key TEXT,
  correlation_id TEXT,
  trace_id TEXT,
  envelope_version TEXT NOT NULL DEFAULT '1.0'
);

-- ===================
-- Indexes
-- ===================
CREATE INDEX idx_members_org_id ON members(org_id);
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_system_events_org_occurred ON system_events(org_id, occurred_at);
CREATE INDEX idx_system_events_type ON system_events(type);
CREATE INDEX idx_system_events_correlation ON system_events(correlation_id);

-- ===================
-- Row Level Security (Fail-Closed Pattern)
-- ADR-003: RLS must use fail-closed pattern
-- ===================

-- Enable RLS on tenant-scoped tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_events ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owners too (critical for security)
ALTER TABLE organizations FORCE ROW LEVEL SECURITY;
ALTER TABLE members FORCE ROW LEVEL SECURITY;
ALTER TABLE system_events FORCE ROW LEVEL SECURITY;

-- Organizations Policy: Fail-closed - only see org if current_org_id is set AND matches
CREATE POLICY tenant_isolation_organizations ON organizations
  FOR ALL
  USING (
    current_setting('app.current_org_id', true) IS NOT NULL
    AND id = current_setting('app.current_org_id', true)::uuid
  );

-- Members Policy: Only see members of current org
CREATE POLICY tenant_isolation_members ON members
  FOR ALL
  USING (
    current_setting('app.current_org_id', true) IS NOT NULL
    AND org_id = current_setting('app.current_org_id', true)::uuid
  );

-- System Events Policy: Only see events for current org
CREATE POLICY tenant_isolation_system_events ON system_events
  FOR ALL
  USING (
    current_setting('app.current_org_id', true) IS NOT NULL
    AND org_id = current_setting('app.current_org_id', true)::uuid
  );

-- ===================
-- Helper Functions
-- ===================

-- Function to set current org context (called at start of every transaction)
CREATE OR REPLACE FUNCTION set_current_org(org_id UUID)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_org_id', org_id::text, true);
END;
$$ LANGUAGE plpgsql;

-- Function to get current org (for debugging/verification)
CREATE OR REPLACE FUNCTION get_current_org()
RETURNS UUID AS $$
BEGIN
  RETURN current_setting('app.current_org_id', true)::uuid;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ===================
-- Updated At Trigger
-- ===================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
