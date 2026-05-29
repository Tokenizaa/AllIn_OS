-- ============================================================================
-- PHASE 6: CREATE REFRESH FUNCTION AND SCHEDULE
-- ============================================================================
-- This script creates a function to refresh all materialized views
-- and sets up a schedule (requires pg_cron extension)
-- ============================================================================

-- Create function to refresh all materialized views
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW analytics_sales_summary;
    REFRESH MATERIALIZED VIEW analytics_customer_summary;
    REFRESH MATERIALIZED VIEW analytics_network_summary;
    REFRESH MATERIALIZED VIEW analytics_product_summary;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to appropriate roles
-- GRANT EXECUTE ON FUNCTION refresh_analytics_views() TO your_app_role;

-- Schedule refresh using pg_cron (if extension is available)
-- Uncomment the following lines if pg_cron is installed:
--
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
--
-- SELECT cron.schedule(
--     'refresh-analytics',
--     '0 * * * *', -- Every hour
--     'SELECT refresh_analytics_views()'
-- );

-- Alternative: Manual refresh trigger
-- Create a trigger to refresh after significant data changes
-- This is optional and depends on your use case

-- Verify function created
SELECT 
    proname as function_name,
    pg_get_functiondef(oid) as definition
FROM pg_proc 
WHERE proname = 'refresh_analytics_views';
