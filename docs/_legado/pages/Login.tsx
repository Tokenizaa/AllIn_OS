import React, { useState } from 'react';

import { Loader2, LogIn, Home } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, user, loading, isAdmin, isSuperAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Se já estiver autenticado, não mostrar a página de login
  if (user && (isAdmin || isSuperAdmin)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Email e senha são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      
      toast({
        title: "Login realizado!",
        description: "Bem-vindo de volta."
      });
    } catch (error: any) {
      console.error('Auth error:', error);
      
      let errorMessage = "Ocorreu um erro inesperado";
      
      if (error.message?.includes('Invalid login credentials') || error.message?.includes('Credenciais inválidas')) {
        errorMessage = "Email ou senha incorretos";
      }
      
      toast({
        title: "Erro na autenticação",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-allin-orange/10 to-allin-bg-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-allin-orange rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-allin-dark" />
          </div>
          <h1 className="text-3xl font-bold text-allin-dark mb-2">All-in Brasil</h1>
          <p className="text-allin-dark/60">Área Administrativa</p>
        </div>

        <Card className="border-allin-orange/20 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-allin-dark">
              Fazer Login
            </CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar o painel
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-allin-orange/20 focus:border-allin-orange"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-allin-orange/20 focus:border-allin-orange"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-allin-orange hover:bg-allin-orange/90 text-allin-dark"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Entrar
              </Button>
            </form>

            <div className="text-center pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="border-allin-orange text-allin-orange hover:bg-allin-orange/10 mb-3"
              >
                <Home className="w-4 h-4 mr-2" />
                Voltar ao Site
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}