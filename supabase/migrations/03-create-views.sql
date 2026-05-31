-- ============================================================================
-- PHASE 2: CREATE VIEWS
-- ============================================================================
-- This script creates all views before dropping tables
-- Execute this BEFORE dropping any tables
-- ============================================================================

BEGIN;

-- ============================================================================
-- CUSTOMER 360 VIEW
-- ============================================================================
DROP VIEW IF EXISTS customer_360_view CASCADE;
CREATE VIEW customer_360_view AS
SELECT
    c.id,
    c.nome_completo,
    c.email,
    c.cpf,
    c.telefone,
    c.endereco,
    c.cidade,
    c.estado,
    c.cep,
    c.qualification,
    c.status,
    c.created_at AS data_cadastro,
    c.activation_date AS data_ativacao,
    
    -- Plan information
    c.plan_id,
    pl.name AS plan_name,
    pl.slug AS plan_slug,
    pl.price AS plan_price,
    pl.is_affiliate AS plan_is_affiliate,
    pl.max_generations AS plan_max_generations,
    pl.direct_bonus_percentage AS plan_direct_bonus,
    cp.status AS plan_status,
    cp.activated_at AS plan_activated_at,
    cp.expires_at AS plan_expires_at,
    
    -- Order metrics
    COALESCE(o.order_count, 0) AS total_pedidos,
    COALESCE(o.total_spent, 0) AS total_gasto,
    COALESCE(o.last_order_date, NULL) AS ultimo_pedido,
    
    -- Payment metrics
    COALESCE(p.total_paid, 0) AS total_pago,
    COALESCE(p.payment_count, 0) AS total_pagamentos,
    
    -- Shipment metrics
    COALESCE(s.shipment_count, 0) AS total_envios,
    COALESCE(s.last_shipment_date, NULL) AS ultimo_envio,
    
    -- Network metrics
    cnm.total_network_size AS total_downlines,
    cnm.active_network_size AS active_downlines,
    cnm.network_revenue,
    
    -- AI metrics
    cm.ltv,
    cm.frequencia_compra AS frequency,
    cm.dias_desde_ultima_compra AS recency,
    cs.engagement_score AS ai_score,
    cs.churn_score AS risk_level,
    
    -- Product affinities
    cp.categoria_favorita AS top_category,
    cp.produto_favorito AS top_product_id
    
FROM customers c
LEFT JOIN plans pl ON c.plan_id = pl.id
LEFT JOIN (
    SELECT DISTINCT ON (customer_id) 
        customer_id,
        plan_id,
        status,
        activated_at,
        expires_at,
        categoria_favorita,
        produto_favorito
    FROM customer_plans
    ORDER BY customer_id, activated_at DESC
) cp ON c.id = cp.customer_id
LEFT JOIN (
    SELECT 
        orders.customer_id,
        COUNT(*) AS order_count,
        SUM(orders.valor_total_pedido) AS total_spent,
        MAX(orders.data_criacao) AS last_order_date
    FROM orders
    GROUP BY orders.customer_id
) o ON c.id = o.customer_id
LEFT JOIN (
    SELECT 
        payments.customer_id,
        COUNT(*) AS payment_count,
        SUM(payments.amount) AS total_paid
    FROM payments
    WHERE payments.status = 'succeeded'
    GROUP BY payments.customer_id
) p ON c.id = p.customer_id
LEFT JOIN (
    SELECT 
        orders.customer_id,
        COUNT(*) AS shipment_count,
        MAX(shipments.shipped_at) AS last_shipment_date
    FROM shipments
    JOIN orders ON shipments.order_id = orders.id
    GROUP BY orders.customer_id
) s ON c.id = s.customer_id
LEFT JOIN customer_network_metrics cnm ON c.id = cnm.customer_id
LEFT JOIN customer_metrics cm ON c.id = cm.customer_id
LEFT JOIN customer_scores cs ON c.id = cs.customer_id;

-- ============================================================================
-- ORDER SUMMARY VIEW
-- ============================================================================
DROP VIEW IF EXISTS order_summary_view CASCADE;
CREATE VIEW order_summary_view AS
SELECT
    o.id,
    o.numero_pedido,
    o.customer_id,
    c.nome_completo AS customer_name,
    c.email AS customer_email,
    c.qualification AS customer_level,
    o.status_pedido,
    o.forma_pagamento,
    o.purchase_type AS tipo_compra,
    o.valor_total_pedido,
    o.data_criacao AS data_pedido,
    o.data_pagamento,
    
    -- Order items summary
    oi.item_count,
    oi.product_count,
    oi.categories,
    
    -- Payment summary
    p.payment_status,
    p.payment_method,
    p.payment_date,
    
    -- Shipment summary
    s.shipment_status,
    s.shipping_method,
    s.shipping_date,
    s.delivery_date,
    
    -- Network context
    nr.sponsor_customer_id AS sponsor_id,
    nr.sponsor_name,
    nr.level AS generation
    
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id
LEFT JOIN (
    SELECT 
        order_items.order_id,
        COUNT(*) AS item_count,
        COUNT(DISTINCT order_items.product_id) AS product_count,
        ARRAY_AGG(DISTINCT order_items.category) AS categories
    FROM order_items
    GROUP BY order_items.order_id
) oi ON o.id = oi.order_id
LEFT JOIN (
    SELECT 
        payments.order_id,
        MAX(payments.status) AS payment_status,
        MAX(payments.payment_method) AS payment_method,
        MAX(payments.paid_at) AS payment_date
    FROM payments
    GROUP BY payments.order_id
) p ON o.id = p.order_id
LEFT JOIN (
    SELECT 
        shipments.order_id,
        MAX(shipments.shipping_status) AS shipment_status,
        MAX(shipments.provider) AS shipping_method,
        MAX(shipments.shipped_at) AS shipping_date,
        MAX(shipments.delivered_at) AS delivery_date
    FROM shipments
    GROUP BY shipments.order_id
) s ON o.id = s.order_id
LEFT JOIN (
    SELECT 
        customers.id AS customer_id,
        network_relationships.sponsor_customer_id,
        sp.nome_completo AS sponsor_name,
        network_relationships.level
    FROM customers
    LEFT JOIN network_relationships ON customers.id = network_relationships.customer_id
    LEFT JOIN customers sp ON network_relationships.sponsor_customer_id = sp.id
) nr ON o.customer_id = nr.customer_id;

-- ============================================================================
-- NETWORK TREE VIEW
-- ============================================================================
DROP VIEW IF EXISTS network_tree_view CASCADE;
CREATE VIEW network_tree_view AS
WITH RECURSIVE network_hierarchy AS (
    -- Base case: root nodes (no sponsor)
    SELECT 
        customers.id,
        customers.nome_completo,
        customers.email,
        customers.qualification,
        customers.status,
        customers.created_at AS data_cadastro,
        NULL::uuid AS sponsor_id,
        NULL::text AS sponsor_name,
        0 AS generation,
        ARRAY[customers.id] AS path,
        1 AS depth
    FROM customers
    WHERE customers.id NOT IN (SELECT network_relationships.customer_id FROM network_relationships)
    
    UNION ALL
    
    -- Recursive case: children
    SELECT 
        customers.id,
        customers.nome_completo,
        customers.email,
        customers.qualification,
        customers.status,
        customers.created_at AS data_cadastro,
        network_relationships.sponsor_customer_id AS sponsor_id,
        sp.nome_completo AS sponsor_name,
        nh.generation + 1,
        nh.path || customers.id,
        nh.depth + 1
    FROM customers
    JOIN network_relationships ON customers.id = network_relationships.customer_id
    JOIN customers sp ON network_relationships.sponsor_customer_id = sp.id
    JOIN network_hierarchy nh ON network_relationships.sponsor_customer_id = nh.id
    WHERE NOT customers.id = ANY(nh.path) -- Prevent cycles
)
SELECT
    nh.*,
    customer_network_metrics.total_network_size AS total_downlines,
    customer_network_metrics.active_network_size AS active_downlines,
    customer_network_metrics.network_revenue,
    qualifications.name AS qualification_name,
    qualifications.description AS qualification_description
FROM network_hierarchy nh
LEFT JOIN customer_network_metrics ON nh.id = customer_network_metrics.customer_id
LEFT JOIN qualifications ON nh.qualification = qualifications.qualification_type
ORDER BY nh.path;

COMMIT;

-- Verify views created
SELECT 
    schemaname,
    viewname,
    definition
FROM pg_views 
WHERE schemaname = 'public'
ORDER BY viewname;
