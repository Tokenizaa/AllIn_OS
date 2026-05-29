BEGIN;

ALTER FUNCTION analytics.refresh_all() SET search_path = analytics, public;

COMMIT;
