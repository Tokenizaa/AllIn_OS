-- Phase 2 Modules: Verifications, Approvals, Admin Users, Marketing Links, Sponsor Change
-- Migration created: 2026-05-27

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- VERIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS verification_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  distributor_id UUID NOT NULL,
  distributor_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('identity', 'address', 'bank_account', 'tax_document', 'selfie', 'other')),
  document_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_analysis', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for verifications
CREATE INDEX idx_verification_documents_distributor_id ON verification_documents(distributor_id);
CREATE INDEX idx_verification_documents_status ON verification_documents(status);
CREATE INDEX idx_verification_documents_category ON verification_documents(category);
CREATE INDEX idx_verification_documents_uploaded_at ON verification_documents(uploaded_at);

-- Enable RLS
ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for verifications
CREATE POLICY "Admins can view all verifications" ON verification_documents
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'manager' OR
    auth.jwt() ->> 'role' = 'support'
  );

CREATE POLICY "Admins can insert verifications" ON verification_documents
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'manager'
  );

CREATE POLICY "Admins can update verifications" ON verification_documents
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'manager'
  );

CREATE POLICY "Distributors can view own verifications" ON verification_documents
  FOR SELECT USING (
    distributor_id = (SELECT id FROM customers WHERE user_id = auth.uid())
  );

-- ============================================================================
-- APPROVALS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS approval_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('registration', 'document_verification', 'account_change', 'sponsor_change', 'withdrawal', 'other')),
  distributor_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  distributor_name TEXT NOT NULL,
  distributor_email TEXT NOT NULL,
  distributor_phone TEXT,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for approvals
CREATE INDEX idx_approval_requests_distributor_id ON approval_requests(distributor_id);
CREATE INDEX idx_approval_requests_status ON approval_requests(status);
CREATE INDEX idx_approval_requests_type ON approval_requests(type);
CREATE INDEX idx_approval_requests_requested_at ON approval_requests(requested_at);

-- Enable RLS
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for approvals
CREATE POLICY "Admins can view all approvals" ON approval_requests
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'manager' OR
    auth.jwt() ->> 'role' = 'support'
  );

CREATE POLICY "Admins can insert approvals" ON approval_requests
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'manager'
  );

CREATE POLICY "Admins can update approvals" ON approval_requests
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'manager'
  );

CREATE POLICY "Distributors can view own approvals" ON approval_requests
  FOR SELECT USING (
    distributor_id = (SELECT id FROM customers WHERE user_id = auth.uid())
  );

-- ============================================================================
-- ADMIN USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'executive', 'manager', 'support', 'operational', 'financial', 'marketing')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  permissions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for admin users
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_status ON admin_users(status);
CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin users
CREATE POLICY "Admins can view all admin users" ON admin_users
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can insert admin users" ON admin_users
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update admin users" ON admin_users
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete admin users" ON admin_users
  FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view own admin profile" ON admin_users
  FOR SELECT USING (user_id = auth.uid());

-- ============================================================================
-- MARKETING LINKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS marketing_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  distributor_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  distributor_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  full_url TEXT NOT NULL,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  campaign_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  total_clicks INTEGER DEFAULT 0,
  unique_clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  last_click_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for marketing links
CREATE INDEX idx_marketing_links_distributor_id ON marketing_links(distributor_id);
CREATE INDEX idx_marketing_links_slug ON marketing_links(slug);
CREATE INDEX idx_marketing_links_campaign_id ON marketing_links(campaign_id);
CREATE INDEX idx_marketing_links_status ON marketing_links(status);
CREATE INDEX idx_marketing_links_expires_at ON marketing_links(expires_at);

-- Enable RLS
ALTER TABLE marketing_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for marketing links
CREATE POLICY "Admins can view all marketing links" ON marketing_links
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'manager' OR
    auth.jwt() ->> 'role' = 'marketing'
  );

CREATE POLICY "Admins can insert marketing links" ON marketing_links
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'manager' OR
    auth.jwt() ->> 'role' = 'marketing'
  );

CREATE POLICY "Admins can update marketing links" ON marketing_links
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'manager' OR
    auth.jwt() ->> 'role' = 'marketing'
  );

CREATE POLICY "Admins can delete marketing links" ON marketing_links
  FOR DELETE USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'manager'
  );

CREATE POLICY "Distributors can view own marketing links" ON marketing_links
  FOR SELECT USING (
    distributor_id = (SELECT id FROM customers WHERE user_id = auth.uid())
  );

-- ============================================================================
-- SPONSOR CHANGE TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS sponsor_change_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  distributor_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  distributor_name TEXT NOT NULL,
  current_sponsor_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  current_sponsor_name TEXT NOT NULL,
  new_sponsor_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  new_sponsor_name TEXT NOT NULL,
  reason TEXT NOT NULL,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  requested_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  validation_results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for sponsor change requests
CREATE INDEX idx_sponsor_change_requests_distributor_id ON sponsor_change_requests(distributor_id);
CREATE INDEX idx_sponsor_change_requests_current_sponsor_id ON sponsor_change_requests(current_sponsor_id);
CREATE INDEX idx_sponsor_change_requests_new_sponsor_id ON sponsor_change_requests(new_sponsor_id);
CREATE INDEX idx_sponsor_change_requests_status ON sponsor_change_requests(status);
CREATE INDEX idx_sponsor_change_requests_requested_at ON sponsor_change_requests(requested_at);

-- Enable RLS
ALTER TABLE sponsor_change_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sponsor change requests
CREATE POLICY "Admins can view all sponsor changes" ON sponsor_change_requests
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'manager' OR
    auth.jwt() ->> 'role' = 'support'
  );

CREATE POLICY "Admins can insert sponsor changes" ON sponsor_change_requests
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'manager'
  );

CREATE POLICY "Admins can update sponsor changes" ON sponsor_change_requests
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'manager'
  );

CREATE POLICY "Distributors can view own sponsor changes" ON sponsor_change_requests
  FOR SELECT USING (
    distributor_id = (SELECT id FROM customers WHERE user_id = auth.uid())
  );

-- ============================================================================
-- LINK ANALYTICS TABLE (for tracking clicks and conversions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS link_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID NOT NULL REFERENCES marketing_links(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  clicks INTEGER DEFAULT 0,
  unique_clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(link_id, date)
);

-- Create indexes for link analytics
CREATE INDEX idx_link_analytics_link_id ON link_analytics(link_id);
CREATE INDEX idx_link_analytics_date ON link_analytics(date);

-- Enable RLS
ALTER TABLE link_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for link analytics
CREATE POLICY "Admins can view all link analytics" ON link_analytics
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'manager' OR
    auth.jwt() ->> 'role' = 'marketing'
  );

CREATE POLICY "Admins can insert link analytics" ON link_analytics
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'manager' OR
    auth.jwt() ->> 'role' = 'marketing'
  );

CREATE POLICY "Admins can update link analytics" ON link_analytics
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'role' = 'manager' OR
    auth.jwt() ->> 'role' = 'marketing'
  );

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table
CREATE TRIGGER update_verification_documents_updated_at
  BEFORE UPDATE ON verification_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_approval_requests_updated_at
  BEFORE UPDATE ON approval_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_links_updated_at
  BEFORE UPDATE ON marketing_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sponsor_change_requests_updated_at
  BEFORE UPDATE ON sponsor_change_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_link_analytics_updated_at
  BEFORE UPDATE ON link_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS
-- ============================================================================
-- This migration creates the necessary tables for Phase 2 modules:
-- - verification_documents: For document verification workflow
-- - approval_requests: For approval workflow
-- - admin_users: For admin user management
-- - marketing_links: For personalized marketing links
-- - sponsor_change_requests: For sponsor change requests
-- - link_analytics: For tracking link performance

-- All tables include:
-- - Proper foreign key relationships
-- - Indexes for performance
-- - Row Level Security (RLS) policies
-- - Updated_at triggers
-- - Check constraints for data integrity
