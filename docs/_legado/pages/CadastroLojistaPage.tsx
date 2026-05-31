import React, { useState } from 'react';

import { Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const CadastroLojistaPage = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    plano: 'afiliado',
    senha: '',
    confirmarSenha: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.senha !== formData.confirmarSenha) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Aqui você faria a chamada para a API de cadastro
      // const response = await api.post('/api/lojistas/cadastro', formData);
      
      // Simulando uma requisição assíncrona
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Sucesso!",
        description: "Cadastro realizado com sucesso! Em breve entraremos em contato.",
      });
      
      // Redireciona após o cadastro
      navigate('/seja-lojista');
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao realizar o cadastro. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Cadastro de Lojista
          </CardTitle>
          <CardDescription className="text-center">
            Preencha o formulário abaixo para se cadastrar como lojista
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                name="nome"
                type="text"
                required
                value={formData.nome}
                onChange={handleChange}
                placeholder="Seu nome completo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                name="telefone"
                type="tel"
                required
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                name="cpf"
                type="text"
                required
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="plano">Plano Desejado</Label>
              <select
                id="plano"
                name="plano"
                value={formData.plano}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="afiliado">Afiliado</option>
                <option value="avancado">Avançado</option>
                <option value="excelencia">Excelência</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                name="senha"
                type="password"
                required
                minLength={6}
                value={formData.senha}
                onChange={handleChange}
                placeholder="Crie uma senha"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmarSenha">Confirme sua senha</Label>
              <Input
                id="confirmarSenha"
                name="confirmarSenha"
                type="password"
                required
                minLength={6}
                value={formData.confirmarSenha}
                onChange={handleChange}
                placeholder="Confirme sua senha"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cadastrando...
                </>
              ) : 'Realizar Cadastro'}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary underline-offset-4 hover:underline">
                Faça login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CadastroLojistaPage;
