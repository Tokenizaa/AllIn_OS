import axios from 'axios';

const EVOLUTION_API_URL = import.meta.env.VITE_EVOLUTION_API_URL || 'http://localhost:8089';
const EVOLUTION_API_KEY = import.meta.env.VITE_EVOLUTION_API_KEY || '429683C4C977415CAAFCCE10F7D57E11';
const EVOLUTION_API_INSTANCE = import.meta.env.VITE_EVOLUTION_INSTANCE || 'allin';

export interface EvolutionMessage {
  id: string;
  key: {
    id: string;
    remoteJid: string;
    fromMe: boolean;
    participant?: string;
  };
  message: {
    conversation?: string;
    extendedTextMessage?: {
      text: string;
    };
    imageMessage?: any;
    videoMessage?: any;
    audioMessage?: any;
    documentMessage?: any;
    stickerMessage?: any;
  };
  messageTimestamp: number;
  pushName?: string;
}

export interface EvolutionChat {
  id: string;
  name?: string;
  unreadCount: number;
  lastMessage: EvolutionMessage;
  timestamp: number;
  profilePicUrl?: string;
}

export interface EvolutionConversation {
  sessionId: string;
  contactName: string;
  contactPhone: string;
  messages: EvolutionMessage[];
  lastMessage: string;
  timestamp: number;
  unreadCount: number;
}

export class EvolutionApiService {
  private static client = axios.create({
    baseURL: EVOLUTION_API_URL,
    headers: {
      apikey: EVOLUTION_API_KEY,
      'Content-Type': 'application/json'
    },
    timeout: 30000
  });

  private static getInstancePath(path: string): string {
    return `${path}/${EVOLUTION_API_INSTANCE}`;
  }

  static extractMessageText(message: EvolutionMessage): string {
    if (message?.message?.conversation) return message.message.conversation;
    if (message?.message?.extendedTextMessage?.text) return message.message.extendedTextMessage.text;
    if (message?.message?.imageMessage?.caption) return `[Imagem] ${message.message.imageMessage.caption}`;
    if (message?.message?.videoMessage?.caption) return `[Vídeo] ${message.message.videoMessage.caption}`;
    if (message?.message?.audioMessage) return '[Áudio]';
    if (message?.message?.documentMessage?.fileName) return `[Documento] ${message.message.documentMessage.fileName}`;
    if (message?.message?.stickerMessage) return '[Sticker]';
    return '[Mídia]';
  }

  static async getChats(): Promise<EvolutionChat[]> {
    try {
      const response = await this.client.get(this.getInstancePath('/chat/findChats'), {
        params: { limit: 100 }
      });

      const payload = Array.isArray(response.data)
        ? response.data
        : response.data?.chats || response.data?.data || [];

      return payload.map((chat: any) => ({
        id: chat.id || chat.remoteJid,
        name: chat.name || chat.formattedTitle || chat.remoteJid,
        unreadCount: chat.unreadCount || 0,
        lastMessage: chat.lastMessage || {},
        timestamp: chat.lastMessage?.messageTimestamp || Date.now(),
        profilePicUrl: chat.profilePicUrl
      }));
    } catch (error) {
      console.error('Erro ao buscar chats:', error);
      return [];
    }
  }

  static async getChatMessages(chatId: string, limit = 50): Promise<EvolutionMessage[]> {
    try {
      const response = await this.client.get(this.getInstancePath('/chat/findMessages'), {
        params: { chatId, limit }
      });

      if (Array.isArray(response.data)) return response.data;
      return response.data?.messages || response.data?.data || [];
    } catch (error) {
      console.error('Erro ao buscar mensagens do chat:', error);
      return [];
    }
  }

  static async getAllConversations(): Promise<EvolutionConversation[]> {
    const chats = await this.getChats();
    const conversations: EvolutionConversation[] = [];

    for (const chat of chats) {
      if (!chat.id || chat.id.includes('@g.us') || !chat.lastMessage) continue;

      const messages = await this.getChatMessages(chat.id, 50);
      conversations.push({
        sessionId: chat.id,
        contactName: chat.name || chat.id.split('@')[0],
        contactPhone: chat.id.split('@')[0],
        messages,
        lastMessage: this.extractMessageText(chat.lastMessage),
        timestamp: chat.timestamp,
        unreadCount: chat.unreadCount
      });
    }

    return conversations.sort((a, b) => b.timestamp - a.timestamp);
  }

  static async sendTextMessage(number: string, text: string): Promise<any> {
    const normalizedNumber = number.replace(/\D/g, '');
    const response = await this.client.post(this.getInstancePath('/message/sendText'), {
      number: normalizedNumber,
      text
    });

    return response.data;
  }

  static async getInstanceStatus(): Promise<any> {
    const response = await this.client.get(this.getInstancePath('/instance/connectionState'));
    return response.data;
  }
}
