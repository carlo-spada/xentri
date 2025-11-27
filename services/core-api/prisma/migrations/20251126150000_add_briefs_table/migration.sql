-- Story 1.6: Add briefs table for Universal Brief feature
-- RLS enabled with fail-closed pattern per ADR-003

-- ===================
-- Ensure update_updated_at function exists
-- ===================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===================
-- Create briefs table
-- ===================

CREATE TABLE briefs (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  org_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  schema_version TEXT NOT NULL DEFAULT '1.0',
  sections JSONB NOT NULL DEFAULT '{}',
  section_status JSONB NOT NULL DEFAULT '{}',
  completion_status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===================
-- Indexes
-- ===================

CREATE INDEX idx_briefs_org ON briefs(org_id);

-- ===================
-- Row Level Security (Fail-Closed Pattern)
-- ===================

ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefs FORCE ROW LEVEL SECURITY;

-- INSERT policy: Only allow inserting briefs for current org
CREATE POLICY tenant_insert_briefs ON briefs
  FOR INSERT
  WITH CHECK (
    current_setting('app.current_org_id', true) IS NOT NULL
    AND org_id = current_setting('app.current_org_id', true)
  );

-- SELECT policy: Only allow reading briefs for current org
CREATE POLICY tenant_read_briefs ON briefs
  FOR SELECT
  USING (
    current_setting('app.current_org_id', true) IS NOT NULL
    AND org_id = current_setting('app.current_org_id', true)
  );

-- UPDATE policy: Only allow updating briefs for current org
CREATE POLICY tenant_update_briefs ON briefs
  FOR UPDATE
  USING (
    current_setting('app.current_org_id', true) IS NOT NULL
    AND org_id = current_setting('app.current_org_id', true)
  )
  WITH CHECK (
    current_setting('app.current_org_id', true) IS NOT NULL
    AND org_id = current_setting('app.current_org_id', true)
  );

-- DELETE policy: Only allow deleting briefs for current org
CREATE POLICY tenant_delete_briefs ON briefs
  FOR DELETE
  USING (
    current_setting('app.current_org_id', true) IS NOT NULL
    AND org_id = current_setting('app.current_org_id', true)
  );

-- ===================
-- Updated At Trigger
-- ===================

CREATE TRIGGER briefs_updated_at
  BEFORE UPDATE ON briefs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
