-- Story 1.2: Event Backbone & Database Schema
-- Aligns system_events table with AC1 specification
-- Adds immutability constraints per AC3

-- ===================
-- Add Missing Columns
-- ===================

-- user_id: Nullable for system events (distinct from actor)
ALTER TABLE system_events ADD COLUMN IF NOT EXISTS user_id UUID;

-- created_at: When the event was written to DB (distinct from occurred_at)
ALTER TABLE system_events ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- source: Top-level column for event origin (e.g., "core-api", "strategy-co-pilot")
ALTER TABLE system_events ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'unknown';

-- ===================
-- Rename type → event_type (per tech spec)
-- ===================
ALTER TABLE system_events RENAME COLUMN type TO event_type;

-- ===================
-- Indexes (per AC1)
-- ===================

-- Drop old index
DROP INDEX IF EXISTS idx_system_events_org_occurred;
DROP INDEX IF EXISTS idx_system_events_type;

-- Create composite index for common queries: filter by org+type, sort by time DESC
CREATE INDEX idx_events_org_type_time ON system_events(org_id, event_type, occurred_at DESC);

-- Keep correlation_id index for tracing
-- idx_system_events_correlation already exists

-- ===================
-- Immutability Constraints (AC3)
-- Events are append-only: no UPDATE or DELETE allowed
-- ===================

-- Drop existing policy that allows ALL operations
DROP POLICY IF EXISTS tenant_isolation_system_events ON system_events;

-- Create INSERT-only policy: fail-closed tenant isolation
CREATE POLICY tenant_insert_events ON system_events
  FOR INSERT
  WITH CHECK (
    current_setting('app.current_org_id', true) IS NOT NULL
    AND org_id = current_setting('app.current_org_id', true)::uuid
  );

-- Create SELECT policy: org-scoped reads only
CREATE POLICY tenant_read_events ON system_events
  FOR SELECT
  USING (
    current_setting('app.current_org_id', true) IS NOT NULL
    AND org_id = current_setting('app.current_org_id', true)::uuid
  );

-- No UPDATE or DELETE policies = blocked by RLS (fail-closed)

-- Create trigger to prevent UPDATE (belt and suspenders)
CREATE OR REPLACE FUNCTION prevent_event_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'system_events is immutable: UPDATE operations are not allowed';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER no_update_events
  BEFORE UPDATE ON system_events
  FOR EACH ROW EXECUTE FUNCTION prevent_event_modification();

-- Create rule to prevent DELETE (additional layer)
CREATE OR REPLACE RULE no_delete_events AS
  ON DELETE TO system_events
  DO INSTEAD NOTHING;
