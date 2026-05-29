# PROMPT — CRIAR MÓDULO ENTERPRISE DE PAGAMENTOS, BÔNUS, PONTOS E GATEWAYS

Criar um sistema completo de pagamentos enterprise para a plataforma MLM/e-commerce integrado ao Supabase, preparado para múltiplos gateways, regras de bônus, cashback, pontos e pagamentos híbridos.

O sistema deve ser modular, escalável, desacoplado e pronto para operação multi-tenant.

---

# OBJETIVO

Criar toda infraestrutura de:

* meios de pagamento
* pagamentos híbridos
* pagamentos parciais
* bônus como saldo
* carteira digital
* pontos
* descontos
* PIX
* boleto
* pagamento na entrega
* integração gateway
* regras financeiras
* cashback
* split de pagamento
* auditoria financeira

Tudo integrado ao:

* ecommerce
* painel admin
* painel distribuidor
* pedidos
* planos
* bônus MLM

---

# GATEWAYS OBRIGATÓRIOS

Preparar arquitetura para:

* Belluno
* PagSeguro

Arquitetura deve permitir adicionar novos gateways futuramente sem alterar o core.

Criar:

* Payment Provider Interface
* Gateway Adapter Pattern
* Webhook Processor
* Retry Queue
* Event-driven payment flow

---

# MÉTODOS DE PAGAMENTO

Criar suporte para:

## PIX

* QRCode dinâmico
* copia e cola
* expiração
* webhook de confirmação
* pagamento instantâneo
* conciliação automática

## BOLETO

* geração automática
* vencimento
* segunda via
* webhook bancário
* juros/multa configuráveis

## CARTÃO

* crédito
* parcelamento
* tokenização
* antifraude preparado

## PAGAMENTO NA ENTREGA

* dinheiro
* maquininha
* confirmação manual
* aprovação operacional

## SALDO DE BÔNUS

Permitir pagar usando:

* bônus acumulado
* carteira
* saldo disponível

---

# PAGAMENTO HÍBRIDO

Permitir:

* parte bônus + parte PIX
* parte bônus + boleto
* parte bônus + cartão
* pontos + PIX
* desconto + bônus

Exemplo:

* produto R$ 100
* usuário usa R$ 50 bônus
* restante via PIX

---

# REGRA DE USO DE BÔNUS

Criar configuração dinâmica permitindo:

## Global

* permitir usar 50%
* permitir usar 100%
* bloquear bônus

## Por Produto

Selecionar:

* produtos permitidos
* produtos bloqueados
* percentual específico

Exemplo:

* tênis → aceita 50%
* plano → aceita 100%
* promoção → não aceita bônus

---

# SISTEMA DE PONTOS

Criar sistema de pontos enterprise.

Funcionalidades:

* acumular pontos
* converter pontos
* resgatar pontos
* pontos por compra
* pontos por indicação
* pontos por meta
* pontos expiráveis

Criar:

* carteira de pontos
* histórico
* regras
* engine de cálculo

---

# SISTEMA DE DESCONTOS

Criar engine de descontos.

Tipos:

* cupom
* desconto automático
* cashback
* desconto progressivo
* desconto por plano
* desconto por rede
* desconto por campanha

Regras:

* acumulativo
* exclusivo
* limite de uso
* validade
* produtos específicos

---

# TABELAS OBRIGATÓRIAS

Criar/refatorar:

## payments

Core de pagamentos

## payment_transactions

Transações detalhadas

## payment_methods

Métodos ativos

## payment_gateways

Gateways configurados

## gateway_webhooks

Logs de webhook

## wallets

Carteira financeira

## wallet_transactions

Movimentações da carteira

## bonus_wallets

Saldo de bônus

## bonus_transactions

Histórico de bônus

## points_wallets

Carteira de pontos

## points_transactions

Movimentações de pontos

## discount_rules

Regras de desconto

## coupons

Cupons

## cashback_transactions

Cashback

## payment_splits

Pagamentos híbridos

## payment_attempts

Tentativas de pagamento

## financial_audit_logs

Auditoria financeira

---

# FRONTEND ADMIN

Criar painel administrativo completo.

## Gestão de Gateways

* ativar/desativar
* credenciais
* ambiente sandbox/prod
* logs
* status

## Configuração de Bônus

* percentual permitido
* regras por produto
* regras globais
* campanhas

## Gestão Financeira

* pagamentos
* conciliação
* estornos
* chargebacks
* aprovações

## Dashboard Financeiro

* receita
* pagamentos aprovados
* pagamentos pendentes
* taxa de conversão
* inadimplência
* ticket médio

---

# FRONTEND DISTRIBUIDOR

Criar componentes modernos.

## Checkout Inteligente

Permitir:

* escolher forma de pagamento
* combinar pagamentos
* aplicar bônus
* aplicar pontos
* aplicar cupom

Mostrar:

* saldo disponível
* limite de bônus
* descontos aplicados
* cashback futuro

## Carteira

* saldo bônus
* saldo saque
* saldo pontos
* histórico

## Financeiro

* pagamentos
* extratos
* bônus recebidos
* cashback
* saque

---

# CHECKOUT MODERNO

Criar checkout enterprise semelhante:

* Stripe
* Shopify
* Mercado Pago

Recursos:

* realtime
* loading inteligente
* cálculo instantâneo
* UX mobile-first
* antifraude preparado

---

# EVENTOS E WEBHOOKS

Criar sistema event-driven.

Eventos:

* payment.created
* payment.approved
* payment.failed
* payment.refunded
* bonus.used
* points.used
* cashback.generated

Criar:

* retry automático
* dead letter queue
* logs completos

---

# IA FINANCEIRA

Adicionar IA nativa.

Funções:

* detectar fraude
* detectar comportamento suspeito
* previsão de inadimplência
* sugestão de desconto
* recomendação de campanha
* análise de conversão

---

# SEGURANÇA

Obrigatório:

* criptografia
* logs auditáveis
* idempotência
* antifraude
* proteção webhook
* validação server-side
* rate limiting

---

# PERFORMANCE

Obrigatório:

* realtime Supabase
* filas assíncronas
* processamento desacoplado
* cache
* paginação server-side
* materialized views analytics

---

# RESULTADO FINAL

Criar um sistema financeiro enterprise moderno e escalável.

O sistema deve parecer:

* Stripe
* Mercado Pago
* Shopify Payments
* Hotmart
* Monetizze

E NÃO:

* checkout legado
* ERP antigo
* sistema financeiro CRUD

Executar implementação completa:

* banco
* migrations
* frontend
* backend
* hooks
* APIs
* realtime
* webhooks
* dashboards
* componentes
* stores
* policies
* analytics
* automações

Sem perguntas.
