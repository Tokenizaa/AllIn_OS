-- =====================================================================
-- ALLIN Sistema - Enable RLS on Analytics Tables
-- Projeto: sistema-allin (isjsydhuqurneswstlyx)
-- Data: 2026-05-27
-- Purpose: Enable Row Level Security on analytics tables (CRITICAL SECURITY FIX)
-- =====================================================================

-- ---------------------------------------------------------------------
-- Enable RLS on analytics tables
-- ---------------------------------------------------------------------

-- Enable RLS on ai_insights
ALTER TABLE analytics.ai_insights ENABLE ROW LEVEL SECURITY;

-- Enable RLS on ai_conversations
ALTER TABLE analytics.ai_conversations ENABLE ROW LEVEL SECURITY;

-- Enable RLS on ai_messages
ALTER TABLE analytics.ai_messages ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- Create RLS Policies for analytics.ai_insights
-- ---------------------------------------------------------------------

-- Policy: Service role can do anything (no user_id column for user-level filtering)
DROP POLICY IF EXISTS "Service role full access" ON analytics.ai_insights;

CREATE POLICY "Service role full access" ON analytics.ai_insights
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- ---------------------------------------------------------------------
-- Create RLS Policies for analytics.ai_conversations
-- ---------------------------------------------------------------------

-- Policy: Service role can do anything (no user_id column for user-level filtering)
DROP POLICY IF EXISTS "Service role full access" ON analytics.ai_conversations;

CREATE POLICY "Service role full access" ON analytics.ai_conversations
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- ---------------------------------------------------------------------
-- Create RLS Policies for analytics.ai_messages
-- ---------------------------------------------------------------------

-- Policy: Service role can do anything (no user_id column for user-level filtering)
DROP POLICY IF EXISTS "Service role full access" ON analytics.ai_messages;

CREATE POLICY "Service role full access" ON analytics.ai_messages
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- ---------------------------------------------------------------------
-- Grant permissions
-- ---------------------------------------------------------------------

-- Grant select on analytics tables to service_role only (no user_id for row-level filtering)
GRANT SELECT ON analytics.ai_insights TO service_role;
GRANT SELECT ON analytics.ai_conversations TO service_role;
GRANT SELECT ON analytics.ai_messages TO service_role;

-- Grant all permissions to service role
GRANT ALL ON analytics.ai_insights TO service_role;
GRANT ALL ON analytics.ai_conversations TO service_role;
GRANT ALL ON analytics.ai_messages TO service_role;

-- ---------------------------------------------------------------------
-- Add comments
-- ---------------------------------------------------------------------

COMMENT ON TABLE analytics.ai_insights IS 'AI-generated insights table. RLS enabled - service role only access (no user_id column for user-level filtering).';
COMMENT ON TABLE analytics.ai_conversations IS 'AI conversation history table. RLS enabled - service role only access (no user_id column for user-level filtering).';
COMMENT ON TABLE analytics.ai_messages IS 'AI message history table. RLS enabled - service role only access (no user_id column for user-level filtering).';

-- ---------------------------------------------------------------------
-- Note: To enable user-level access, add user_id column to these tables
-- and create policies using: USING (user_id = auth.uid())
-- ---------------------------------------------------------------------

-- ---------------------------------------------------------------------
-- Verification query (commented out - for manual verification)
-- ---------------------------------------------------------------------

-- Uncomment to verify RLS is working:
-- SELECT 
--     schemaname,
--     tablename,
--     policyname,
--     permissive,
--     roles,
--     cmd,
--     qual,
--     with_check
-- FROM pg_policies 
-- WHERE schemaname = 'analytics'
-- ORDER BY tablename, policyname;
