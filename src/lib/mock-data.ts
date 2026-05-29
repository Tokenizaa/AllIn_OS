// Mock data layer — emulates Customers, Orders, Products, MLM network, financial events.
// Swap with Supabase repository implementations later without touching UI.

export type Qualification = "Bronze" | "Prata" | "Ouro" | "Diamante" | "Black";
export type CustomerStatus = "active" | "pending" | "blocked" | "churned";

export interface Customer {
  id: string;
  nome_completo: string;
  email: string;
  telefone: string;
  cpf: string;
  qualification: Qualification;
  sponsor_id: string | null;
  plan_id: string;
  plan_name: string;
  total_compras: number;
  numero_pedidos: number;
  activation_date: string;
  status: CustomerStatus;
  city: string;
  state: string;
  score: number; // 0-100
  churn_risk: number; // 0-1
  ltv: number;
  metadata: Record<string, unknown>;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  variant?: string;
  category: string;
}

export interface Order {
  id: string;
  customer_id: string;
  numero_pedido: string;
  status_pedido: "pago" | "pendente" | "enviado" | "entregue" | "cancelado";
  valor_total_pedido: number;
  payment_status: "approved" | "pending" | "failed" | "refunded";
  payment_method: string;
  forma_entrega: string;
  purchase_type: "consumo" | "ativacao" | "recompra" | "upgrade";
  created_at: string;
  items: OrderItem[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  manufacturer: string;
  bonus_payment_percentage: number;
  status: "active" | "draft" | "archived";
}

export interface TimelineEvent {
  id: string;
  type: "order" | "payment" | "bonus" | "verification" | "activation" | "note" | "automation" | "risk";
  title: string;
  description: string;
  at: string;
  actor?: string;
}

export interface Insight {
  id: string;
  severity: "info" | "warning" | "critical" | "success";
  title: string;
  detail: string;
  action?: string;
  scope: string;
}

const FIRST = ["Ana","Carlos","Mariana","Rafael","Juliana","Pedro","Beatriz","Lucas","Fernanda","Gabriel","Camila","Diego","Patrícia","Thiago","Larissa","Vinícius"];
const LAST = ["Souza","Oliveira","Santos","Pereira","Rodrigues","Almeida","Ribeiro","Carvalho","Gomes","Martins","Araújo","Lima","Barbosa","Costa"];
const CITY = [["São Paulo","SP"],["Rio de Janeiro","RJ"],["Belo Horizonte","MG"],["Curitiba","PR"],["Porto Alegre","RS"],["Salvador","BA"],["Recife","PE"],["Fortaleza","CE"]];
const QUALS: Qualification[] = ["Bronze","Prata","Ouro","Diamante","Black"];

function seeded(n: number) {
  return () => (n = (n * 9301 + 49297) % 233280) / 233280;
}

const rand = seeded(42);
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

export const customers: Customer[] = Array.from({ length: 60 }).map((_, i) => {
  const first = pick(FIRST);
  const last = pick(LAST);
  const [city, state] = pick(CITY);
  const q = pick(QUALS);
  const orders = Math.floor(rand() * 40) + 1;
  const total = Math.round((orders * (120 + rand() * 800)) * 100) / 100;
  const score = Math.floor(40 + rand() * 60);
  return {
    id: `cus_${1000 + i}`,
    nome_completo: `${first} ${last}`,
    email: `${first}.${last}`.toLowerCase().normalize("NFD").replace(/[^a-z.]/g, "") + "@allin.io",
    telefone: `+55 11 9${Math.floor(10000000 + rand() * 89999999)}`,
    cpf: `${Math.floor(100 + rand() * 899)}.${Math.floor(100 + rand() * 899)}.${Math.floor(100 + rand() * 899)}-${Math.floor(10 + rand() * 89)}`,
    qualification: q,
    sponsor_id: i > 4 ? `cus_${1000 + Math.floor(rand() * i)}` : null,
    plan_id: `plan_${pick(["starter","pro","elite","black"])}`,
    plan_name: pick(["Starter","Pro","Elite","Black"]),
    total_compras: total,
    numero_pedidos: orders,
    activation_date: new Date(Date.now() - Math.floor(rand() * 800) * 86400000).toISOString(),
    status: pick(["active","active","active","pending","blocked","churned"]) as CustomerStatus,
    city, state,
    score,
    churn_risk: Math.round((1 - score / 100) * 100) / 100,
    ltv: Math.round(total * (1 + rand() * 2.5) * 100) / 100,
    metadata: {},
  };
});

export const products: Product[] = [
  { id: "prd_1", name: "Allin Vita Complex", description: "Suplemento premium multivitamínico.", category: "Saúde", price: 289.9, stock: 1240, sku: "VC-001", manufacturer: "Allin Labs", bonus_payment_percentage: 28, status: "active" },
  { id: "prd_2", name: "Allin Slim Pro", description: "Termogênico avançado.", category: "Performance", price: 199.0, stock: 870, sku: "SP-002", manufacturer: "Allin Labs", bonus_payment_percentage: 25, status: "active" },
  { id: "prd_3", name: "Allin Skin Renew", description: "Sérum regenerador.", category: "Beleza", price: 349.0, stock: 410, sku: "SR-003", manufacturer: "Allin Beauty", bonus_payment_percentage: 30, status: "active" },
  { id: "prd_4", name: "Kit Ativação Black", description: "Kit completo para ativação Black.", category: "Kits", price: 1990.0, stock: 95, sku: "KIT-BLK", manufacturer: "Allin", bonus_payment_percentage: 35, status: "active" },
  { id: "prd_5", name: "Allin Energy Shot", description: "Energético funcional 60ml.", category: "Performance", price: 49.9, stock: 3200, sku: "EN-005", manufacturer: "Allin Labs", bonus_payment_percentage: 18, status: "active" },
  { id: "prd_6", name: "Allin Detox Tea", description: "Chá detox 30 sachês.", category: "Saúde", price: 79.9, stock: 0, sku: "DT-006", manufacturer: "Allin Labs", bonus_payment_percentage: 22, status: "active" },
];

export const orders: Order[] = Array.from({ length: 120 }).map((_, i) => {
  const c = customers[Math.floor(rand() * customers.length)];
  const itemCount = 1 + Math.floor(rand() * 3);
  const items: OrderItem[] = Array.from({ length: itemCount }).map((__, j) => {
    const p = products[Math.floor(rand() * products.length)];
    const qty = 1 + Math.floor(rand() * 3);
    return {
      id: `oi_${i}_${j}`,
      order_id: `ord_${20000 + i}`,
      product_id: p.id,
      product_name: p.name,
      quantity: qty,
      unit_price: p.price,
      total_price: Math.round(p.price * qty * 100) / 100,
      category: p.category,
    };
  });
  const total = items.reduce((s, it) => s + it.total_price, 0);
  return {
    id: `ord_${20000 + i}`,
    customer_id: c.id,
    numero_pedido: `#${100000 + i}`,
    status_pedido: pick(["pago","pago","pago","pendente","enviado","entregue","cancelado"]) as Order["status_pedido"],
    valor_total_pedido: total,
    payment_status: pick(["approved","approved","approved","pending","failed"]) as Order["payment_status"],
    payment_method: pick(["Pix","Cartão","Boleto","Carteira Allin"]),
    forma_entrega: pick(["Sedex","PAC","Retirada","Transportadora"]),
    purchase_type: pick(["consumo","ativacao","recompra","upgrade"]) as Order["purchase_type"],
    created_at: new Date(Date.now() - Math.floor(rand() * 60) * 86400000).toISOString(),
    items,
  };
});

export function customerTimeline(customerId: string): TimelineEvent[] {
  const own = orders.filter((o) => o.customer_id === customerId).slice(0, 8);
  const base: TimelineEvent[] = own.map((o) => ({
    id: `tl_${o.id}`,
    type: "order",
    title: `Pedido ${o.numero_pedido} — ${o.status_pedido}`,
    description: `R$ ${o.valor_total_pedido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} via ${o.payment_method}`,
    at: o.created_at,
  }));
  base.unshift(
    { id: "tl_ai_1", type: "automation", title: "Copiloto sugeriu upgrade para Elite", description: "Score de oportunidade 87/100. Cliente próximo do limite de bônus.", at: new Date(Date.now() - 2 * 86400000).toISOString(), actor: "Allin IA" },
    { id: "tl_ai_2", type: "risk", title: "Risco moderado detectado", description: "Frequência de recompra caiu 22% no último ciclo.", at: new Date(Date.now() - 5 * 86400000).toISOString(), actor: "Anomaly Engine" },
    { id: "tl_b_1", type: "bonus", title: "Bônus binário pago", description: "R$ 412,80 creditado na carteira.", at: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: "tl_v_1", type: "verification", title: "Documentos verificados", description: "KYC concluído automaticamente.", at: new Date(Date.now() - 30 * 86400000).toISOString() },
  );
  return base.sort((a, b) => +new Date(b.at) - +new Date(a.at));
}

export const insights: Insight[] = [
  { id: "ins_1", severity: "critical", title: "Queda de 18% em ativações esta semana", detail: "Região Sudeste apresenta a maior queda. Sugerimos campanha de reativação direcionada.", action: "Criar campanha", scope: "Executivo" },
  { id: "ins_2", severity: "warning", title: "12 distribuidores com risco alto de churn", detail: "Modelo preditivo identificou padrões de inatividade. Trigger automático recomendado.", action: "Disparar workflow", scope: "CRM" },
  { id: "ins_3", severity: "success", title: "Produto Vita Complex superou meta em 142%", detail: "Recompra orgânica forte. Recomendado aumentar estoque +30%.", action: "Ajustar estoque", scope: "Comercial" },
  { id: "ins_4", severity: "info", title: "Rede binária balanceada em 94%", detail: "Pernas esquerda/direita dentro do desvio ideal.", scope: "MLM" },
  { id: "ins_5", severity: "warning", title: "Anomalia em saques", detail: "3 saques acima de 2σ do padrão histórico. Verificação manual recomendada.", action: "Revisar saques", scope: "Financeiro" },
];

export const kpis = {
  receita_mes: 4_287_540.22,
  receita_var: 12.4,
  pedidos_mes: 8_412,
  pedidos_var: 8.1,
  ativacoes_mes: 1_204,
  ativacoes_var: -3.2,
  ticket_medio: 509.7,
  ticket_var: 4.6,
  distribuidores_ativos: 28_410,
  distribuidores_var: 2.1,
  churn: 4.8,
  churn_var: -1.1,
};

export const revenueSeries = Array.from({ length: 30 }).map((_, i) => ({
  day: i + 1,
  receita: Math.round(80000 + Math.sin(i / 3) * 22000 + rand() * 30000),
  meta: 110000,
  ano_anterior: Math.round(70000 + Math.cos(i / 4) * 18000 + rand() * 20000),
}));

export const channelMix = [
  { name: "Loja Virtual", value: 48 },
  { name: "Recompra", value: 27 },
  { name: "Ativação", value: 15 },
  { name: "Upgrade", value: 10 },
];

export const networkLegs = [
  { name: "S1", esquerda: 4200, direita: 4100 },
  { name: "S2", esquerda: 3800, direita: 4400 },
  { name: "S3", esquerda: 5100, direita: 4900 },
  { name: "S4", esquerda: 4600, direita: 5200 },
  { name: "S5", esquerda: 4800, direita: 5050 },
  { name: "S6", esquerda: 5400, direita: 5300 },
];

export const alerts = [
  { id: "a1", severity: "critical" as const, title: "3 saques pendentes > R$ 50k", at: "há 12 min", domain: "Financeiro" },
  { id: "a2", severity: "warning" as const, title: "Estoque crítico: Allin Detox Tea", at: "há 38 min", domain: "Comercial" },
  { id: "a3", severity: "info" as const, title: "Novo qualificado Diamante", at: "há 1 h", domain: "MLM" },
  { id: "a4", severity: "warning" as const, title: "Taxa de erro do gateway acima de 2%", at: "há 2 h", domain: "Sistema" },
];

export function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
