import { supabase } from '@/integrations/supabase/client';

export type N8nEvent =
  | 'new_lead'
  | 'new_distributor'
  | 'new_order'
  | 'order_paid'
  | 'plan_interest'
  | 'hot_conversation'
  | 'new_message'
  | 'custom';

export const dispatchN8nEvent = async (event: N8nEvent, data: Record<string, unknown>) => {
  try {
    const { data: result, error } = await supabase.functions.invoke('n8n-dispatch', {
      body: { event, data },
    });

    if (error) {
      console.error('n8n dispatch error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: result };
  } catch (err) {
    console.error('n8n dispatch failed:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};
