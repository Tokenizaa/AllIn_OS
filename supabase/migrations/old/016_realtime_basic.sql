-- =====================================================================
-- ALLIN Sistema - Configuração Realtime Básica (Ajustado para estrutura atual)
-- Projeto: sistema-allin (isjsydhuqurneswstlyx)
-- Data: 2026-05-26
-- =====================================================================

-- ---------------------------------------------------------------------
-- Habilitar Realtime para tabelas críticas existentes
-- ---------------------------------------------------------------------

-- Tabelas de wallet e transações
ALTER PUBLICATION supabase_realtime ADD TABLE public.wallets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;

-- Tabelas de pedidos
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;

-- Tabelas de bônus
ALTER PUBLICATION supabase_realtime ADD TABLE public.bonuses;

-- Tabelas de rede
ALTER PUBLICATION supabase_realtime ADD TABLE public.network_relationships;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customer_network_metrics;

-- Tabelas de pagamentos
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;

-- ---------------------------------------------------------------------
-- Funções para notificações realtime (ajustadas para estrutura atual)
-- ---------------------------------------------------------------------

-- Função para notificar mudança de saldo
CREATE OR REPLACE FUNCTION public.notify_wallet_balance_change()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify(
        'wallet_balance_changed',
        json_build_object(
            'wallet_id', NEW.id,
            'customer_id', NEW.customer_id,
            'balance', NEW.balance,
            'available_balance', NEW.available_balance,
            'pending_balance', NEW.pending_balance,
            'changed_at', now()
        )::TEXT
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para notificar novo pedido
CREATE OR REPLACE FUNCTION public.notify_new_order()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify(
        'new_order',
        json_build_object(
            'order_id', NEW.id,
            'order_number', NEW.numero_pedido,
            'customer_id', NEW.customer_id,
            'valor_total', NEW.valor_total_pedido,
            'status', NEW.status_pedido,
            'created_at', NEW.data_criacao
        )::TEXT
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para notificar mudança de status de pedido
CREATE OR REPLACE FUNCTION public.notify_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status_pedido != OLD.status_pedido THEN
        PERFORM pg_notify(
            'order_status_changed',
            json_build_object(
                'order_id', NEW.id,
                'order_number', NEW.numero_pedido,
                'customer_id', NEW.customer_id,
                'old_status', OLD.status_pedido,
                'new_status', NEW.status_pedido,
                'changed_at', now()
            )::TEXT
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para notificar novo bônus
CREATE OR REPLACE FUNCTION public.notify_new_bonus()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify(
        'new_bonus',
        json_build_object(
            'bonus_id', NEW.id,
            'distributor_id', NEW.distributor_id,
            'type', NEW.type,
            'amount', NEW.amount,
            'status', NEW.status,
            'period', NEW.period,
            'created_at', NEW.created_at
        )::TEXT
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para notificar mudança de status de bônus
CREATE OR REPLACE FUNCTION public.notify_bonus_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status != OLD.status THEN
        PERFORM pg_notify(
            'bonus_status_changed',
            json_build_object(
                'bonus_id', NEW.id,
                'distributor_id', NEW.distributor_id,
                'old_status', OLD.status,
                'new_status', NEW.status,
                'paid_at', NEW.paid_at,
                'changed_at', now()
            )::TEXT
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para notificar novo relacionamento de rede
CREATE OR REPLACE FUNCTION public.notify_network_relationship_created()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify(
        'network_relationship_created',
        json_build_object(
            'sponsor_customer_id', NEW.sponsor_customer_id,
            'customer_id', NEW.customer_id,
            'level', NEW.level,
            'created_at', NEW.created_at
        )::TEXT
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para notificar atualização de métricas de rede
CREATE OR REPLACE FUNCTION public.notify_network_metrics_updated()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify(
        'network_metrics_updated',
        json_build_object(
            'customer_id', NEW.customer_id,
            'total_network_size', NEW.total_network_size,
            'active_network_size', NEW.active_network_size,
            'network_revenue', NEW.network_revenue,
            'leadership_score', NEW.leadership_score,
            'updated_at', NEW.updated_at
        )::TEXT
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------
-- Aplicar Triggers de Notificação
-- ---------------------------------------------------------------------

-- Wallet
DROP TRIGGER IF EXISTS trigger_wallet_balance_change ON public.wallets;
CREATE TRIGGER trigger_wallet_balance_change
    AFTER INSERT OR UPDATE ON public.wallets
    FOR EACH ROW EXECUTE FUNCTION public.notify_wallet_balance_change();

-- Pedidos
DROP TRIGGER IF EXISTS trigger_new_order ON public.orders;
CREATE TRIGGER trigger_new_order
    AFTER INSERT ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.notify_new_order();

DROP TRIGGER IF EXISTS trigger_order_status_change ON public.orders;
CREATE TRIGGER trigger_order_status_change
    AFTER UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.notify_order_status_change();

-- Bônus
DROP TRIGGER IF EXISTS trigger_new_bonus ON public.bonuses;
CREATE TRIGGER trigger_new_bonus
    AFTER INSERT ON public.bonuses
    FOR EACH ROW EXECUTE FUNCTION public.notify_new_bonus();

DROP TRIGGER IF EXISTS trigger_bonus_status_change ON public.bonuses;
CREATE TRIGGER trigger_bonus_status_change
    AFTER UPDATE ON public.bonuses
    FOR EACH ROW EXECUTE FUNCTION public.notify_bonus_status_change();

-- Rede
DROP TRIGGER IF EXISTS trigger_network_relationship_created ON public.network_relationships;
CREATE TRIGGER trigger_network_relationship_created
    AFTER INSERT ON public.network_relationships
    FOR EACH ROW EXECUTE FUNCTION public.notify_network_relationship_created();

DROP TRIGGER IF EXISTS trigger_network_metrics_updated ON public.customer_network_metrics;
CREATE TRIGGER trigger_network_metrics_updated
    AFTER UPDATE ON public.customer_network_metrics
    FOR EACH ROW EXECUTE FUNCTION public.notify_network_metrics_updated();

-- ---------------------------------------------------------------------
-- Grant Permissions
-- ---------------------------------------------------------------------
GRANT EXECUTE ON FUNCTION public.notify_wallet_balance_change() TO service_role;
GRANT EXECUTE ON FUNCTION public.notify_new_order() TO service_role;
GRANT EXECUTE ON FUNCTION public.notify_order_status_change() TO service_role;
GRANT EXECUTE ON FUNCTION public.notify_new_bonus() TO service_role;
GRANT EXECUTE ON FUNCTION public.notify_bonus_status_change() TO service_role;
GRANT EXECUTE ON FUNCTION public.notify_network_relationship_created() TO service_role;
GRANT EXECUTE ON FUNCTION public.notify_network_metrics_updated() TO service_role;
