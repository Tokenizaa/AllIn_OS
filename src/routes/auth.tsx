import { createFileRoute, useRouter } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react'

import { Eye, EyeOff, Lock, Mail, User, ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'


const Auth = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Redirect se já estiver logado
  useEffect(() => {
    if (user && !loading) {
      router.navigate({ to: '/' });
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-allin-bg-light-1 to-allin-bg-light-2">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-allin-orange"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect via useEffect
  }

  const handleSubmit = async (e: React.FormEvent, action: 'login' | 'signup') => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (action === 'signup') {
        // Validações para cadastro
        if (!formData.fullName.trim()) {
          toast({
            title: "Campo obrigatório",
            description: "Por favor, insira seu nome completo.",
            variant: "destructive"
          });
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Senhas não coincidem",
            description: "Por favor, verifique se as senhas são iguais.",
            variant: "destructive"
          });
          return;
        }

        if (formData.password.length < 6) {
          toast({
            title: "Senha muito curta",
            description: "A senha deve ter pelo menos 6 caracteres.",
            variant: "destructive"
          });
          return;
        }

        const { error } = await signUp(formData.email, formData.password, formData.fullName);
        
        if (error) {
          toast({
            title: "Erro ao criar conta",
            description: error.message || "Tente novamente em alguns instantes.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Conta criada com sucesso!",
            description: "Você foi automaticamente conectado.",
          });
        }
      } else {
        // Login
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
          toast({
            title: "Erro ao fazer login",
            description: error.message || "Verifique suas credenciais e tente novamente.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Login realizado com sucesso!",
            description: "Bem-vindo de volta!",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro inesperado",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-allin-bg-light-1 via-allin-bg-light-2 to-allin-orange/10 p-4">
      <div className="w-full max-w-md">
        {/* Botão voltar */}
        <Button
          variant="ghost"
          onClick={() => router.navigate({ to: '/' })}
          className="mb-6 text-allin-dark hover:text-allin-orange"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao site
        </Button>

        <Card className="backdrop-blur-sm bg-allin-white/90 border-allin-orange/20 shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-allin-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-allin-dark" />
            </div>
            <CardTitle className="text-2xl font-bold text-allin-dark">
              Área do Distribuidor
            </CardTitle>
            <CardDescription className="text-allin-dark/70">
              Faça login ou crie sua conta para acessar o sistema
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Cadastrar</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={(e) => handleSubmit(e, 'login')} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-allin-dark">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-allin-white border-allin-orange/30"
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-allin-dark">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua senha"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="bg-allin-white border-allin-orange/30 pr-10"
                        disabled={isSubmitting}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-allin-dark/50 hover:text-allin-dark"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-allin-orange hover:bg-allin-orange/90 text-allin-dark font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={(e) => handleSubmit(e, 'signup')} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-allin-dark">
                      <User className="w-4 h-4 inline mr-2" />
                      Nome Completo
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="bg-allin-white border-allin-orange/30"
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-allin-dark">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-allin-white border-allin-orange/30"
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-allin-dark">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="bg-allin-white border-allin-orange/30 pr-10"
                        disabled={isSubmitting}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-allin-dark/50 hover:text-allin-dark"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password" className="text-allin-dark">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Confirmar Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Digite a senha novamente"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="bg-allin-white border-allin-orange/30 pr-10"
                        disabled={isSubmitting}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-allin-dark/50 hover:text-allin-dark"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-allin-orange/10 p-3 rounded-lg">
                    <p className="text-xs text-allin-dark/70">
                      Ao criar sua conta, você terá acesso ao sistema de distribuição 
                      e poderá gerenciar seus produtos e vendas.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-allin-orange hover:bg-allin-orange/90 text-allin-dark font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Acesso especial admin */}
            <div className="mt-6 pt-4 border-t border-allin-orange/20">
              <p className="text-center text-xs text-allin-dark/60">
                Administrador? Use o email especial para acesso direto ao painel.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/auth')({
  component: Auth,
})
