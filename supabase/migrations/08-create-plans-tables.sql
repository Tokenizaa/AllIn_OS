-- ============================================================================
-- MLM PLANS MODULE - DATABASE SCHEMA
-- ============================================================================
-- This migration creates the tables for the MLM Plans module
-- ============================================================================

BEGIN;

-- ============================================================================
-- PLANS TABLE
-- ============================================================================
CREATE TABLE plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    price numeric(10,2) NOT NULL DEFAULT 0,
    activation_fee numeric(10,2) DEFAULT 0,
    plan_type text,
    is_affiliate boolean DEFAULT false,
    is_active boolean DEFAULT true,
    max_generations integer DEFAULT 1,
    direct_bonus_percentage numeric(5,2) DEFAULT 0,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_plans_slug ON plans(slug);
CREATE INDEX idx_plans_is_active ON plans(is_active);
CREATE INDEX idx_plans_plan_type ON plans(plan_type);

-- ============================================================================
-- PLAN BONUSES TABLE
-- ============================================================================
CREATE TABLE plan_bonuses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id uuid NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
    generation integer NOT NULL,
    bonus_percentage numeric(5,2) NOT NULL,
    required_directs integer DEFAULT 0,
    bonus_type text DEFAULT 'generation',
    created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_plan_bonuses_plan_id ON plan_bonuses(plan_id);
CREATE INDEX idx_plan_bonuses_generation ON plan_bonuses(generation);

-- ============================================================================
-- CUSTOMER PLANS TABLE
-- ============================================================================
CREATE TABLE customer_plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    plan_id uuid NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
    status text DEFAULT 'active',
    activated_at timestamptz DEFAULT now(),
    expires_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_customer_plans_customer_id ON customer_plans(customer_id);
CREATE INDEX idx_customer_plans_plan_id ON customer_plans(plan_id);
CREATE INDEX idx_customer_plans_status ON customer_plans(status);
CREATE INDEX idx_customer_plans_activated_at ON customer_plans(activated_at);

-- ============================================================================
-- ADD PLAN_ID TO CUSTOMERS TABLE
-- ============================================================================
ALTER TABLE customers ADD COLUMN IF NOT EXISTS plan_id uuid REFERENCES plans(id) ON DELETE SET NULL;
CREATE INDEX idx_customers_plan_id ON customers(plan_id);

COMMIT;
