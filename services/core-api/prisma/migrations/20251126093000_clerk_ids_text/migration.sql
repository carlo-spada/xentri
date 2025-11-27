-- Migrate identity columns from UUID to TEXT to support Clerk IDs
-- Also update RLS policies/functions to remove ::uuid casts

-- 1. DROP existing RLS policies first (required before altering column types)
DROP POLICY IF EXISTS tenant_isolation_organizations ON organizations;
DROP POLICY IF EXISTS tenant_isolation_members ON members;
DROP POLICY IF EXISTS tenant_isolation_system_events ON system_events;
DROP POLICY IF EXISTS tenant_insert_events ON system_events;
DROP POLICY IF EXISTS tenant_read_events ON system_events;
DROP POLICY IF EXISTS tenant_insert_system_events ON system_events;

-- 2. Drop foreign keys that depend on UUID types
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_org_id_fkey;
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_user_id_fkey;
ALTER TABLE system_events DROP CONSTRAINT IF EXISTS system_events_org_id_fkey;
ALTER TABLE system_events DROP CONSTRAINT IF EXISTS system_events_user_id_fkey;

-- 3. Convert primary/foreign key columns to TEXT
ALTER TABLE organizations ALTER COLUMN id TYPE TEXT USING id::text;
ALTER TABLE users ALTER COLUMN id TYPE TEXT USING id::text;
ALTER TABLE members ALTER COLUMN id TYPE TEXT USING id::text;
ALTER TABLE members ALTER COLUMN org_id TYPE TEXT USING org_id::text;
ALTER TABLE members ALTER COLUMN user_id TYPE TEXT USING user_id::text;
ALTER TABLE system_events ALTER COLUMN id TYPE TEXT USING id::text;
ALTER TABLE system_events ALTER COLUMN org_id TYPE TEXT USING org_id::text;
ALTER TABLE system_events ALTER COLUMN user_id TYPE TEXT USING user_id::text;

-- 4. Adjust defaults to cast uuid generator output to text
ALTER TABLE organizations ALTER COLUMN id SET DEFAULT uuid_generate_v4()::text;
ALTER TABLE users ALTER COLUMN id SET DEFAULT uuid_generate_v4()::text;
ALTER TABLE members ALTER COLUMN id SET DEFAULT uuid_generate_v4()::text;
ALTER TABLE system_events ALTER COLUMN id SET DEFAULT uuid_generate_v4()::text;

-- 5. Recreate foreign keys with TEXT types
ALTER TABLE members
  ADD CONSTRAINT members_org_id_fkey FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE members
  ADD CONSTRAINT members_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE system_events
  ADD CONSTRAINT system_events_org_id_fkey FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE system_events
  ADD CONSTRAINT system_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- 6. Create NEW RLS policies (now columns are TEXT, no ::uuid cast needed)
CREATE POLICY tenant_isolation_organizations ON organizations
  FOR ALL
  USING (
    current_setting('app.current_org_id', true) IS NOT NULL
    AND id = current_setting('app.current_org_id', true)
  );

CREATE POLICY tenant_isolation_members ON members
  FOR ALL
  USING (
    current_setting('app.current_org_id', true) IS NOT NULL
    AND org_id = current_setting('app.current_org_id', true)
  );

CREATE POLICY tenant_insert_events ON system_events
  FOR INSERT
  WITH CHECK (
    current_setting('app.current_org_id', true) IS NOT NULL
    AND org_id = current_setting('app.current_org_id', true)
  );

CREATE POLICY tenant_read_events ON system_events
  FOR SELECT
  USING (
    current_setting('app.current_org_id', true) IS NOT NULL
    AND org_id = current_setting('app.current_org_id', true)
  );

-- 7. Update helper functions to accept text IDs
CREATE OR REPLACE FUNCTION set_current_org(org_id TEXT)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_org_id', org_id, true);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_current_org()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('app.current_org_id', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
