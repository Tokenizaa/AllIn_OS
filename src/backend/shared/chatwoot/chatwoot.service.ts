import { logger } from "../observability/logger.service";

export interface ChatwootConfig {
  baseUrl: string;
  apiKey: string;
  inboxId?: string;
}

export interface ChatwootConversation {
  id: string;
  contactId: string;
  inboxId: string;
  status: "open" | "resolved" | "closed";
  messages: ChatwootMessage[];
}

export interface ChatwootMessage {
  id: string;
  content: string;
  messageType: "incoming" | "outgoing";
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    type: "user" | "contact";
  };
}

export class ChatwootService {
  private static instance: ChatwootService;
  private config: ChatwootConfig | null = null;

  private constructor() {}

  static getInstance(): ChatwootService {
    if (!ChatwootService.instance) {
      ChatwootService.instance = new ChatwootService();
    }
    return ChatwootService.instance;
  }

  configure(config: ChatwootConfig): void {
    this.config = config;
    logger.info("Chatwoot service configured", "chatwoot", { baseUrl: config.baseUrl });
  }

  private ensureConfigured(): void {
    if (!this.config) {
      throw new Error("Chatwoot service not configured. Call configure() first.");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    this.ensureConfigured();

    const url = `${this.config!.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      "api_access_token": this.config!.apiKey,
      ...options.headers,
    };

    logger.debug(`Chatwoot API request: ${options.method || "GET"} ${url}`, "chatwoot");

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error(`Chatwoot API error: ${response.status} ${error}`, "chatwoot", {
        url,
        status: response.status,
        error,
      });
      throw new Error(`Chatwoot API error: ${response.status} ${error}`);
    }

    return response.json();
  }

  // Create or get a conversation for a customer
  async createConversation(
    customerId: string,
    customerEmail: string,
    customerName: string,
    customerPhone?: string
  ): Promise<ChatwootConversation> {
    this.ensureConfigured();

    // First, create or get the contact
    const contact = await this.createOrUpdateContact(customerEmail, customerName, customerPhone);

    // Then, create a conversation
    const conversation = await this.request<{ conversation: any }>(`/api/v1/inboxes/${this.config!.inboxId}/contacts/${contact.id}/conversations`, {
      method: "POST",
      body: JSON.stringify({
        source_id: customerId,
        message: {
          content: "Conversation started from system",
        },
      }),
    });

    logger.info(`Created Chatwoot conversation for customer ${customerId}`, "chatwoot", {
      conversationId: conversation.conversation.id,
      contactId: contact.id,
    });

    return this.mapConversation(conversation.conversation);
  }

  // Create or update a contact
  async createOrUpdateContact(
    email: string,
    name: string,
    phone?: string
  ): Promise<{ id: string }> {
    this.ensureConfigured();

    // Try to find existing contact by email
    try {
      const existing = await this.request<{ payload: Array<{ id: string }> }>(
        `/api/v1/contacts/search?q=${encodeURIComponent(email)}`
      );

      if (existing.payload && existing.payload.length > 0) {
        // Update existing contact
        await this.request(`/api/v1/contacts/${existing.payload[0].id}`, {
          method: "PUT",
          body: JSON.stringify({
            name,
            phone_number: phone,
          }),
        });

        return existing.payload[0];
      }
    } catch (error) {
      // Contact not found, proceed to create
      logger.debug("Contact not found, creating new one", "chatwoot");
    }

    // Create new contact
    const contact = await this.request<{ payload: { id: string } }>("/api/v1/contacts", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        phone_number: phone,
      }),
    });

    return contact.payload;
  }

  // Send a message to a conversation
  async sendMessage(conversationId: string, content: string): Promise<void> {
    this.ensureConfigured();

    await this.request(`/api/v1/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify({
        content,
        message_type: "outgoing",
      }),
    });

    logger.info(`Sent message to conversation ${conversationId}`, "chatwoot", {
      conversationId,
      contentLength: content.length,
    });
  }

  // Get conversation messages
  async getMessages(conversationId: string): Promise<ChatwootMessage[]> {
    this.ensureConfigured();

    const response = await this.request<{ payload: any[] }>(
      `/api/v1/conversations/${conversationId}/messages`
    );

    return response.payload.map((msg) => this.mapMessage(msg));
  }

  // Update conversation status
  async updateConversationStatus(
    conversationId: string,
    status: "open" | "resolved" | "closed"
  ): Promise<void> {
    this.ensureConfigured();

    await this.request(`/api/v1/conversations/${conversationId}/toggle_status`, {
      method: "POST",
      body: JSON.stringify({ status }),
    });

    logger.info(`Updated conversation ${conversationId} status to ${status}`, "chatwoot");
  }

  // Add a note to the conversation timeline
  async addNote(conversationId: string, content: string): Promise<void> {
    this.ensureConfigured();

    await this.request(`/api/v1/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify({
        content,
        message_type: "outgoing",
        private: true,
      }),
    });

    logger.info(`Added note to conversation ${conversationId}`, "chatwoot");
  }

  // Get conversation by ID
  async getConversation(conversationId: string): Promise<ChatwootConversation | null> {
    this.ensureConfigured();

    try {
      const response = await this.request<{ payload: any }>(
        `/api/v1/conversations/${conversationId}`
      );

      return this.mapConversation(response.payload);
    } catch (error) {
      logger.error(`Failed to get conversation ${conversationId}`, "chatwoot", { error });
      return null;
    }
  }

  // Search conversations by customer
  async searchConversations(customerId: string): Promise<ChatwootConversation[]> {
    this.ensureConfigured();

    try {
      const response = await this.request<{ payload: any[] }>(
        `/api/v1/conversations?filter[source_id]=${customerId}`
      );

      return response.payload.map((conv) => this.mapConversation(conv));
    } catch (error) {
      logger.error(`Failed to search conversations for customer ${customerId}`, "chatwoot", { error });
      return [];
    }
  }

  private mapConversation(data: any): ChatwootConversation {
    return {
      id: data.id,
      contactId: data.contact_id,
      inboxId: data.inbox_id,
      status: data.status,
      messages: [], // Messages loaded separately
    };
  }

  private mapMessage(data: any): ChatwootMessage {
    return {
      id: data.id,
      content: data.content,
      messageType: data.message_type,
      createdAt: data.created_at,
      sender: data.sender
        ? {
            id: data.sender.id,
            name: data.sender.name,
            type: data.sender.type,
          }
        : undefined,
    };
  }
}

export const chatwootService = ChatwootService.getInstance();
