import React, { useState, useEffect } from 'react';

import { Loader2, ArrowLeft, ArrowRight, MapPin, User, Store, Lock, Check, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormTabs } from '@/components/ui/form-tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { states } from '@/lib/states-br';
import { cepService } from '@/services/cepService';
import { storeManagementService } from '@/services/storeManagementService';
import { StoreFormData } from '@/types/store';

type FormData = StoreFormData & {
  responsavel: string;
  cpf: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  senha: string;
  confirmarSenha: string;
  termosAceitos: boolean;
};

const CadastroLojaPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [activeTab, setActiveTab] = useState('dados-pessoais');
  const [logo, setLogo] = useState<File | null>(null);
  
  const { register, handleSubmit, control, watch, setValue, setError, clearErrors, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: '',
      slug: '',
      category: 'Calçados Tecnológicos',
      city: '',
      description: '',
      responsavel: '',
      cpf: '',
      telefone: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      senha: '',
      confirmarSenha: '',
      termosAceitos: false,
      specialties: ['Entrega Rápida', 'Produtos Originais', 'Atendimento Personalizado', 'Garantia'],
      contact: {
        whatsapp: '',
        instagram: '',
        email: '',
        address: ''
      },
      primaryColor: theme === 'dark' ? '#F2A801' : '#F2A801',
      secondaryColor: theme === 'dark' ? '#1a202c' : '#1a202c',
      customMessage: 'Bem-vindo à nossa loja!',
    }
  });

  // Watch para atualizar o endereço completo quando os campos mudarem
  const watchCep = useWatch({ control, name: 'cep' });
  const watchLogradouro = useWatch({ control, name: 'logradouro' });
  const watchNumero = useWatch({ control, name: 'numero' });
  const watchComplemento = useWatch({ control, name: 'complemento' });
  const watchBairro = useWatch({ control, name: 'bairro' });
  const watchCidade = useWatch({ control, name: 'cidade' });
  const watchUf = useWatch({ control, name: 'uf' });

  // Atualiza o endereço completo sempre que algum campo de endereço mudar
  useEffect(() => {
    const enderecoCompleto = [
      watchLogradouro,
      watchNumero ? `, ${watchNumero}` : '',
      watchComplemento ? ` - ${watchComplemento}` : '',
      watchBairro ? `, ${watchBairro}` : '',
      watchCidade ? `, ${watchCidade}` : '',
      watchUf ? ` - ${watchUf}` : '',
      watchCep ? `, CEP: ${formatCep(watchCep)}` : ''
    ].filter(Boolean).join('');

    setValue('contact.address', enderecoCompleto);
  }, [watchLogradouro, watchNumero, watchComplemento, watchBairro, watchCidade, watchUf, watchCep, setValue]);

  // Busca automática do CEP quando o campo CEP for preenchido
  useEffect(() => {
    const buscarCep = async () => {
      const cepLimpo = watchCep?.replace(/\D/g, '');
      
      if (cepLimpo?.length === 8) {
        setIsLoadingCep(true);
        try {
          const endereco = await cepService.buscarEndereco(cepLimpo);
          
          if (endereco) {
            setValue('logradouro', endereco.logradouro || '');
            setValue('bairro', endereco.bairro || '');
            setValue('cidade', endereco.localidade || '');
            setValue('uf', endereco.uf || '');
            clearErrors('cep');
            
            // Foca no campo número após preencher o CEP
            const numeroInput = document.getElementById('numero') as HTMLInputElement;
            if (numeroInput) {
              numeroInput.focus();
            }
            
            toast({
              title: "CEP encontrado!",
              description: "Endereço preenchido automaticamente.",
              variant: "default"
            });
          } else {
            setError('cep', { type: 'manual', message: 'CEP não encontrado' });
            toast({
              title: "CEP não encontrado",
              description: "Por favor, verifique o CEP informado.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error('Erro ao buscar CEP:', error);
          setError('cep', { type: 'manual', message: 'Erro ao buscar CEP' });
          toast({
            title: "Erro ao buscar CEP",
            description: "Não foi possível consultar o CEP. Tente novamente.",
            variant: "destructive"
          });
        } finally {
          setIsLoadingCep(false);
        }
      }
    };

    if (watchCep?.replace(/\D/g, '').length === 8) {
      buscarCep();
    }
  }, [watchCep, setValue, setError, clearErrors, toast]);

  const onSubmit = async (data: FormData) => {
    if (data.senha !== data.confirmarSenha) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }

    if (!data.termosAceitos) {
      toast({
        title: "Atenção",
        description: "Você precisa aceitar os termos e condições para se cadastrar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Preparar os dados da loja
      const storeData: StoreFormData = {
        name: data.name,
        slug: data.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        category: data.category,
        city: data.city,
        description: data.description,
        contact: {
          whatsapp: data.telefone,
          instagram: data.contact.instagram,
          email: data.contact.email,
          address: data.contact.address
        },
        specialties: data.specialties.filter(s => s.trim() !== ''),
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        customMessage: data.customMessage,
        sponsorLink: `https://allin.com.br/loja/${data.slug}`,
        rating: 0, // Valor padrão
        reviewCount: 0 // Valor padrão
      };

      // Aqui você faria a chamada para a API para criar a loja
      // const newStore = await storeManagementService.createStore(storeData);
      
      // Simulando uma requisição assíncrona
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Sucesso!",
        description: "Sua loja foi cadastrada com sucesso! Em breve nossa equipe entrará em contato para ativar seu cadastro.",
      });
      
      // Redirecionar para a página de confirmação
      navigate('/cadastro-concluido');
      
    } catch (error) {
      console.error('Erro ao cadastrar loja:', error);
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro ao tentar cadastrar sua loja. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatCep = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCep(e.target.value);
    setValue('cep', formattedValue);
  };

  const handleNextTab = () => {
    const tabs = ['dados-pessoais', 'dados-loja', 'endereco', 'seguranca'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handlePreviousTab = () => {
    const tabs = ['dados-pessoais', 'dados-loja', 'endereco', 'seguranca'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  // Definindo as abas do formulário
  const formTabs = [
    { value: 'dados-pessoais', label: 'Dados Pessoais', icon: <User size={16} /> },
    { value: 'dados-loja', label: 'Dados da Loja', icon: <Store size={16} /> },
    { value: 'endereco', label: 'Endereço', icon: <MapPin size={16} /> },
    { value: 'seguranca', label: 'Segurança', icon: <Lock size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 text-foreground hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>
        
        <Card className="border border-border">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-2xl font-bold text-center text-foreground">
              Cadastro de Lojista
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Preencha o formulário abaixo para se cadastrar como lojista em nossa plataforma
            </CardDescription>
            
            {/* Indicador de progresso */}
            <div className="w-full mt-6">
              <div className="flex justify-between mb-2">
                {formTabs.map((tab, index) => (
                  <div key={tab.value} className="flex flex-col items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        formTabs.findIndex(t => t.value === activeTab) >= index 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {formTabs.findIndex(t => t.value === activeTab) > index ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className="mt-2 text-xs text-muted-foreground">
                      {tab.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
                  style={{ 
                    width: `${((formTabs.findIndex(t => t.value === activeTab) + 1) / formTabs.length) * 100}%` 
                  }}
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <FormTabs 
              tabs={formTabs} 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              className="w-full"
            >
              {/* Aba de Dados Pessoais */}
              <div data-tab="dados-pessoais" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">Dados Pessoais</h3>
                  <p className="text-sm text-muted-foreground">
                    Preencha seus dados pessoais. Todos os campos são obrigatórios.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="responsavel" className="text-foreground">
                      Nome Completo do Responsável *
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="responsavel"
                        className="pl-10"
                        {...register('responsavel', { required: 'Este campo é obrigatório' })}
                        placeholder="Nome completo"
                      />
                    </div>
                    {errors.responsavel && (
                      <p className="text-sm text-destructive">{errors.responsavel.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Controller
                      name="cpf"
                      control={control}
                      rules={{ 
                        required: 'CPF é obrigatório',
                        pattern: {
                          value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                          message: 'CPF inválido'
                        }
                      }}
                      render={({ field: { onChange, value } }) => (
                        <Input
                          id="cpf"
                          value={value || ''}
                          onChange={(e) => {
                            const formattedValue = formatCPF(e.target.value);
                            onChange(formattedValue);
                          }}
                          placeholder="000.000.000-00"
                          maxLength={14}
                        />
                      )}
                    />
                    {errors.cpf && (
                      <p className="text-sm text-red-500">{errors.cpf.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone para Contato *</Label>
                    <Controller
                      name="telefone"
                      control={control}
                      rules={{ 
                        required: 'Telefone é obrigatório',
                        pattern: {
                          value: /\(\d{2}\) \d{5}-\d{4}/,
                          message: 'Telefone inválido'
                        }
                      }}
                      render={({ field: { onChange, value } }) => (
                        <Input
                          id="telefone"
                          value={value || ''}
                          onChange={(e) => {
                            const formattedValue = formatPhone(e.target.value);
                            onChange(formattedValue);
                          }}
                          placeholder="(00) 00000-0000"
                          maxLength={15}
                        />
                      )}
                    />
                    {errors.telefone && (
                      <p className="text-sm text-red-500">{errors.telefone.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact.email">E-mail *</Label>
                    <Input
                      id="contact.email"
                      type="email"
                      {...register('contact.email', { 
                        required: 'E-mail é obrigatório',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'E-mail inválido'
                        }
                      })}
                      placeholder="seu@email.com"
                    />
                    {errors.contact?.email && (
                      <p className="text-sm text-red-500">{errors.contact.email.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="senha">Senha *</Label>
                    <Input
                      id="senha"
                      type="password"
                      {...register('senha', { 
                        required: 'Senha é obrigatória',
                        minLength: {
                          value: 8,
                          message: 'A senha deve ter pelo menos 8 caracteres'
                        }
                      })}
                      placeholder="Crie uma senha"
                    />
                    {errors.senha && (
                      <p className="text-sm text-red-500">{errors.senha.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                    <Input
                      id="confirmarSenha"
                      type="password"
                      {...register('confirmarSenha', { 
                        required: 'Confirme sua senha',
                      })}
                      placeholder="Confirme sua senha"
                    />
                    {errors.confirmarSenha && (
                      <p className="text-sm text-red-500">{errors.confirmarSenha.message}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Seção de Dados da Loja */}
              <div className="space-y-4 border-b pb-6">
                <h3 className="text-lg font-medium">Dados da Loja</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Loja *</Label>
                  <Input
                    id="name"
                    {...register('name', { required: 'Nome da loja é obrigatório' })}
                    placeholder="Ex: Minha Loja All In"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Personalizada *</Label>
                  <div className="flex items-center">
                    <span className="bg-gray-100 border border-r-0 rounded-l-md px-3 py-2 text-sm text-gray-500">
                      allin.com.br/loja/
                    </span>
                    <Input
                      id="slug"
                      className="rounded-l-none"
                      {...register('slug', { 
                        required: 'URL é obrigatória',
                        pattern: {
                          value: /^[a-z0-9-]+$/,
                          message: 'Use apenas letras minúsculas, números e hífens'
                        }
                      })}
                      placeholder="sua-loja"
                    />
                  </div>
                  {errors.slug && (
                    <p className="text-sm text-red-500">{errors.slug.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Esta será a URL da sua loja: allin.com.br/loja/<span className="font-medium">{watch('slug') || 'sua-loja'}</span>
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria da Loja *</Label>
                    <select
                      id="category"
                      {...register('category', { required: 'Categoria é obrigatória' })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Calçados Terapêuticos">Calçados Terapêuticos</option>
                      <option value="Saúde e Bem-estar">Saúde e Bem-estar</option>
                      <option value="Moda">Moda</option>
                      <option value="Acessórios">Acessórios</option>
                      <option value="Outros">Outros</option>
                    </select>
                    {errors.category && (
                      <p className="text-sm text-red-500">{errors.category.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade/Estado *</Label>
                    <Input
                      id="city"
                      {...register('city', { required: 'Cidade/Estado é obrigatório' })}
                      placeholder="Ex: São Paulo - SP"
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500">{errors.city.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição da Loja *</Label>
                  <Textarea
                    id="description"
                    {...register('description', { 
                      required: 'Descrição é obrigatória',
                      minLength: {
                        value: 30,
                        message: 'A descrição deve ter pelo menos 30 caracteres'
                      }
                    })}
                    placeholder="Conte um pouco sobre sua loja e seus produtos..."
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Redes Sociais</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <span className="bg-gray-100 border border-r-0 rounded-l-md px-3 py-2 text-sm text-gray-500">
                        @
                      </span>
                      <Input
                        {...register('contact.instagram')}
                        className="rounded-l-none"
                        placeholder="seuinstagram"
                      />
                    </div>
                    <Input
                      {...register('contact.whatsapp')}
                      placeholder="Link do WhatsApp (opcional)"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact.address">Endereço da Loja</Label>
                  <Input
                    id="contact.address"
                    {...register('contact.address')}
                    placeholder="Endereço completo (opcional)"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Personalização</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryColor" className="block text-sm font-medium mb-1">
                        Cor Primária
                      </Label>
                      <div className="flex items-center">
                        <input
                          type="color"
                          id="primaryColor"
                          {...register('primaryColor')}
                          className="h-10 w-10 rounded-md border border-gray-300 cursor-pointer"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          {watch('primaryColor')}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="secondaryColor" className="block text-sm font-medium mb-1">
                        Cor Secundária
                      </Label>
                      <div className="flex items-center">
                        <input
                          type="color"
                          id="secondaryColor"
                          {...register('secondaryColor')}
                          className="h-10 w-10 rounded-md border border-gray-300 cursor-pointer"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          {watch('secondaryColor')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customMessage">Mensagem de Boas-vindas</Label>
                  <Input
                    id="customMessage"
                    {...register('customMessage')}
                    placeholder="Mensagem que aparecerá na página inicial da sua loja"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Destaques da Loja</Label>
                  <div className="space-y-2">
                    {[0, 1, 2, 3].map((index) => (
                      <div key={index} className="flex items-center">
                        <Input
                          {...register(`specialties.${index}` as const)}
                          placeholder={`Destaque ${index + 1} (opcional)`}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Estes destaques aparecerão na página inicial da sua loja
                  </p>
                </div>
              </div>
              
              {/* Aba de Endereço */}
              <div data-tab="endereco" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">Endereço da Loja</h3>
                  <p className="text-sm text-muted-foreground">
                    Informe o endereço completo da sua loja física (se houver).
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="cep" className="text-foreground">
                        CEP *
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex">
                          <Input
                            id="cep"
                            className="pl-10 rounded-r-none"
                            value={watch('cep') || ''}
                            onChange={handleCepChange}
                            placeholder="00000-000"
                            maxLength={9}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="rounded-l-none border-l-0"
                            onClick={async () => {
                              const cep = watch('cep');
                              if (cep) {
                                setIsLoadingCep(true);
                                try {
                                  const endereco = await cepService.buscarEndereco(cep.replace(/\D/g, ''));
                                  
                                  if (endereco) {
                                    setValue('logradouro', endereco.logradouro || '');
                                    setValue('bairro', endereco.bairro || '');
                                    setValue('cidade', endereco.localidade || '');
                                    setValue('uf', endereco.uf || '');
                                    clearErrors('cep');
                                    
                                    // Foca no campo número após preencher o CEP
                                    const numeroInput = document.getElementById('numero') as HTMLInputElement;
                                    if (numeroInput) {
                                      numeroInput.focus();
                                    }
                                    
                                    toast({
                                      title: "CEP encontrado!",
                                      description: "Endereço preenchido automaticamente.",
                                      variant: "default"
                                    });
                                  } else {
                                    setError('cep', { type: 'manual', message: 'CEP não encontrado' });
                                    toast({
                                      title: "CEP não encontrado",
                                      description: "Por favor, verifique o CEP informado.",
                                      variant: "destructive"
                                    });
                                  }
                                } catch (error) {
                                  console.error('Erro ao buscar CEP:', error);
                                  setError('cep', { type: 'manual', message: 'Erro ao buscar CEP' });
                                  toast({
                                    title: "Erro ao buscar CEP",
                                    description: "Não foi possível consultar o CEP. Tente novamente.",
                                    variant: "destructive"
                                  });
                                } finally {
                                  setIsLoadingCep(false);
                                }
                              }
                            }}
                            disabled={isLoadingCep || !watch('cep')}
                          >
                            {isLoadingCep ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Search className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      {errors.cep && (
                        <p className="text-sm text-destructive">{errors.cep.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="logradouro" className="text-foreground">
                        Logradouro *
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <Input
                          id="logradouro"
                          className="pl-10"
                          {...register('logradouro', { required: 'Logradouro é obrigatório' })}
                          placeholder="Rua, Avenida, etc."
                        />
                      </div>
                      {errors.logradouro && (
                        <p className="text-sm text-destructive">{errors.logradouro.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="numero" className="text-foreground">
                        Número *
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <Input
                          id="numero"
                          className="pl-10"
                          {...register('numero', { required: 'Número é obrigatório' })}
                          placeholder="Nº"
                        />
                      </div>
                      {errors.numero && (
                        <p className="text-sm text-destructive">{errors.numero.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2 md:col-span-3">
                      <Label htmlFor="complemento" className="text-foreground">
                        Complemento
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <Input
                          id="complemento"
                          className="pl-10"
                          {...register('complemento')}
                          placeholder="Apartamento, bloco, etc. (opcional)"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="bairro" className="text-foreground">
                        Bairro *
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <Input
                          id="bairro"
                          className="pl-10"
                          {...register('bairro', { required: 'Bairro é obrigatório' })}
                          placeholder="Bairro"
                        />
                      </div>
                      {errors.bairro && (
                        <p className="text-sm text-destructive">{errors.bairro.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cidade" className="text-foreground">
                        Cidade *
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <Input
                          id="cidade"
                          className="pl-10"
                          {...register('cidade', { required: 'Cidade é obrigatória' })}
                          placeholder="Cidade"
                        />
                      </div>
                      {errors.cidade && (
                        <p className="text-sm text-destructive">{errors.cidade.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="uf" className="text-foreground">
                        Estado *
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <select
                          id="uf"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...register('uf', { required: 'Estado é obrigatório' })}
                        >
                          <option value="">Selecione um estado</option>
                          {states.map((state) => (
                            <option key={state.uf} value={state.uf}>
                              {state.uf} - {state.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.uf && (
                        <p className="text-sm text-destructive">{errors.uf.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <Label className="text-foreground">
                      Endereço Completo
                    </Label>
                    <div className="p-4 bg-muted/30 rounded-md border border-border">
                      <p className="text-sm">
                        {watch('contact.address') || 'O endereço será preenchido automaticamente.'}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Este é o endereço que será exibido na sua loja.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handlePreviousTab}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleNextTab}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Próximo: Segurança <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </FormTabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CadastroLojaPage;
