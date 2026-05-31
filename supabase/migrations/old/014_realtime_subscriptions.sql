-- =====================================================================
-- ALLIN Sistema - Configuração Realtime e Subscriptions
-- Projeto: sistema-allin (isjsydhuqurneswstlyx)
-- Data: 2026-05-26
-- =====================================================================

-- ---------------------------------------------------------------------
-- Habilitar Realtime para tabelas críticas
-- ---------------------------------------------------------------------

-- Tabelas de wallet e transações
ALTER PUBLICATION supabase_realtime ADD TABLE public.wallets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.accounts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.account_transactions;

-- Tabelas de pedidos
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;

-- Tabelas de bônus
ALTER PUBLICATION supabase_realtime ADD TABLE public.bonuses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bonus_calculations;

-- Tabelas de rede
ALTER PUBLICATION supabase_realtime ADD TABLE public.network_relationships;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customer_network_metrics;

-- Tabelas de Chatwoot
ALTER PUBLICATION supabase_realtime ADD TABLE public.chatwoot_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chatwoot_messages;

-- Tabelas de notificações
ALTER PUBLICATION supabase_realtime ADD TABLE public.customer_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.campaigns;

-- ---------------------------------------------------------------------
-- Funções para notificações realtime
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
            'saldo_sacavel', NEW.saldo_sacavel,
            'saldo_nao_sacavel', NEW.saldo_nao_sacavel,
            'saldo_loja_online', NEW.saldo_loja_online,
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
            'order_number', NEW.order_number,
            'customer_id', NEW.customer_id,
            'valor_total', NEW.valor_total_pedido,
            'status', NEW.status_pedido_id,
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
    IF NEW.status_pedido_id != OLD.status_pedido_id THEN
        PERFORM pg_notify(
            'order_status_changed',
            json_build_object(
                'order_id', NEW.id,
                'order_number', NEW.order_number,
                'customer_id', NEW.customer_id,
                'old_status', OLD.status_pedido_id,
                'new_status', NEW.status_pedido_id,
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

-- Função para notificar nova mensagem Chatwoot
CREATE OR REPLACE FUNCTION public.notify_new_chatwoot_message()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify(
        'new_chatwoot_message',
        json_build_object(
            'message_id', NEW.id,
            'conversation_id', NEW.conversation_id,
            'message_type', NEW.message_type,
            'content', LEFT(NEW.content, 200),
            'created_at', NEW.created_at
        )::TEXT
    );
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
            'parent_id', NEW.parent_id,
            'child_id', NEW.child_id,
            'relationship_type', NEW.relationship_type,
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
            'total_downline', NEW.total_downline,
            'active_downline', NEW.active_downline,
            'personal_volume', NEW.personal_volume,
            'total_volume', NEW.total_volume,
            'level', NEW.level,
            'rank', NEW.rank,
            'updated_at', NEW.calculated_at
        )::TEXT
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para notificar evento de cliente
CREATE OR REPLACE FUNCTION public.notify_customer_event()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify(
        'customer_event',
        json_build_object(
            'event_id', NEW.id,
            'customer_id', NEW.customer_id,
            'event_type', NEW.event_type,
            'event_data', NEW.event_data,
            'created_at', NEW.created_at
        )::TEXT
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------
-- Aplicar Triggers de Notificação
-- ---------------------------------------------------------------------

-- Wallet
CREATE TRIGGER trigger_wallet_balance_change
    AFTER INSERT OR UPDATE ON public.wallets
    FOR EACH ROW EXECUTE FUNCTION public.notify_wallet_balance_change();

-- Pedidos
CREATE TRIGGER trigger_new_order
    AFTER INSERT ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.notify_new_order();

CREATE TRIGGER trigger_order_status_change
    AFTER UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.notify_order_status_change();

-- Bônus
CREATE TRIGGER trigger_new_bonus
    AFTER INSERT ON public.bonuses
    FOR EACH ROW EXECUTE FUNCTION public.notify_new_bonus();

CREATE TRIGGER trigger_bonus_status_change
    AFTER UPDATE ON public.bonuses
    FOR EACH ROW EXECUTE FUNCTION public.notify_bonus_status_change();

-- Chatwoot
CREATE TRIGGER trigger_new_chatwoot_message
    AFTER INSERT ON public.chatwoot_messages
    FOR EACH ROW EXECUTE FUNCTION public.notify_new_chatwoot_message();

-- Rede
CREATE TRIGGER trigger_network_relationship_created
    AFTER INSERT ON public.network_relationships
    FOR EACH ROW EXECUTE FUNCTION public.notify_network_relationship_created();

CREATE TRIGGER trigger_network_metrics_updated
    AFTER UPDATE ON public.customer_network_metrics
    FOR EACH ROW EXECUTE FUNCTION public.notify_network_metrics_updated();

-- Eventos de cliente
CREATE TRIGGER trigger_customer_event
    AFTER INSERT ON public.customer_events
    FOR EACH ROW EXECUTE FUNCTION public.notify_customer_event();

-- ---------------------------------------------------------------------
-- Funções helper para subscriptions
-- ---------------------------------------------------------------------

-- Função para obter filtros de subscription por usuário
CREATE OR REPLACE FUNCTION public.get_subscription_filters(user_id UUID)
RETURNS JSONB AS $$
DECLARE
    customer_id UUID;
    filters JSONB;
BEGIN
    SELECT id INTO customer_id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1);
    
    filters := jsonb_build_object(
        'wallet', jsonb_build_object('customer_id', customer_id),
        'orders', jsonb_build_object('customer_id', customer_id),
        'bonuses', jsonb_build_object('distributor_id', (SELECT id_comprador FROM public.customers LIMIT 1)),
        'network', jsonb_build_object('customer_id', customer_id)
    );
    
    RETURN filters;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar permissão de subscription
CREATE OR REPLACE FUNCTION public.can_subscribe(table_name TEXT, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    CASE table_name
        WHEN 'wallets' THEN
            RETURN EXISTS (
                SELECT 1 FROM public.wallets w
                INNER JOIN public.customers c ON c.id = w.customer_id
                WHERE c.id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1)
            );
        WHEN 'orders' THEN
            RETURN EXISTS (
                SELECT 1 FROM public.orders o
                INNER JOIN public.customers c ON c.id = o.customer_id
                WHERE c.id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1)
            );
        WHEN 'bonuses' THEN
            RETURN (SELECT id_comprador FROM public.customers LIMIT 1) IS NOT NULL;
        WHEN 'network_relationships' THEN
            RETURN (SELECT id_comprador FROM public.customers LIMIT 1) IS NOT NULL;
        WHEN 'customer_network_metrics' THEN
            RETURN EXISTS (
                SELECT 1 FROM public.customer_network_metrics cnm
                INNER JOIN public.customers c ON c.id = cnm.customer_id
                WHERE c.id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1)
            );
        ELSE
            RETURN false;
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------
-- Grant Permissions
-- ---------------------------------------------------------------------
GRANT EXECUTE ON FUNCTION public.notify_wallet_balance_change() TO service_role;
GRANT EXECUTE ON FUNCTION public.notify_new_order() TO service_role;
GRANT EXECUTE ON FUNCTION public.notify_order_status_change() TO service_role;
GRANT EXECUTE ON FUNCTION public.notify_new_bonus() TO service_role;
GRANT EXECUTE ON FUNCTION public.notify_bonus_status_change() TO service_role;
GRANT EXECUTE ON FUNCTION public.notify_new_chatwoot_message() TO service_role;
GRANT EXECUTE ON FUNCTION public.notify_network_relationship_created() TO service_role;
GRANT EXECUTE ON FUNCTION public.notify_network_metrics_updated() TO service_role;
GRANT EXECUTE ON FUNCTION public.notify_customer_event() TO service_role;
GRANT EXECUTE ON FUNCTION public.get_subscription_filters(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_subscribe(TEXT, UUID) TO authenticated;

-- ---------------------------------------------------------------------
-- Configuração de filas para eventos (para pg_cron se disponível)
-- ---------------------------------------------------------------------

-- Tabela para fila de eventos
CREATE TABLE IF NOT EXISTS public.event_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    event_data JSONB NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    scheduled_at TIMESTAMPTZ DEFAULT now(),
    processed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS event_queue_status_idx ON public.event_queue(status);
CREATE INDEX IF NOT EXISTS event_queue_scheduled_at_idx ON public.event_queue(scheduled_at);
CREATE INDEX IF NOT EXISTS event_queue_event_type_idx ON public.event_queue(event_type);

-- RLS para event_queue
ALTER TABLE public.event_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Event Queue admin all" ON public.event_queue FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Função para enfileirar evento
CREATE OR REPLACE FUNCTION public.enqueue_event(event_type TEXT, event_data JSONB, scheduled_at TIMESTAMPTZ DEFAULT now())
RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO public.event_queue (event_type, event_data, scheduled_at)
    VALUES (event_type, event_data, COALESCE(scheduled_at, now()))
    RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para processar eventos da fila
CREATE OR REPLACE FUNCTION public.process_event_queue()
RETURNS INTEGER AS $$
DECLARE
    processed_count INTEGER DEFAULT 0;
    event_record RECORD;
BEGIN
    FOR event_record IN
        SELECT id, event_type, event_data
        FROM public.event_queue
        WHERE status = 'pending'
        AND scheduled_at <= now()
        ORDER BY scheduled_at ASC
        LIMIT 100
    LOOP
        BEGIN
            UPDATE public.event_queue
            SET status = 'processing',
                attempts = attempts + 1
            WHERE id = event_record.id;
            
            -- Processar evento baseado no tipo
            CASE event_record.event_type
                WHEN 'refresh_customer_metrics' THEN
                    PERFORM public.update_customer_metrics((event_record.event_data->>'customer_id')::UUID);
                WHEN 'refresh_network_metrics' THEN
                    PERFORM public.update_network_metrics(event_record.event_data->>'distributor_id');
                WHEN 'send_notification' THEN
                    -- Lógica de envio de notificação
                    NULL;
                ELSE
                    -- Evento desconhecido
                    NULL;
            END CASE;
            
            UPDATE public.event_queue
            SET status = 'completed',
                processed_at = now()
            WHERE id = event_record.id;
            
            processed_count := processed_count + 1;
            
        EXCEPTION WHEN OTHERS THEN
            UPDATE public.event_queue
            SET status = CASE WHEN attempts >= max_attempts THEN 'failed' ELSE 'pending' END,
                error_message = SQLERRM
            WHERE id = event_record.id;
        END;
    END LOOP;
    
    RETURN processed_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.enqueue_event(TEXT, JSONB, TIMESTAMPTZ) TO service_role;
GRANT EXECUTE ON FUNCTION public.process_event_queue() TO service_role;
