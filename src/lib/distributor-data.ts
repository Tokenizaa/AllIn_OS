// Mock data layer for "Escritório do Distribuidor". Swap with Supabase later.

export const distributor = {
  id: "dist_001",
  nome: "Mariana Ribeiro",
  username: "mariana.ribeiro",
  email: "mariana.ribeiro@allin.io",
  telefone: "+55 11 98712-4400",
  cpf: "412.880.901-22",
  qualificacao: "Diamante" as const,
  proxima_qualificacao: "Black",
  progresso_qualificacao: 72,
  ativacao: "2023-04-12",
  plano: "Elite",
  plano_id: "plan_elite",
  status: "active" as const,
  cidade: "São Paulo",
  estado: "SP",
  avatar: null,
  link_loja: "https://loja.allin.io/mariana.ribeiro",
  score: 87,
  patrocinador: "Allin Black HQ",
  kyc_status: "approved" as const,
};

export const wallet = {
  saldo_disponivel: 18_420.55,
  saldo_bloqueado: 4_120.18,
  saldo_a_liberar: 9_240.22,
  total_ganho_mes: 22_812.4,
  total_ganho_ano: 187_410.62,
  proxima_liberacao: "2026-06-04",
};

export const kpis = {
  comissao_acumulada: 187_410.62,
  total_vendido: 412_990.18,
  pedidos_mes: 142,
  cadastros_diretos: 38,
  rede_total: 612,
  crescimento_rede_mes: 18.4,
  ticket_medio: 412.8,
  conversao_loja: 6.8,
};

export const salesSeries = Array.from({ length: 30 }).map((_, i) => ({
  day: `${i + 1}`,
  vendas: Math.round(2200 + Math.sin(i / 2.4) * 1100 + Math.random() * 1400),
  bonus: Math.round(700 + Math.cos(i / 3) * 380 + Math.random() * 420),
}));

export const networkGrowth = Array.from({ length: 12 }).map((_, i) => ({
  mes: ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][i],
  ativos: 220 + i * 32 + Math.floor(Math.random() * 22),
  novos: 18 + Math.floor(Math.random() * 28),
}));

export const bonusOrigin = [
  { name: "Unilevel", value: 38 },
  { name: "Binário", value: 27 },
  { name: "Recompra", value: 18 },
  { name: "Ativação", value: 12 },
  { name: "Carreira", value: 5 },
];

export const topProducts = [
  { name: "Allin Vita Complex", qtd: 142, receita: 41_165.8 },
  { name: "Kit Ativação Black", qtd: 28, receita: 55_720.0 },
  { name: "Allin Slim Pro", qtd: 96, receita: 19_104.0 },
  { name: "Allin Skin Renew", qtd: 64, receita: 22_336.0 },
  { name: "Allin Energy Shot", qtd: 320, receita: 15_968.0 },
];

export type OrderStatus = "pago" | "pendente" | "enviado" | "entregue" | "cancelado";
export interface DistOrder {
  id: string; numero: string; data: string; status: OrderStatus;
  total: number; itens: number; metodo: string; entrega: string; rastreio?: string;
  cliente: string; tipo: "consumo" | "recompra" | "ativacao";
}

const NAMES = ["Ana Souza","Carlos Lima","Bruna Costa","Pedro Alves","Júlia Mendes","Lucas Rocha","Camila Dias","Rafael Pinto","Fernanda Cruz","Diego Martins"];
export const distOrders: DistOrder[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `ord_${500 + i}`,
  numero: `#A${100400 + i}`,
  data: new Date(Date.now() - i * 86400000 * 1.2).toISOString(),
  status: (["pago","entregue","enviado","pendente","pago","entregue","cancelado"] as OrderStatus[])[i % 7],
  total: Math.round((180 + Math.random() * 1800) * 100) / 100,
  itens: 1 + Math.floor(Math.random() * 4),
  metodo: ["Pix","Cartão","Boleto","Carteira Allin"][i % 4],
  entrega: ["Sedex","PAC","Transportadora","Retirada"][i % 4],
  rastreio: i % 3 === 0 ? `BR${928000000 + i}LV` : undefined,
  cliente: NAMES[i % NAMES.length],
  tipo: (["consumo","recompra","ativacao"] as const)[i % 3],
}));

export interface NetworkNode {
  id: string; nome: string; nivel: number; qualificacao: string;
  ativo: boolean; vendas: number; rede: number; cidade: string;
}
export const networkNodes: NetworkNode[] = [
  { id: "n1", nome: "Você", nivel: 0, qualificacao: "Diamante", ativo: true, vendas: 412990, rede: 612, cidade: "São Paulo/SP" },
  ...Array.from({ length: 12 }).map((_, i) => ({
    id: `n${i + 2}`,
    nome: NAMES[i % NAMES.length],
    nivel: 1 + (i % 3),
    qualificacao: ["Bronze","Prata","Ouro","Diamante"][i % 4],
    ativo: i % 5 !== 0,
    vendas: Math.round(2000 + Math.random() * 22000),
    rede: Math.floor(Math.random() * 80),
    cidade: ["São Paulo/SP","Rio de Janeiro/RJ","Curitiba/PR","BH/MG","Salvador/BA"][i % 5],
  })),
];

export interface TimelineItem {
  id: string; type: "order" | "bonus" | "rank" | "withdraw" | "network" | "ai" | "doc";
  title: string; description: string; at: string;
}
export const timeline: TimelineItem[] = [
  { id: "t1", type: "ai", title: "Copiloto: oportunidade detectada", description: "3 clientes prontos para recompra nos próximos 5 dias.", at: new Date(Date.now() - 1 * 3600000).toISOString() },
  { id: "t2", type: "bonus", title: "Bônus binário creditado", description: "R$ 1.240,50 disponíveis em carteira.", at: new Date(Date.now() - 4 * 3600000).toISOString() },
  { id: "t3", type: "order", title: "Novo pedido recebido", description: "Pedido #A100412 — R$ 489,90 via Pix.", at: new Date(Date.now() - 9 * 3600000).toISOString() },
  { id: "t4", type: "network", title: "Novo cadastro direto", description: "Lucas Rocha entrou na sua rede.", at: new Date(Date.now() - 22 * 3600000).toISOString() },
  { id: "t5", type: "rank", title: "Próximo da qualificação Black", description: "Você atingiu 72% do volume necessário.", at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "t6", type: "withdraw", title: "Saque processado", description: "R$ 5.000,00 enviados via PIX.", at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "t7", type: "doc", title: "Documento aprovado", description: "Comprovante de endereço validado por IA.", at: new Date(Date.now() - 6 * 86400000).toISOString() },
];

export const aiInsights = [
  { id: "i1", severity: "success" as const, title: "Sua rede cresceu 18% no mês", detail: "Acima da média da sua qualificação (+9%). Mantenha o ritmo de cadastros diretos.", action: "Ver detalhes" },
  { id: "i2", severity: "warning" as const, title: "4 clientes em risco de churn", detail: "Frequência de recompra caiu. Sugerimos disparar campanha de reativação.", action: "Disparar" },
  { id: "i3", severity: "info" as const, title: "Oportunidade de upgrade: Black", detail: "Faltam R$ 8.200 em volume para você qualificar a Black neste ciclo.", action: "Plano de ação" },
  { id: "i4", severity: "success" as const, title: "Produto Vita Complex bombando", detail: "Sua conversão neste produto é 2.3× maior que a média.", action: "Criar campanha" },
];

export const plansCatalog = [
  { id: "starter", nome: "Starter", preco: 199, bonus: 12, geracoes: 3, beneficios: ["Loja virtual","Suporte básico","Treinamentos iniciantes"] },
  { id: "pro", nome: "Pro", preco: 499, bonus: 18, geracoes: 5, beneficios: ["Loja virtual","Suporte prioritário","Treinamentos completos","Materiais de marketing"] },
  { id: "elite", nome: "Elite", preco: 1290, bonus: 25, geracoes: 7, beneficios: ["Tudo do Pro","Copiloto IA","Campanhas automáticas","Acesso antecipado a lançamentos"], atual: true },
  { id: "black", nome: "Black", preco: 2990, bonus: 35, geracoes: 10, beneficios: ["Tudo do Elite","Mentorias exclusivas","Eventos VIP","Comissão liderança"], destaque: true },
];

export const documents = [
  { id: "d1", nome: "RG (frente)", status: "approved", date: "2023-04-12" },
  { id: "d2", nome: "RG (verso)", status: "approved", date: "2023-04-12" },
  { id: "d3", nome: "CPF", status: "approved", date: "2023-04-12" },
  { id: "d4", nome: "Comprovante de endereço", status: "approved", date: "2025-12-02" },
  { id: "d5", nome: "Contrato de distribuição", status: "approved", date: "2023-04-13" },
  { id: "d6", nome: "CNPJ MEI", status: "pending", date: "2026-05-22" },
] as const;

export const storeAnalytics = {
  visitas_mes: 4_280,
  visitas_var: 22.4,
  conversao: 6.8,
  conversao_var: 1.2,
  vendas_link: 142,
  vendas_var: 9.7,
  ticket_medio: 412.8,
  share_chart: Array.from({ length: 14 }).map((_, i) => ({
    day: `${i + 1}`,
    visitas: 180 + Math.floor(Math.random() * 240),
    vendas: 8 + Math.floor(Math.random() * 24),
  })),
};

export const downloadsLibrary = [
  { id: "dl1", title: "Onboarding do Distribuidor", category: "Treinamento", type: "video", duration: "18 min", new: true },
  { id: "dl2", title: "Plano de Marketing Allin 2026", category: "Estratégia", type: "pdf", size: "4.2 MB" },
  { id: "dl3", title: "Kit Campanha Vita Complex", category: "Campanha", type: "zip", size: "28 MB", new: true },
  { id: "dl4", title: "Apresentação Oportunidade", category: "Apresentação", type: "pdf", size: "8.1 MB" },
  { id: "dl5", title: "Stories prontos — Skin Renew", category: "Criativo", type: "zip", size: "62 MB" },
  { id: "dl6", title: "Masterclass: Construindo Líderes", category: "Treinamento", type: "video", duration: "1h 12min" },
  { id: "dl7", title: "Guia rápido: como qualificar Diamante", category: "Estratégia", type: "pdf", size: "2.4 MB" },
  { id: "dl8", title: "Roteiros de WhatsApp prontos", category: "Vendas", type: "pdf", size: "1.1 MB", new: true },
];

export const goals = [
  { id: "g1", title: "Cadastros diretos do mês", current: 38, target: 50, unit: "" },
  { id: "g2", title: "Volume pessoal (PV)", current: 21_400, target: 30_000, unit: "BRL" },
  { id: "g3", title: "Volume de equipe (GV)", current: 142_900, target: 180_000, unit: "BRL" },
  { id: "g4", title: "Recompras do mês", current: 64, target: 80, unit: "" },
];

export function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `há ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.floor(h / 24);
  return `há ${d} d`;
}