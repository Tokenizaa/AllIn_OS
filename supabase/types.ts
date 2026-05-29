export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      automations: {
        Row: {
          actions: Json;
          chatwoot_automation_id: number | null;
          conditions: Json;
          created_at: string;
          enabled: boolean | null;
          id: string;
          name: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          actions?: Json;
          chatwoot_automation_id?: number | null;
          conditions?: Json;
          created_at?: string;
          enabled?: boolean | null;
          id?: string;
          name: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          actions?: Json;
          chatwoot_automation_id?: number | null;
          conditions?: Json;
          created_at?: string;
          enabled?: boolean | null;
          id?: string;
          name?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      bots: {
        Row: {
          bot_type: string | null;
          chatwoot_bot_id: number | null;
          config: Json;
          created_at: string;
          description: string | null;
          enabled: boolean | null;
          id: string;
          inbox_id: number | null;
          name: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          bot_type?: string | null;
          chatwoot_bot_id?: number | null;
          config?: Json;
          created_at?: string;
          description?: string | null;
          enabled?: boolean | null;
          id?: string;
          inbox_id?: number | null;
          name: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          bot_type?: string | null;
          chatwoot_bot_id?: number | null;
          config?: Json;
          created_at?: string;
          description?: string | null;
          enabled?: boolean | null;
          id?: string;
          inbox_id?: number | null;
          name?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      campaigns: {
        Row: {
          audience_count: number;
          channel: string | null;
          chatwoot_campaign_id: number | null;
          created_at: string;
          delivered_count: number;
          id: string;
          name: string;
          read_count: number;
          reply_count: number;
          scheduled_at: string | null;
          sent_count: number;
          status: string;
          template: string;
          trigger_rules: Json | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          audience_count?: number;
          channel?: string | null;
          chatwoot_campaign_id?: number | null;
          created_at?: string;
          delivered_count?: number;
          id?: string;
          name: string;
          read_count?: number;
          reply_count?: number;
          scheduled_at?: string | null;
          sent_count?: number;
          status?: string;
          template: string;
          trigger_rules?: Json | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          audience_count?: number;
          channel?: string | null;
          chatwoot_campaign_id?: number | null;
          created_at?: string;
          delivered_count?: number;
          id?: string;
          name?: string;
          read_count?: number;
          reply_count?: number;
          scheduled_at?: string | null;
          sent_count?: number;
          status?: string;
          template?: string;
          trigger_rules?: Json | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      chatwoot_conversations: {
        Row: {
          campaign_id: string | null;
          chatwoot_contact_id: number | null;
          chatwoot_conversation_id: number;
          contact_name: string | null;
          contact_phone: string | null;
          created_at: string;
          id: string;
          last_message_at: string | null;
          lead_id: string | null;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          campaign_id?: string | null;
          chatwoot_contact_id?: number | null;
          chatwoot_conversation_id: number;
          contact_name?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          id?: string;
          last_message_at?: string | null;
          lead_id?: string | null;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          campaign_id?: string | null;
          chatwoot_contact_id?: number | null;
          chatwoot_conversation_id?: number;
          contact_name?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          id?: string;
          last_message_at?: string | null;
          lead_id?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chatwoot_conversations_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chatwoot_conversations_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      chatwoot_messages: {
        Row: {
          chatwoot_message_id: number;
          content: string | null;
          conversation_id: string;
          created_at: string;
          id: string;
          message_type: string | null;
          sender_type: string | null;
          user_id: string;
        };
        Insert: {
          chatwoot_message_id: number;
          content?: string | null;
          conversation_id: string;
          created_at?: string;
          id?: string;
          message_type?: string | null;
          sender_type?: string | null;
          user_id: string;
        };
        Update: {
          chatwoot_message_id?: number;
          content?: string | null;
          conversation_id?: string;
          created_at?: string;
          id?: string;
          message_type?: string | null;
          sender_type?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chatwoot_messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "chatwoot_conversations";
            referencedColumns: ["id"];
          },
        ];
      };
      customers: {
        Row: {
          activation_date: string | null;
          bairro: string | null;
          cpf: string | null;
          cep: string | null;
          customer_type: string | null;
          cidade: string | null;
          complemento: string | null;
          created_at: string | null;
          data_criacao: string | null;
          data_ultima_compra: string | null;
          endereco: string | null;
          estado: string | null;
          email: string | null;
          id: string;
          id_comprador: string | null;
          nome_completo: string | null;
          metadata: Json | null;
          numero: string | null;
          numero_pedidos: number | null;
          plan_id: string | null;
          plan_name: string | null;
          patrocinador_comprador: string | null;
          qualification: string | null;
          status: string | null;
          sponsor_id: string | null;
          total_compras: number | null;
          telefone: string | null;
          updated_at: string | null;
          user_id: string | null;
          usuario: string | null;
        };
        Insert: {
          activation_date?: string | null;
          bairro?: string | null;
          cpf?: string | null;
          cep?: string | null;
          customer_type?: string | null;
          cidade?: string | null;
          complemento?: string | null;
          created_at?: string | null;
          data_criacao?: string | null;
          data_ultima_compra?: string | null;
          endereco?: string | null;
          estado?: string | null;
          email?: string | null;
          id?: string;
          id_comprador?: string | null;
          nome_completo?: string | null;
          metadata?: Json | null;
          numero?: string | null;
          numero_pedidos?: number | null;
          plan_id?: string | null;
          plan_name?: string | null;
          patrocinador_comprador?: string | null;
          qualification?: string | null;
          status?: string | null;
          sponsor_id?: string | null;
          total_compras?: number | null;
          telefone?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          usuario?: string | null;
        };
        Update: {
          activation_date?: string | null;
          bairro?: string | null;
          cpf?: string | null;
          cep?: string | null;
          customer_type?: string | null;
          cidade?: string | null;
          complemento?: string | null;
          created_at?: string | null;
          data_criacao?: string | null;
          data_ultima_compra?: string | null;
          endereco?: string | null;
          estado?: string | null;
          email?: string | null;
          id?: string;
          id_comprador?: string | null;
          nome_completo?: string | null;
          metadata?: Json | null;
          numero?: string | null;
          numero_pedidos?: number | null;
          plan_id?: string | null;
          plan_name?: string | null;
          patrocinador_comprador?: string | null;
          qualification?: string | null;
          status?: string | null;
          sponsor_id?: string | null;
          total_compras?: number | null;
          telefone?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          usuario?: string | null;
        };
        Relationships: [];
      };
      import_rows: {
        Row: {
          codigo_pedido: string | null;
          comprador: string | null;
          created_at: string | null;
          custo_frete: string | null;
          data_criacao_pedido: string | null;
          data_pagamento_pedido: string | null;
          documento_cpf_cnpj: string | null;
          forma_pagamento: string | null;
          grupos_consumo: string | null;
          hora_criacao_pedido: string | null;
          hora_pagamento_pedido: string | null;
          id: string;
          import_id: string | null;
          informacoes_produtos: string | null;
          loja: string | null;
          normalized_data: Json | null;
          pagamentos: string | null;
          pedido_pago: string | null;
          raw_data: Json | null;
          status: string | null;
          updated_at: string | null;
          user_id: string | null;
          usuario: string | null;
          validation_errors: string[] | null;
          valor_total: string | null;
        };
        Insert: {
          codigo_pedido?: string | null;
          comprador?: string | null;
          created_at?: string | null;
          custo_frete?: string | null;
          data_criacao_pedido?: string | null;
          data_pagamento_pedido?: string | null;
          documento_cpf_cnpj?: string | null;
          forma_pagamento?: string | null;
          grupos_consumo?: string | null;
          hora_criacao_pedido?: string | null;
          hora_pagamento_pedido?: string | null;
          id?: string;
          import_id?: string | null;
          informacoes_produtos?: string | null;
          loja?: string | null;
          normalized_data?: Json | null;
          pagamentos?: string | null;
          pedido_pago?: string | null;
          raw_data?: Json | null;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          usuario?: string | null;
          validation_errors?: string[] | null;
          valor_total?: string | null;
        };
        Update: {
          codigo_pedido?: string | null;
          comprador?: string | null;
          created_at?: string | null;
          custo_frete?: string | null;
          data_criacao_pedido?: string | null;
          data_pagamento_pedido?: string | null;
          documento_cpf_cnpj?: string | null;
          forma_pagamento?: string | null;
          grupos_consumo?: string | null;
          hora_criacao_pedido?: string | null;
          hora_pagamento_pedido?: string | null;
          id?: string;
          import_id?: string | null;
          informacoes_produtos?: string | null;
          loja?: string | null;
          normalized_data?: Json | null;
          pagamentos?: string | null;
          pedido_pago?: string | null;
          raw_data?: Json | null;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          usuario?: string | null;
          validation_errors?: string[] | null;
          valor_total?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "staging_orders_detalhado_import_id_fkey";
            columns: ["import_id"];
            isOneToOne: false;
            referencedRelation: "imports";
            referencedColumns: ["id"];
          },
        ];
      };
      imports: {
        Row: {
          created_at: string;
          filename: string;
          file_path: string;
          id: string;
          import_type: string;
          invalid_rows: number;
          status: string;
          total_rows: number;
          updated_at: string;
          user_id: string;
          valid_rows: number;
        };
        Insert: {
          created_at?: string;
          filename: string;
          file_path: string;
          id?: string;
          import_type: string;
          invalid_rows?: number;
          status?: string;
          total_rows?: number;
          updated_at?: string;
          user_id: string;
          valid_rows?: number;
        };
        Update: {
          created_at?: string;
          filename?: string;
          file_path?: string;
          id?: string;
          import_type?: string;
          invalid_rows?: number;
          status?: string;
          total_rows?: number;
          updated_at?: string;
          user_id?: string;
          valid_rows?: number;
        };
        Relationships: [];
      };
      labels: {
        Row: {
          chatwoot_label_id: number | null;
          color: string | null;
          created_at: string;
          description: string | null;
          id: string;
          show_on_sidebar: boolean | null;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          chatwoot_label_id?: number | null;
          color?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          show_on_sidebar?: boolean | null;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          chatwoot_label_id?: number | null;
          color?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          show_on_sidebar?: boolean | null;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          city: string | null;
          created_at: string;
          email: string | null;
          id: string;
          last_interaction: string | null;
          name: string;
          orders_count: number;
          phone: string | null;
          score: number;
          source: string | null;
          status: string;
          tags: string[] | null;
          total_spent: number;
          uf: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          city?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          last_interaction?: string | null;
          name: string;
          orders_count?: number;
          phone?: string | null;
          score?: number;
          source?: string | null;
          status?: string;
          tags?: string[] | null;
          total_spent?: number;
          uf?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          city?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          last_interaction?: string | null;
          name?: string;
          orders_count?: number;
          phone?: string | null;
          score?: number;
          source?: string | null;
          status?: string;
          tags?: string[] | null;
          total_spent?: number;
          uf?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      macros: {
        Row: {
          actions: Json;
          chatwoot_macro_id: number | null;
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          shortcut_key: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          actions?: Json;
          chatwoot_macro_id?: number | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          shortcut_key?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          actions?: Json;
          chatwoot_macro_id?: number | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          shortcut_key?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          created_at: string | null;
          id: string;
          import_id: string | null;
          order_id: string | null;
          produto: string | null;
          quantidade: string | null;
          updated_at: string | null;
          user_id: string | null;
          valor: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          import_id?: string | null;
          order_id?: string | null;
          produto?: string | null;
          quantidade?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          valor?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          import_id?: string | null;
          order_id?: string | null;
          produto?: string | null;
          quantidade?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          valor?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_import_id_fkey";
            columns: ["import_id"];
            isOneToOne: false;
            referencedRelation: "imports";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items_normalized: {
        Row: {
          category: string | null;
          created_at: string | null;
          id: string;
          order_id: string | null;
          order_numero_pedido: string | null;
          product_code: string | null;
          product_id: string | null;
          product_name: string | null;
          quantity: number;
          size: string | null;
          unit_price: number;
          user_id: string;
          variant: string | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string | null;
          id?: string;
          order_id?: string | null;
          order_numero_pedido?: string | null;
          product_code?: string | null;
          product_id?: string | null;
          product_name?: string | null;
          quantity?: number;
          size?: string | null;
          unit_price?: number;
          user_id: string;
          variant?: string | null;
        };
        Update: {
          category?: string | null;
          created_at?: string | null;
          id?: string;
          order_id?: string | null;
          order_numero_pedido?: string | null;
          product_code?: string | null;
          product_id?: string | null;
          product_name?: string | null;
          quantity?: number;
          size?: string | null;
          unit_price?: number;
          user_id?: string;
          variant?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_normalized_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_normalized_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          cidade: string | null;
          comprador: string | null;
          created_at: string | null;
          data_criacao_pedido: string | null;
          data_pagamento_pedido: string | null;
          documento_cpf_cnpj: string | null;
          forma_pagamento: string | null;
          forma_entrega: string | null;
          hora_criacao_pedido: string | null;
          hora_pagamento_pedido: string | null;
          id_comprador: string | null;
          id: string;
          import_id: string | null;
          informacoes_produtos: string | null;
          indicou: string | null;
          loja: string | null;
          normalized_data: Json | null;
          pagamentos: string | null;
          pedido_pago: string | null;
          patrocinador_comprador: string | null;
          payment_id: string | null;
          payment_method: string | null;
          payment_status: string | null;
          gateway_transaction_id: string | null;
          purchase_type: string | null;
          purchase_type_id: string | null;
          raw_data: Json | null;
          status: string | null;
          uf: string | null;
          updated_at: string | null;
          usuario: string | null;
          user_id: string | null;
          valor_total: string | null;
        };
        Insert: {
          cidade?: string | null;
          comprador?: string | null;
          created_at?: string | null;
          data_criacao_pedido?: string | null;
          data_pagamento_pedido?: string | null;
          documento_cpf_cnpj?: string | null;
          forma_pagamento?: string | null;
          forma_entrega?: string | null;
          hora_criacao_pedido?: string | null;
          hora_pagamento_pedido?: string | null;
          id_comprador?: string | null;
          id?: string;
          import_id?: string | null;
          informacoes_produtos?: string | null;
          indicou?: string | null;
          loja?: string | null;
          normalized_data?: Json | null;
          pagamentos?: string | null;
          pedido_pago?: string | null;
          patrocinador_comprador?: string | null;
          payment_id?: string | null;
          payment_method?: string | null;
          payment_status?: string | null;
          gateway_transaction_id?: string | null;
          purchase_type?: string | null;
          purchase_type_id?: string | null;
          raw_data?: Json | null;
          status?: string | null;
          uf?: string | null;
          updated_at?: string | null;
          usuario?: string | null;
          user_id?: string | null;
          valor_total?: string | null;
        };
        Update: {
          cidade?: string | null;
          comprador?: string | null;
          created_at?: string | null;
          data_criacao_pedido?: string | null;
          data_pagamento_pedido?: string | null;
          documento_cpf_cnpj?: string | null;
          forma_pagamento?: string | null;
          forma_entrega?: string | null;
          hora_criacao_pedido?: string | null;
          hora_pagamento_pedido?: string | null;
          id_comprador?: string | null;
          id?: string;
          import_id?: string | null;
          informacoes_produtos?: string | null;
          indicou?: string | null;
          loja?: string | null;
          normalized_data?: Json | null;
          pagamentos?: string | null;
          pedido_pago?: string | null;
          patrocinador_comprador?: string | null;
          payment_id?: string | null;
          payment_method?: string | null;
          payment_status?: string | null;
          gateway_transaction_id?: string | null;
          purchase_type?: string | null;
          purchase_type_id?: string | null;
          raw_data?: Json | null;
          status?: string | null;
          uf?: string | null;
          updated_at?: string | null;
          usuario?: string | null;
          user_id?: string | null;
          valor_total?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "customers_sponsor_id_fkey";
            columns: ["sponsor_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      templates: {
        Row: {
          category: string | null;
          chatwoot_template_id: number | null;
          content: string;
          created_at: string;
          id: string;
          shortcuts: string[] | null;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          category?: string | null;
          chatwoot_template_id?: number | null;
          content: string;
          created_at?: string;
          id?: string;
          shortcuts?: string[] | null;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          category?: string | null;
          chatwoot_template_id?: number | null;
          content?: string;
          created_at?: string;
          id?: string;
          shortcuts?: string[] | null;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      workspace_settings: {
        Row: {
          chatwoot_account_id: string | null;
          chatwoot_api_token: string | null;
          chatwoot_inbox_id: string | null;
          chatwoot_url: string | null;
          created_at: string;
          id: string;
          updated_at: string;
          user_id: string;
          webhook_secret: string;
        };
        Insert: {
          chatwoot_account_id?: string | null;
          chatwoot_api_token?: string | null;
          chatwoot_inbox_id?: string | null;
          chatwoot_url?: string | null;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id: string;
          webhook_secret?: string;
        };
        Update: {
          chatwoot_account_id?: string | null;
          chatwoot_api_token?: string | null;
          chatwoot_inbox_id?: string | null;
          chatwoot_url?: string | null;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id?: string;
          webhook_secret?: string;
        };
        Relationships: [];
      };
      admin_users: {
        Row: {
          created_at: string | null;
          email: string;
          id: string;
          last_login_at: string | null;
          name: string;
          permissions: string[] | null;
          role: string;
          status: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          id?: string;
          last_login_at?: string | null;
          name: string;
          permissions?: string[] | null;
          role: string;
          status?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          id?: string;
          last_login_at?: string | null;
          name?: string;
          permissions?: string[] | null;
          role?: string;
          status?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      audit_log: {
        Row: {
          action: string;
          created_at: string | null;
          entity_id: string | null;
          entity_type: string;
          error_message: string | null;
          id: string;
          ip_address: string | null;
          metadata: Json | null;
          new_value: Json | null;
          old_value: Json | null;
          success: boolean | null;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          action: string;
          created_at?: string | null;
          entity_id?: string | null;
          entity_type: string;
          error_message?: string | null;
          id?: string;
          ip_address?: string | null;
          metadata?: Json | null;
          new_value?: Json | null;
          old_value?: Json | null;
          success?: boolean | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          action?: string;
          created_at?: string | null;
          entity_id?: string | null;
          entity_type?: string;
          error_message?: string | null;
          id?: string;
          ip_address?: string | null;
          metadata?: Json | null;
          new_value?: Json | null;
          old_value?: Json | null;
          success?: boolean | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "customer_product_affinities_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "customer_product_affinities_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      campaign_intelligence: {
        Row: {
          campaign_name: string;
          created_at: string | null;
          id: string;
          macro_id: string | null;
          score: number | null;
          segment_code: string;
          template_id: string | null;
        };
        Insert: {
          campaign_name: string;
          created_at?: string | null;
          id?: string;
          macro_id?: string | null;
          score?: number | null;
          segment_code: string;
          template_id?: string | null;
        };
        Update: {
          campaign_name?: string;
          created_at?: string | null;
          id?: string;
          macro_id?: string | null;
          score?: number | null;
          segment_code?: string;
          template_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "customer_scores_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      customer_events: {
        Row: {
          created_at: string;
          customer_id: string | null;
          event_data: Json;
          event_type: string;
          id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          customer_id?: string | null;
          event_data?: Json;
          event_type: string;
          id?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          customer_id?: string | null;
          event_data?: Json;
          event_type?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "marketing_links_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "marketing_links_distributor_id_fkey";
            columns: ["distributor_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      customer_metrics: {
        Row: {
          categoria_favorita: string | null;
          created_at?: string;
          customer_id: string | null;
          dias_desde_ultima_compra: number | null;
          frequencia_compra: number | null;
          id: string;
          indicados_ativos: number | null;
          ltv: number | null;
          plano_atual: string | null;
          primeira_compra: string | null;
          produto_favorito: string | null;
          receita_rede: number | null;
          total_gasto: number | null;
          total_indicados: number | null;
          total_pedidos: number | null;
          updated_at?: string;
          upgrade_realizado: boolean | null;
          user_id: string;
          ultima_compra: string | null;
          volume_rede: number | null;
        };
        Insert: {
          categoria_favorita?: string | null;
          created_at?: string;
          customer_id?: string | null;
          dias_desde_ultima_compra?: number | null;
          frequencia_compra?: number | null;
          id?: string;
          indicados_ativos?: number | null;
          ltv?: number | null;
          plano_atual?: string | null;
          primeira_compra?: string | null;
          produto_favorito?: string | null;
          receita_rede?: number | null;
          total_gasto?: number | null;
          total_indicados?: number | null;
          total_pedidos?: number | null;
          updated_at?: string;
          upgrade_realizado?: boolean | null;
          user_id: string;
          ultima_compra?: string | null;
          volume_rede?: number | null;
        };
        Update: {
          categoria_favorita?: string | null;
          created_at?: string;
          customer_id?: string | null;
          dias_desde_ultima_compra?: number | null;
          frequencia_compra?: number | null;
          id?: string;
          indicados_ativos?: number | null;
          ltv?: number | null;
          plano_atual?: string | null;
          primeira_compra?: string | null;
          produto_favorito?: string | null;
          receita_rede?: number | null;
          total_gasto?: number | null;
          total_indicados?: number | null;
          total_pedidos?: number | null;
          updated_at?: string;
          upgrade_realizado?: boolean | null;
          user_id?: string;
          ultima_compra?: string | null;
          volume_rede?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "customer_metrics_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      customer_network_metrics: {
        Row: {
          active_days: number;
          active_network_size: number;
          created_at: string;
          customer_id: string;
          direct_indications: number;
          engagement_score: number;
          estimated_bonus: number;
          id: string;
          influence_score: number;
          leadership_score: number;
          network_revenue: number;
          plan: string | null;
          recurrence_score: number;
          total_network_size: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          active_days?: number;
          active_network_size?: number;
          created_at?: string;
          customer_id: string;
          direct_indications?: number;
          engagement_score?: number;
          estimated_bonus?: number;
          id?: string;
          influence_score?: number;
          leadership_score?: number;
          network_revenue?: number;
          plan?: string | null;
          recurrence_score?: number;
          total_network_size?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          active_days?: number;
          active_network_size?: number;
          created_at?: string;
          customer_id?: string;
          direct_indications?: number;
          engagement_score?: number;
          estimated_bonus?: number;
          id?: string;
          influence_score?: number;
          leadership_score?: number;
          network_revenue?: number;
          plan?: string | null;
          recurrence_score?: number;
          total_network_size?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      customer_plans: {
        Row: {
          activated_at: string | null;
          created_at: string | null;
          customer_id: string;
          expires_at: string | null;
          id: string;
          plan_id: string;
          status: string | null;
        };
        Insert: {
          activated_at?: string | null;
          created_at?: string | null;
          customer_id: string;
          expires_at?: string | null;
          id?: string;
          plan_id: string;
          status?: string | null;
        };
        Update: {
          activated_at?: string | null;
          created_at?: string | null;
          customer_id?: string;
          expires_at?: string | null;
          id?: string;
          plan_id?: string;
          status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "customer_plans_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "customer_plans_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "plans";
            referencedColumns: ["id"];
          },
        ];
      };
      customer_predictions: {
        Row: {
          created_at: string | null;
          customer_id: string;
          id: string;
          model_used: string;
          payload_json: Json;
          prediction_type: string;
        };
        Insert: {
          created_at?: string | null;
          customer_id: string;
          id?: string;
          model_used: string;
          payload_json: Json;
          prediction_type: string;
        };
        Update: {
          created_at?: string | null;
          customer_id?: string;
          id?: string;
          model_used?: string;
          payload_json?: Json;
          prediction_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "customer_predictions_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      customer_product_affinities: {
        Row: {
          customer_id: string | null;
          id: string;
          product_id: string | null;
          purchase_count: number | null;
          score: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          customer_id?: string | null;
          id?: string;
          product_id?: string | null;
          purchase_count?: number | null;
          score?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          customer_id?: string | null;
          id?: string;
          product_id?: string | null;
          purchase_count?: number | null;
          score?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "customer_product_affinities_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "customer_product_affinities_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      customer_scores: {
        Row: {
          ativacao_score: number | null;
          churn_score: number | null;
          created_at?: never;
          customer_id: string | null;
          engagement_score: number | null;
          id: string;
          influencia_score: number | null;
          rede_score: number | null;
          recompra_score: number | null;
          updated_at: string | null;
          upgrade_score: number | null;
          user_id: string;
        };
        Insert: {
          ativacao_score?: number | null;
          churn_score?: number | null;
          customer_id?: string | null;
          engagement_score?: number | null;
          id?: string;
          influencia_score?: number | null;
          rede_score?: number | null;
          recompra_score?: number | null;
          updated_at?: string | null;
          upgrade_score?: number | null;
          user_id: string;
        };
        Update: {
          ativacao_score?: number | null;
          churn_score?: number | null;
          customer_id?: string | null;
          engagement_score?: number | null;
          id?: string;
          influencia_score?: number | null;
          rede_score?: number | null;
          recompra_score?: number | null;
          updated_at?: string | null;
          upgrade_score?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "customer_scores_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      marketing_links: {
        Row: {
          campaign_id: string | null;
          campaign_name: string | null;
          conversions: number | null;
          created_at: string | null;
          created_by: string | null;
          distributor_id: string;
          distributor_name: string;
          expires_at: string | null;
          full_url: string;
          id: string;
          last_click_at: string | null;
          metadata: Json | null;
          slug: string;
          status: string;
          total_clicks: number | null;
          unique_clicks: number | null;
          updated_at: string | null;
        };
        Insert: {
          campaign_id?: string | null;
          campaign_name?: string | null;
          conversions?: number | null;
          created_at?: string | null;
          created_by?: string | null;
          distributor_id: string;
          distributor_name: string;
          expires_at?: string | null;
          full_url: string;
          id?: string;
          last_click_at?: string | null;
          metadata?: Json | null;
          slug: string;
          status?: string;
          total_clicks?: number | null;
          unique_clicks?: number | null;
          updated_at?: string | null;
        };
        Update: {
          campaign_id?: string | null;
          campaign_name?: string | null;
          conversions?: number | null;
          created_at?: string | null;
          created_by?: string | null;
          distributor_id?: string;
          distributor_name?: string;
          expires_at?: string | null;
          full_url?: string;
          id?: string;
          last_click_at?: string | null;
          metadata?: Json | null;
          slug?: string;
          status?: string;
          total_clicks?: number | null;
          unique_clicks?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "marketing_links_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "marketing_links_distributor_id_fkey";
            columns: ["distributor_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      network_relationships: {
        Row: {
          created_at: string;
          customer_id: string;
          id: string;
          level: number;
          root_customer_id: string;
          sponsor_customer_id: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          customer_id: string;
          id?: string;
          level: number;
          root_customer_id: string;
          sponsor_customer_id?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          customer_id?: string;
          id?: string;
          level?: number;
          root_customer_id?: string;
          sponsor_customer_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "network_relationships_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "network_relationships_root_customer_id_fkey";
            columns: ["root_customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "network_relationships_sponsor_customer_id_fkey";
            columns: ["sponsor_customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          amount: number;
          created_at: string;
          customer_id: string | null;
          gateway: string | null;
          gateway_id: string | null;
          gateway_transaction_id: string | null;
          id: string;
          idempotency_key: string | null;
          metadata: Json;
          order_id: string | null;
          paid_at: string | null;
          payment_method: string;
          payment_method_id: string | null;
          status: string;
          transaction_id: string | null;
          updated_at: string;
          user_id: string;
          webhook_processed_at: string | null;
          webhook_received: boolean | null;
        };
        Insert: {
          amount: number;
          created_at?: string;
          customer_id?: string | null;
          gateway?: string | null;
          gateway_id?: string | null;
          gateway_transaction_id?: string | null;
          id?: string;
          idempotency_key?: string | null;
          metadata?: Json;
          order_id?: string | null;
          paid_at?: string | null;
          payment_method: string;
          payment_method_id?: string | null;
          status?: string;
          transaction_id?: string | null;
          updated_at?: string;
          user_id: string;
          webhook_processed_at?: string | null;
          webhook_received?: boolean | null;
        };
        Update: {
          amount?: number;
          created_at?: string;
          customer_id?: string | null;
          gateway?: string | null;
          gateway_id?: string | null;
          gateway_transaction_id?: string | null;
          id?: string;
          idempotency_key?: string | null;
          metadata?: Json;
          order_id?: string | null;
          paid_at?: string | null;
          payment_method?: string;
          payment_method_id?: string | null;
          status?: string;
          transaction_id?: string | null;
          updated_at?: string;
          user_id?: string;
          webhook_processed_at?: string | null;
          webhook_received?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "payments_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      plan_bonuses: {
        Row: {
          bonus_percentage: number;
          bonus_type: string | null;
          created_at: string | null;
          generation: number;
          id: string;
          plan_id: string;
          required_directs: number | null;
        };
        Insert: {
          bonus_percentage: number;
          bonus_type?: string | null;
          created_at?: string | null;
          generation: number;
          id?: string;
          plan_id: string;
          required_directs?: number | null;
        };
        Update: {
          bonus_percentage?: number;
          bonus_type?: string | null;
          created_at?: string | null;
          generation?: number;
          id?: string;
          plan_id?: string;
          required_directs?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "plan_bonuses_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "plans";
            referencedColumns: ["id"];
          },
        ];
      };
      plans: {
        Row: {
          activation_fee: number | null;
          bonus_config: Json | null;
          created_at: string | null;
          description: string | null;
          direct_bonus_percentage: number | null;
          id: string;
          includes: string[] | null;
          is_active: boolean | null;
          is_affiliate: boolean | null;
          is_default: boolean | null;
          max_generations: number | null;
          metadata: Json | null;
          name: string;
          plan_type: string | null;
          price: number | null;
          slug: string;
          sort_order: number | null;
          updated_at: string | null;
        };
        Insert: {
          activation_fee?: number | null;
          bonus_config?: Json | null;
          created_at?: string | null;
          description?: string | null;
          direct_bonus_percentage?: number | null;
          id?: string;
          includes?: string[] | null;
          is_active?: boolean | null;
          is_affiliate?: boolean | null;
          is_default?: boolean | null;
          max_generations?: number | null;
          metadata?: Json | null;
          name: string;
          plan_type?: string | null;
          price?: number | null;
          slug: string;
          sort_order?: number | null;
          updated_at?: string | null;
        };
        Update: {
          activation_fee?: number | null;
          bonus_config?: Json | null;
          created_at?: string | null;
          description?: string | null;
          direct_bonus_percentage?: number | null;
          id?: string;
          includes?: string[] | null;
          is_active?: boolean | null;
          is_affiliate?: boolean | null;
          is_default?: boolean | null;
          max_generations?: number | null;
          metadata?: Json | null;
          name?: string;
          plan_type?: string | null;
          price?: number | null;
          slug?: string;
          sort_order?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      product_affinities: {
        Row: {
          co_occurrence_count: number | null;
          correlation_score: number | null;
          id: string;
          product_a_id: string | null;
          product_b_id: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          co_occurrence_count?: number | null;
          correlation_score?: number | null;
          id?: string;
          product_a_id?: string | null;
          product_b_id?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          co_occurrence_count?: number | null;
          correlation_score?: number | null;
          id?: string;
          product_a_id?: string | null;
          product_b_id?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_affinities_product_a_id_fkey";
            columns: ["product_a_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_affinities_product_b_id_fkey";
            columns: ["product_b_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_metrics: {
        Row: {
          clientes_unicos: number | null;
          frequencia_compra: number | null;
          id: string;
          product_id: string | null;
          recorrencia: number | null;
          ticket_medio_produto: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          clientes_unicos?: number | null;
          frequencia_compra?: number | null;
          id?: string;
          product_id?: string | null;
          recorrencia?: number | null;
          ticket_medio_produto?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          clientes_unicos?: number | null;
          frequencia_compra?: number | null;
          id?: string;
          product_id?: string | null;
          recorrencia?: number | null;
          ticket_medio_produto?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_metrics_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_variants: {
        Row: {
          attributes: Json | null;
          bonus_payment_percentage: number | null;
          created_at: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
          price: number;
          product_id: string;
          sku: string;
          stock: number | null;
          updated_at: string | null;
        };
        Insert: {
          attributes?: Json | null;
          bonus_payment_percentage?: number | null;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
          price: number;
          product_id: string;
          sku: string;
          stock?: number | null;
          updated_at?: string | null;
        };
        Update: {
          attributes?: Json | null;
          bonus_payment_percentage?: number | null;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          price?: number;
          product_id?: string;
          sku?: string;
          stock?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          active: boolean | null;
          attributes: Json | null;
          bonus_payment_percentage: number | null;
          category: string | null;
          cost_price: number | null;
          created_at: string | null;
          description: string | null;
          dimension_unit: string | null;
          external_product_code: string | null;
          height: number | null;
          id: string;
          images: Json | null;
          is_active: boolean | null;
          length: number | null;
          manufacturer: string | null;
          max_stock: number | null;
          metadata: Json | null;
          min_stock: number | null;
          name: string;
          price: number | null;
          sku: string | null;
          stock: number | null;
          updated_at: string | null;
          user_id: string | null;
          weight: number | null;
          weight_unit: string | null;
          width: number | null;
        };
        Insert: {
          active?: boolean | null;
          attributes?: Json | null;
          bonus_payment_percentage?: number | null;
          category?: string | null;
          cost_price?: number | null;
          created_at?: string | null;
          description?: string | null;
          dimension_unit?: string | null;
          external_product_code?: string | null;
          height?: number | null;
          id?: string;
          images?: Json | null;
          is_active?: boolean | null;
          length?: number | null;
          manufacturer?: string | null;
          max_stock?: number | null;
          metadata?: Json | null;
          min_stock?: number | null;
          name: string;
          price?: number | null;
          sku?: string | null;
          stock?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
          weight?: number | null;
          weight_unit?: string | null;
          width?: number | null;
        };
        Update: {
          active?: boolean | null;
          attributes?: Json | null;
          bonus_payment_percentage?: number | null;
          category?: string | null;
          cost_price?: number | null;
          created_at?: string | null;
          description?: string | null;
          dimension_unit?: string | null;
          external_product_code?: string | null;
          height?: number | null;
          id?: string;
          images?: Json | null;
          is_active?: boolean | null;
          length?: number | null;
          manufacturer?: string | null;
          max_stock?: number | null;
          metadata?: Json | null;
          min_stock?: number | null;
          name?: string;
          price?: number | null;
          sku?: string | null;
          stock?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
          weight?: number | null;
          weight_unit?: string | null;
          width?: number | null;
        };
        Relationships: [];
      };
      qualifications: {
        Row: {
          benefits: Json | null;
          conditions: Json | null;
          created_at: string | null;
          description: string | null;
          id: string;
          is_active: boolean | null;
          level: number | null;
          max_value: number | null;
          min_value: number | null;
          name: string;
          plan_id: string | null;
          qualification_type: string;
          required_plan_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          benefits?: Json | null;
          conditions?: Json | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          level?: number | null;
          max_value?: number | null;
          min_value?: number | null;
          name: string;
          plan_id?: string | null;
          qualification_type: string;
          required_plan_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          benefits?: Json | null;
          conditions?: Json | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          level?: number | null;
          max_value?: number | null;
          min_value?: number | null;
          name?: string;
          plan_id?: string | null;
          qualification_type?: string;
          required_plan_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "qualifications_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "plans";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "qualifications_required_plan_id_fkey";
            columns: ["required_plan_id"];
            isOneToOne: false;
            referencedRelation: "plans";
            referencedColumns: ["id"];
          },
        ];
      };
      shipments: {
        Row: {
          delivered_at: string | null;
          forma_entrega: string | null;
          id: string;
          metadata: Json | null;
          order_id: string;
          provider: string;
          provider_service: string | null;
          shipped_at: string | null;
          shipping_address: Json | null;
          shipping_status: string | null;
          tracking_code: string | null;
          updated_at: string | null;
        };
        Insert: {
          delivered_at?: string | null;
          forma_entrega?: string | null;
          id?: string;
          metadata?: Json | null;
          order_id: string;
          provider: string;
          provider_service?: string | null;
          shipped_at?: string | null;
          shipping_address?: Json | null;
          shipping_status?: string | null;
          tracking_code?: string | null;
          updated_at?: string | null;
        };
        Update: {
          delivered_at?: string | null;
          forma_entrega?: string | null;
          id?: string;
          metadata?: Json | null;
          order_id?: string;
          provider?: string;
          provider_service?: string | null;
          shipped_at?: string | null;
          shipping_address?: Json | null;
          shipping_status?: string | null;
          tracking_code?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "shipments_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
