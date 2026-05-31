Objetivo da análise:

Mapear TODOS os pontos da plataforma que podem ser integrados, automatizados ou controlados por fluxos do n8n. A análise deve ser 100% baseada no código real do projeto, sem inventar funcionalidades e sem sugerir correções.

Quero que você localize tudo o que o painel, backend e serviços atuais oferecem que possa ser acionado, consumido, controlado ou ampliado via workflows n8n.

Entregue especificamente:

1) Mapeamento completo de funcionalidades do frontend:
   - Todas as páginas, componentes e módulos.
   - Ações de usuário que podem gerar eventos (cliques, formulários, cadastros, updates, switches, botões).
   - Áreas onde o usuário interage com configurações, agentes, leads, instâncias, follow-ups, relatórios, status de serviços.
   - Pontos onde seria útil receber dados do n8n (dashboard, métricas, logs, status em tempo real).
   - Pontos onde seria útil enviar comandos ao n8n (atualizações, triggers, resets, configurações).

2) Mapeamento completo de APIs, webhooks e rotas:
   - Todas as rotas que o frontend consome.
   - Todos os endpoints internos ou externos.
   - Todos os webhooks já existentes.
   - Quais desses endpoints podem ser conectados a fluxos n8n.
   - Quais endpoints não existem, mas poderiam existir, com base no comportamento da interface.

3) Mapeamento completo de serviços e integrações:
   - Serviços de banco de dados.
   - Serviços de autenticação.
   - Serviços de terceiros (WhatsApp/Baileys, etc).
   - Pontos nesses serviços onde o n8n pode assumir, complementar ou ampliar o comportamento.

4) Identificação de eventos potenciais para automação:
   - Ações que o usuário faz manualmente e que podem virar workflows.
   - Processos repetitivos.
   - Pontos onde o frontend apenas exibe dados que o n8n poderia fornecer dinamicamente.
   - Funções internas que poderiam ser delegadas para fluxos n8n.
   - Estados do sistema que o n8n poderia monitorar ou modificar.

5) Mapeamento de dependências e relacionamentos:
   - Como cada parte da aplicação depende das outras.
   - Como a lógica atual pode conversar com o n8n.
   - Onde existe troca de dados que poderia ser substituída por chamadas ao n8n.

6) Entregue um DIAGRAMA DE INTEGRAÇÃO (em texto, formato árvore):
   - Seções do painel → funcionalidades → eventos → possíveis integrações n8n.

IMPORTANTE:
- Não sugira melhorias de código.
- Não refatore nada.
- Não invente endpoints.
- Apenas descreva o que existe e onde existem oportunidades de integração com n8n.
- Baseie-se exclusivamente no código.
- A análise deve ser exaustiva e completa.
