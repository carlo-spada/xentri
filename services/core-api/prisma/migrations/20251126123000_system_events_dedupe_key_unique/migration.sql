-- Enforce uniqueness for provisioned events and other deduped writes
-- Partial index allows multiple NULL dedupe_key values
CREATE UNIQUE INDEX idx_system_events_dedupe_key_unique
  ON system_events(dedupe_key)
  WHERE dedupe_key IS NOT NULL;
