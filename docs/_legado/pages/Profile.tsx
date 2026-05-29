import React, { useState, useEffect } from 'react';

import { User, Mail, Save, ArrowLeft } from 'lucide-react';
import { Navigate } from 'react-router-dom';

import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const Profile = () => {
  const { user, profile, loading, updateProfile } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || '',
        email: profile.email || user?.email || ''
      });
    }
  }, [profile, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-allin-orange"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await updateProfile({
        full_name: formData.fullName,
        email: formData.email
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso."
      });
    } catch (_error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-allin-bg-light-1 dark:bg-allin-bg-dark-1">
      
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          {/* Botão voltar */}
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-6 text-allin-dark dark:text-allin-white hover:text-allin-orange"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <Card className="backdrop-blur-sm bg-allin-white/90 dark:bg-allin-bg-dark-2/90 border-allin-orange/20 shadow-2xl">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-allin-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-allin-dark" />
              </div>
              <CardTitle className="text-2xl font-bold text-allin-dark dark:text-allin-white">
                Meu Perfil
              </CardTitle>
              <CardDescription className="text-allin-dark/70 dark:text-allin-white/70">
                Gerencie suas informações pessoais
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-allin-dark dark:text-allin-white">
                    <User className="w-4 h-4 inline mr-2" />
                    Nome Completo
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="bg-allin-white dark:bg-allin-bg-dark-3 border-allin-orange/30"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-allin-dark dark:text-allin-white">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-allin-white dark:bg-allin-bg-dark-3 border-allin-orange/30"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="bg-allin-orange/10 dark:bg-allin-orange/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-allin-dark dark:text-allin-white mb-2">
                    📊 Status da Conta
                  </h4>
                  <div className="text-sm text-allin-dark/70 dark:text-allin-white/70 space-y-1">
                    <p>• Tipo: {profile?.role === 'super_admin' ? 'Super Admin' : profile?.role === 'store_admin' ? 'Admin da Loja' : 'Usuário'}</p>
                    <p>• Membro desde: {new Date(profile?.created_at || '').toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-allin-orange hover:bg-allin-orange/90 text-allin-dark font-semibold py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Salvando...'
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;