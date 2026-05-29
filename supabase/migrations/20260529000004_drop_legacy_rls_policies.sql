BEGIN;

DROP POLICY IF EXISTS "Admins can delete admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can insert admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can update admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view all admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Users can view own admin profile" ON public.admin_users;

DROP POLICY IF EXISTS "Campaigns owner all" ON public.campaigns;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.campaigns;

DROP POLICY IF EXISTS "Conversations owner all" ON public.chatwoot_conversations;
DROP POLICY IF EXISTS "Messages owner all" ON public.chatwoot_messages;
DROP POLICY IF EXISTS "Customer events owner all" ON public.customer_events;
DROP POLICY IF EXISTS "Leads owner all" ON public.leads;
DROP POLICY IF EXISTS "Payments owner read" ON public.payments;
DROP POLICY IF EXISTS "Payments owner write" ON public.payments;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.customers;
DROP POLICY IF EXISTS "Users can delete their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can insert their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can update their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can view their own customers" ON public.customers;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.products;
DROP POLICY IF EXISTS "Users can insert their own products" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
DROP POLICY IF EXISTS "Users can view their own products" ON public.products;

DROP POLICY IF EXISTS "Profiles insert by owner" ON public.profiles;
DROP POLICY IF EXISTS "Profiles update by owner" ON public.profiles;
DROP POLICY IF EXISTS "Profiles viewable by owner" ON public.profiles;

DROP POLICY IF EXISTS "Workspace settings owner all" ON public.workspace_settings;

DROP POLICY IF EXISTS "Admins can delete marketing links" ON public.marketing_links;
DROP POLICY IF EXISTS "Admins can insert marketing links" ON public.marketing_links;
DROP POLICY IF EXISTS "Admins can update marketing links" ON public.marketing_links;
DROP POLICY IF EXISTS "Admins can view all marketing links" ON public.marketing_links;
DROP POLICY IF EXISTS "Distributors can view own marketing links" ON public.marketing_links;

DROP POLICY IF EXISTS "Enable all access for product_variants" ON public.product_variants;

COMMIT;
