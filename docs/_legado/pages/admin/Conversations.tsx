import { FormEvent, useMemo, useState } from 'react';

import { MessageSquare, RefreshCw, Search, Send } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { DirectEvolutionSession, useEvolutionDirect } from '@/hooks/useEvolutionDirect';

const Conversations = () => {
  const { sessions, loading, error, fetchConversations, sendMessage, getTodayConversationsCount } = useEvolutionDirect();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [draftMessage, setDraftMessage] = useState('');
  const [sending, setSending] = useState(false);

  const filteredSessions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return sessions;

    return sessions.filter((session) =>
      session.contactName.toLowerCase().includes(term) ||
      session.contactPhone.includes(term) ||
      session.lastMessage.toLowerCase().includes(term)
    );
  }, [sessions, searchTerm]);

  const selectedSession: DirectEvolutionSession | null = useMemo(
    () => filteredSessions.find((session) => session.sessionId === selectedSessionId) || null,
    [filteredSessions, selectedSessionId]
  );

  const onRefresh = async () => {
    await fetchConversations();
    toast({ title: 'Atualizado', description: 'Conversas sincronizadas com a Evolution API.' });
  };

  const onSendMessage = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedSession || !draftMessage.trim()) return;

    try {
      setSending(true);
      await sendMessage(selectedSession, draftMessage);
      setDraftMessage('');
    } catch (err: any) {
      toast({ title: 'Falha ao enviar', description: err.message || 'Não foi possível enviar a mensagem.', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="h-full flex items-center justify-center">Carregando conversas...</div>;
  }

  if (error) {
    return <div className="h-full flex items-center justify-center text-red-600">Erro: {error}</div>;
  }

  return (
    <div className="h-full bg-[#111b21] text-white flex flex-col">
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">WhatsApp Clone (Evolution)</h1>
          <p className="text-sm text-white/70">
            {sessions.length} conversas • {getTodayConversationsCount()} hoje
          </p>
        </div>
        <Button variant="secondary" onClick={onRefresh} className="bg-white/10 text-white hover:bg-white/20">
          <RefreshCw className="w-4 h-4 mr-2" />
          Sincronizar
        </Button>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[360px_1fr]">
        <aside className="border-r border-white/10 bg-[#202c33] flex flex-col min-h-0">
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
              <Input
                className="pl-9 bg-[#2a3942] border-none text-white placeholder:text-white/60"
                placeholder="Buscar conversa"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            {filteredSessions.map((session) => (
              <button
                key={session.sessionId}
                onClick={() => setSelectedSessionId(session.sessionId)}
                className={`w-full px-3 py-3 flex items-start gap-3 text-left border-b border-white/5 hover:bg-white/5 ${
                  selectedSessionId === session.sessionId ? 'bg-white/10' : ''
                }`}
              >
                <Avatar>
                  <AvatarFallback>{session.contactName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-center gap-2">
                    <p className="font-medium truncate">{session.contactName}</p>
                    <span className="text-xs text-white/50">
                      {new Date(session.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 truncate">{session.lastMessage || 'Sem mensagens'}</p>
                  <p className="text-xs text-white/50">+{session.contactPhone}</p>
                </div>
              </button>
            ))}
          </ScrollArea>
        </aside>

        <section className="flex flex-col min-h-0 bg-[#0b141a]">
          {selectedSession ? (
            <>
              <div className="px-4 py-3 border-b border-white/10 bg-[#202c33] flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{selectedSession.contactName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedSession.contactName}</p>
                  <p className="text-xs text-white/60">+{selectedSession.contactPhone}</p>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {selectedSession.messages.map((message) => (
                    <div key={message.id} className={`flex ${message.fromMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-3 py-2 rounded-lg ${message.fromMe ? 'bg-[#005c4b]' : 'bg-[#202c33]'}`}>
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        <p className="text-[11px] mt-1 text-white/60 text-right">
                          {new Date(message.timestamp).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <form onSubmit={onSendMessage} className="p-3 border-t border-white/10 flex items-center gap-2 bg-[#202c33]">
                <Input
                  placeholder="Digite uma mensagem"
                  className="bg-[#2a3942] border-none text-white placeholder:text-white/60"
                  value={draftMessage}
                  onChange={(e) => setDraftMessage(e.target.value)}
                />
                <Button type="submit" disabled={sending || !draftMessage.trim()} className="bg-[#00a884] hover:bg-[#00a884]/90">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-white/60">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3" />
                Selecione uma conversa para começar
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Conversations;
