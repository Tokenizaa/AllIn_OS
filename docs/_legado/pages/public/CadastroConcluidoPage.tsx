import React from 'react';

import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

const CadastroConcluidoPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Cadastro realizado com sucesso!
        </h2>
        
        <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          <p className="text-gray-600 mb-6">
            Obrigado por se cadastrar na nossa plataforma! Nossa equipe irá analisar seu cadastro e entrar em contato em até <strong>48 horas úteis</strong> para ativar sua loja.
          </p>
          
          <p className="text-gray-600 mb-8">
            Enviamos um e-mail de confirmação para o endereço informado. Caso não encontre na sua caixa de entrada, verifique a pasta de spam.
          </p>
          
          <div className="space-y-4">
            <Button asChild className="w-full bg-allin-orange hover:bg-allin-orange/90 text-white py-6 text-base">
              <Link to="/">
                Voltar para a página inicial
              </Link>
            </Button>
            
            <div className="text-sm text-gray-500">
              Dúvidas? Entre em contato conosco pelo e-mail{' '}
              <a href="mailto:suporte@allin.com.br" className="text-allin-orange hover:underline">
                suporte@allin.com.br
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroConcluidoPage;
