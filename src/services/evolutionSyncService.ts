import { EvolutionApiService, EvolutionConversation } from './evolutionApiService';
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase usando as variáveis do .env
const supabaseUrl = 'https://oxypfvrdfdmxhkuxpkja.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94eXBmdnJkZmRteGhrdXhwa2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MDE2OTcsImV4cCI6MjA5MDA3NzY5N30.jWu4RzEI0xY5TpifotloJLNHP9lm6_OAD5FdSSrNbjE';

const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Serviço para sincronizar conversas da Evolution API com o banco de dados
 */
export class EvolutionSyncService {
  
  /**
   * Sincroniza todas as conversas da Evolution API com o Supabase
   */
  static async syncAllConversations(): Promise<void> {
    try {
      console.log('🔄 Iniciando sincronização de conversas...');
      
      // Buscar conversas da Evolution API
      const evolutionConversations = await EvolutionApiService.getAllConversations();
      
      console.log(`📊 Encontradas ${evolutionConversations.length} conversas na Evolution API`);
      
      for (const conv of evolutionConversations) {
        await this.syncConversation(conv);
      }
      
      console.log('✅ Sincronização concluída com sucesso!');
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
      throw error;
    }
  }
  
  /**
   * Sincroniza uma conversa específica
   */
  static async syncConversation(conversation: EvolutionConversation): Promise<void> {
    try {
      // Criar ou atualizar sessão de chat
      const { data: sessionData, error: sessionError } = await supabaseAdmin
        .from('chatbot_sessions')
        .upsert({
          session_id: conversation.sessionId,
          channel: 'whatsapp',
          status: 'active',
          contact_name: conversation.contactName,
          contact_phone: conversation.contactPhone,
          metadata: {
            last_message: conversation.lastMessage,
            unread_count: conversation.unreadCount,
            evolution_timestamp: conversation.timestamp
          },
          last_activity_at: new Date(conversation.timestamp).toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single();
        
      if (sessionError) {
        console.error('Erro ao sincronizar sessão:', sessionError);
        return;
      }
      
      // Sincronizar mensagens
      for (const message of conversation.messages) {
        await this.syncMessage(message, conversation.sessionId);
      }
      
    } catch (error) {
      console.error(`Erro ao sincronizar conversa ${conversation.sessionId}:`, error);
    }
  }
  
  /**
   * Sincroniza uma mensagem específica
   */
  private static async syncMessage(message: any, sessionId: string): Promise<void> {
    try {
      const isFromMe = message.key?.fromMe || false;
      const messageText = this.extractMessageText(message);
      
      if (!messageText) return; // Ignorar mensagens sem texto
      
      // Verificar se a mensagem já existe
      const { data: existingMessage } = await supabaseAdmin
        .from('chatbot_messages')
        .select('id')
        .eq('message_id', message.id)
        .single();
        
      if (existingMessage) return; // Mensagem já sincronizada
      
      // Inserir nova mensagem
      const { error: messageError } = await supabaseAdmin
        .from('chatbot_messages')
        .insert({
          message_id: message.id,
          session_id: sessionId,
          role: isFromMe ? 'assistant' : 'user',
          message: messageText,
          metadata: {
            key: message.key,
            messageTimestamp: message.messageTimestamp,
            pushName: message.pushName
          },
          created_at: new Date(message.messageTimestamp * 1000).toISOString()
        });
        
      if (messageError) {
        console.error('Erro ao sincronizar mensagem:', messageError);
      }
      
    } catch (error) {
      console.error('Erro ao sincronizar mensagem:', error);
    }
  }
  
  /**
   * Extrai o texto de uma mensagem da Evolution API
   */
  private static extractMessageText(message: any): string {
    if (message.message?.conversation) {
      return message.message.conversation;
    }
    if (message.message?.extendedTextMessage?.text) {
      return message.message.extendedTextMessage.text;
    }
    if (message.message?.imageMessage?.caption) {
      return `[Imagem] ${message.message.imageMessage.caption}`;
    }
    if (message.message?.videoMessage?.caption) {
      return `[Vídeo] ${message.message.videoMessage.caption}`;
    }
    if (message.message?.audioMessage) {
      return '[Áudio]';
    }
    if (message.message?.documentMessage?.fileName) {
      return `[Documento] ${message.message.documentMessage.fileName}`;
    }
    if (message.message?.stickerMessage) {
      return '[Sticker]';
    }
    return '';
  }
  
  /**
   * Busca conversas sincronizadas do Supabase
   */
  static async getSyncedConversations(): Promise<any[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('chatbot_sessions')
        .select(`
          *,
          chatbot_messages (
            id,
            role,
            message,
            created_at
          )
        `)
        .eq('channel', 'whatsapp')
        .order('last_activity_at', { ascending: false });
        
      if (error) {
        console.error('Erro ao buscar conversas sincronizadas:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar conversas sincronizadas:', error);
      return [];
    }
  }
  
  /**
   * Busca mensagens de uma sessão específica
   */
  static async getSessionMessages(sessionId: string): Promise<any[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('chatbot_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error('Erro ao buscar mensagens da sessão:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar mensagens da sessão:', error);
      return [];
    }
  }
  
  /**
   * Envia mensagem via Evolution API e sincroniza com o banco
   */
  static async sendMessageAndSync(number: string, text: string): Promise<any> {
    try {
      // Enviar mensagem via Evolution API
      const evolutionResponse = await EvolutionApiService.sendTextMessage(number, text);
      
      // Sincronizar a mensagem enviada
      // Nota: Idealmente, isso deveria ser feito via webhook quando a mensagem é confirmada
      
      return evolutionResponse;
    } catch (error) {
      console.error('Erro ao enviar e sincronizar mensagem:', error);
      throw error;
    }
  }
}
