-- Xentri Database Initialization
-- This script runs on first container startup

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Verify RLS is enabled at system level
DO $$
BEGIN
  IF current_setting('row_security') != 'on' THEN
    RAISE EXCEPTION 'Row Level Security must be enabled at system level';
  END IF;
END $$;

-- Log initialization
DO $$
BEGIN
  RAISE NOTICE 'Xentri database initialized with RLS enabled';
END $$;
