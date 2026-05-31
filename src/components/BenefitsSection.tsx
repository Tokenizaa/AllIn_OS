import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  HeadphonesIcon, 
  Award, 
  DollarSign,
  Clock,
  Shield
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import successTeam from "@/assets/success-team.jpg";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: "Múltiplas Fontes de Renda",
      description: "Afiliados ganham 20% em vendas online. Distribuidores lucram com vendas diretas (50% de desconto na compra) e ainda ganham 38% nas vendas pelo link!"
    },
    {
      icon: TrendingUp,
      title: "Mercado em Explosão",
      description: "Entre agora no setor wellness que cresce 15% ao ano e já movimenta mais de R$ 2.3 bilhões no Brasil - oportunidade limitada!"
    },
    {
      icon: Users,
      title: "Renda Exponencial",
      description: "Construa sua rede e multiplique seus ganhos com comissões em até 3 níveis: 5% + 3% + 2%. Quanto maior sua rede, maior seu rendimento passivo!"
    },
    {
      icon: BookOpen,
      title: "Sistema Completo",
      description: "Fornecemos tudo: treinamentos exclusivos, materiais prontos e estratégias comprovadas para você começar a vender desde o primeiro dia."
    },
    {
      icon: HeadphonesIcon,
      title: "Suporte Garantido",
      description: "Nunca estará sozinho! Atendimento especializado e IA disponível 24h para maximizar suas vendas e solucionar qualquer dúvida instantaneamente."
    },
    {
      icon: Award,
      title: "Produtos Revolucionários",
      description: "Tênis terapêuticos com tecnologia exclusiva que realmente funcionam e geram vendas recorrentes - 89% dos clientes compram novamente!"
    },
    {
      icon: Clock,
      title: "Liberdade Total",
      description: "Trabalhe quando e onde quiser - negócio 100% flexível para criar a vida que você sempre sonhou, com renda ilimitada."
    },
    {
      icon: Shield,
      title: "Segurança Financeira",
      description: "Empresa sólida, pagamentos garantidos em até 72h e sistema transparente para você acompanhar cada centavo dos seus ganhos."
    }
  ];

  const stats = [
    {
      number: "R$ 3.200",
      label: "Ganho médio mensal",
      sublabel: "distribuidores ativos"
    },
    {
      number: "72h",
      label: "Pagamento garantido",
      sublabel: "sem burocracia"
    },
    {
      number: "95%",
      label: "Satisfação comprovada",
      sublabel: "resultados reais"
    },
    {
      number: "+500",
      label: "Parceiros de sucesso",
      sublabel: "em todo Brasil"
    }
  ];

  return (
    <section id="beneficios" className="py-20 bg-allin-bg-light-3 dark:bg-allin-bg-dark-3">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-allin-dark dark:text-allin-white">
            Por Que Se Tornar <span className="text-allin-orange">Parte da All-in?</span>
          </h2>
          <p className="text-xl text-allin-dark/80 dark:text-allin-white/80 max-w-3xl mx-auto">
            Transforme sua realidade financeira com uma oportunidade única para quem quer <strong>resultados extraordinários.</strong>
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left - Image */}
          <div className="relative animate-slide-up glass-card">
            <img 
              src={successTeam} 
              alt="Equipe de sucesso Allin" 
              className="rounded-2xl shadow-2xl w-full transition-all duration-300 hover:scale-105"
            />
            <div className="absolute -bottom-6 -right-6 bg-allin-orange rounded-2xl p-6 text-allin-dark shadow-2xl transition-all duration-300 hover:scale-110 glass-card">
              <div className="text-center">
                <div className="text-3xl font-bold">+500</div>
                <div className="text-sm">Histórias de Sucesso</div>
              </div>
            </div>
          </div>

          {/* Right - Key Benefits */}
          <div className="space-y-6 animate-slide-up glass-card" style={{animationDelay: '0.2s'}}>
            <h3 className="text-3xl font-bold mb-8 text-allin-dark dark:text-allin-white">
              Vantagens <span className="text-allin-orange">Exclusivas</span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 border border-allin-orange rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1 glass-card">
                <div className="w-12 h-12 bg-allin-orange rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <TrendingUp className="w-6 h-6 text-allin-dark" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1 text-allin-dark dark:text-allin-white">Oportunidade em Ascensão</h4>
                  <p className="text-allin-dark/80 dark:text-allin-white/80">
                    Entre no mercado wellness que cresce 15% ao ano. 
                    <strong> Vagas limitadas</strong> para distribuidores em cada região!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 border border-allin-orange rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1 glass-card">
                <div className="w-12 h-12 bg-allin-orange rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <DollarSign className="w-6 h-6 text-allin-dark" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1 text-allin-dark dark:text-allin-white">Ganhos Multiplicados</h4>
                  <p className="text-allin-dark/80 dark:text-allin-white/80">
                    <strong>Como Afiliado:</strong> 20% sem investimento. 
                    <strong> Como Distribuidor:</strong> 50% na revenda + 38% nas vendas online + bônus em rede!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 border border-allin-orange rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1 glass-card">
                <div className="w-12 h-12 bg-allin-orange rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <Award className="w-6 h-6 text-allin-dark" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1 text-allin-dark dark:text-allin-white">Produtos Que Vendem Sozinhos</h4>
                  <p className="text-allin-dark/80 dark:text-allin-white/80">
                    Tênis terapêuticos com tecnologias exclusivas e patenteadas.
                    <strong> 89% de taxa de recompra</strong> - clientes voltam sempre!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-allin-orange rounded-2xl p-8 mb-16 text-allin-dark animate-slide-up glass-card">
          <h3 className="text-3xl font-bold text-center mb-8">Resultados Comprovados</h3>
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center transition-all duration-300 hover:scale-110">
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-sm opacity-90">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 border border-allin-orange group animate-slide-up glass-card" style={{animationDelay: `${0.1 * index}s`}}>
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-allin-orange rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110">
                  <benefit.icon className="w-8 h-8 text-allin-dark" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-allin-dark dark:text-allin-white">{benefit.title}</h3>
                <p className="text-allin-dark/80 dark:text-allin-white/80 text-sm leading-relaxed">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
