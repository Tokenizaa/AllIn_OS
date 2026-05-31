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
          bairro: string | null;
          cep: string | null;
          cidade: string | null;
          complemento: string | null;
          created_at: string | null;
          data_criacao: string | null;
          endereco: string | null;
          estado: string | null;
          id: string;
          id_comprador: string | null;
          metadata: Json | null;
          numero: string | null;
          patrocinador_comprador: string | null;
          qualification: string | null;
          telefone: string | null;
          updated_at: string | null;
          user_id: string | null;
          usuario: string | null;
        };
        Insert: {
          bairro?: string | null;
          cep?: string | null;
          cidade?: string | null;
          complemento?: string | null;
          created_at?: string | null;
          data_criacao?: string | null;
          endereco?: string | null;
          estado?: string | null;
          id?: string;
          id_comprador?: string | null;
          metadata?: Json | null;
          numero?: string | null;
          patrocinador_comprador?: string | null;
          qualification?: string | null;
          telefone?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          usuario?: string | null;
        };
        Update: {
          bairro?: string | null;
          cep?: string | null;
          cidade?: string | null;
          complemento?: string | null;
          created_at?: string | null;
          data_criacao?: string | null;
          endereco?: string | null;
          estado?: string | null;
          id?: string;
          id_comprador?: string | null;
          metadata?: Json | null;
          numero?: string | null;
          patrocinador_comprador?: string | null;
          qualification?: string | null;
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
        Relationships: [];
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
          uf?: string | null;
          updated_at?: string | null;
          usuario?: string | null;
          user_id?: string | null;
          valor_total?: string | null;
        };
        Relationships: [];
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
