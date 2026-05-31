// src/components/admin/StoreCreationForm.tsx
import React, { useState } from 'react';

import { useForm, Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useStoreSettings } from '@/contexts/StoreSettingsContext';
import { useToast } from '@/hooks/use-toast';
import { storeManagementService } from '@/services/storeManagementService';
import { StoreFormData } from '@/types/store';

const StoreCreationForm = () => {
  const { toast } = useToast();
  const { updateSettings } = useStoreSettings();
  const { register, handleSubmit, control, formState: { errors }, reset, watch } = useForm<StoreFormData>({
    defaultValues: {
      name: '',
      slug: '',
      category: 'Calçados Terapêuticos',
      city: '',
      description: '',
      rating: 5,
      reviewCount: 0,
      specialties: ['', '', '', ''],
      contact: {
        whatsapp: '',
        instagram: '',
        email: '',
        address: ''
      },
      primaryColor: '#F2A801',
      secondaryColor: '#1a202c',
      customMessage: '',
      sponsorLink: ''
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [banners, setBanners] = useState<File[]>([]);
  const slugValue = watch('slug');

  // Verificar disponibilidade do slug em tempo real
  const checkSlugAvailability = async (slug: string) => {
    if (slug) {
      const isAvailable = await storeManagementService.isSlugAvailable(slug);
      return isAvailable;
    }
    return true;
  };

  const onSubmit = async (data: StoreFormData) => {
    setIsSubmitting(true);
    
    try {
      // Verificar disponibilidade do slug antes de criar
      const isAvailable = await checkSlugAvailability(data.slug);
      if (!isAvailable) {
        toast({
          title: "Erro",
          description: "Já existe uma loja com este identificador. Por favor, escolha outro.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Salvar configurações no contexto
      updateSettings({
        whatsapp: data.contact.whatsapp,
        sponsorLink: data.sponsorLink || ''
      });
      
      await storeManagementService.createStore(data);
      
      toast({
        title: "Sucesso",
        description: "Loja criada com sucesso!"
      });
      
      // Resetar o formulário
      reset();
      setLogo(null);
      setBanners([]);
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar loja. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manipular mudança de especialidades
  const handleSpecialtyChange = (index: number, value: string) => {
    const specialties = watch('specialties');
    const newSpecialties = [...specialties];
    newSpecialties[index] = value;
    
    // Atualizar o valor no formulário
    reset({
      ...watch(),
      specialties: newSpecialties
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Criar Nova Loja</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Nome da Loja *</Label>
            <Input
              id="name"
              {...register('name', { required: 'Nome da loja é obrigatório' })}
              placeholder="Digite o nome da loja"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="slug">Identificador Único (slug) *</Label>
            <Input
              id="slug"
              {...register('slug', { 
                required: 'Identificador é obrigatório',
                pattern: {
                  value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                  message: 'Use apenas letras minúsculas, números e hífens'
                }
              })}
              placeholder="identificador-unico-loja"
            />
            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
            {slugValue && (
              <p className="text-sm text-gray-500 mt-1">
                URL da loja: /loja/{slugValue}
              </p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Input
              id="category"
              {...register('category')}
              placeholder="Categoria da loja"
            />
          </div>
          
          <div>
            <Label htmlFor="city">Cidade *</Label>
            <Input
              id="city"
              {...register('city', { required: 'Cidade é obrigatória' })}
              placeholder="Cidade - Estado"
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
          </div>
        </div>
        
        <div>
          <Label htmlFor="description">Descrição *</Label>
          <Textarea
            id="description"
            {...register('description', { required: 'Descrição é obrigatória' })}
            placeholder="Descreva sua loja"
            rows={4}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>
        
        {/* Cores Personalizadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="primaryColor">Cor Primária</Label>
            <div className="flex items-center gap-2">
              <Input
                id="primaryColor"
                type="color"
                {...register('primaryColor')}
                className="w-16 h-10 p-1"
              />
              <Input
                {...register('primaryColor')}
                placeholder="#F2A801"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="secondaryColor">Cor Secundária</Label>
            <div className="flex items-center gap-2">
              <Input
                id="secondaryColor"
                type="color"
                {...register('secondaryColor')}
                className="w-16 h-10 p-1"
              />
              <Input
                {...register('secondaryColor')}
                placeholder="#1a202c"
              />
            </div>
          </div>
        </div>
        
        {/* Mensagem Personalizada */}
        <div>
          <Label htmlFor="customMessage">Mensagem Personalizada</Label>
          <Textarea
            id="customMessage"
            {...register('customMessage')}
            placeholder="Digite uma mensagem de boas-vindas"
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="sponsorLink">Link de Patrocinador</Label>
          <Input
            id="sponsorLink"
            {...register('sponsorLink', {
              pattern: {
                value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                message: 'Por favor, insira uma URL válida'
              }
            })}
            placeholder="https://exemplo.com/patrocinador"
          />
          {errors.sponsorLink && <p className="text-red-500 text-sm mt-1">{errors.sponsorLink.message}</p>}
          <p className="text-sm text-gray-500 mt-1">Link para o perfil do patrocinador</p>
        </div>
        
        {/* Especialidades */}
        <div>
          <Label>Especialidades</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {[0, 1, 2, 3].map((index) => (
              <Input
                key={index}
                value={watch(`specialties.${index}`)}
                onChange={(e) => handleSpecialtyChange(index, e.target.value)}
                placeholder={`Especialidade ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Informações de Contato */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium mb-4">Informações de Contato</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="contact.whatsapp">WhatsApp *</Label>
              <Input
                id="contact.whatsapp"
                {...register('contact.whatsapp', { required: 'WhatsApp é obrigatório' })}
                placeholder="(00) 00000-0000"
              />
              {errors.contact?.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.contact.whatsapp.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="contact.instagram">Instagram</Label>
              <Input
                id="contact.instagram"
                {...register('contact.instagram')}
                placeholder="@seuinstagram"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <Label htmlFor="contact.email">Email</Label>
              <Input
                id="contact.email"
                type="email"
                {...register('contact.email')}
                placeholder="email@dominio.com"
              />
            </div>
            
            <div>
              <Label htmlFor="contact.address">Endereço</Label>
              <Input
                id="contact.address"
                {...register('contact.address')}
                placeholder="Endereço completo"
              />
            </div>
          </div>
        </div>
        
        {/* Upload de Imagens */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium mb-4">Imagens</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="logo">Logo</Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files?.[0] || null)}
              />
              <p className="text-sm text-gray-500 mt-1">Tamanho recomendado: 200x200 pixels</p>
            </div>
            
            <div>
              <Label htmlFor="banners">Banners (3 imagens)</Label>
              <Input
                id="banners"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    const fileList = Array.from(files);
                    setBanners(fileList.slice(0, 3)); // Limitar a 3 banners
                  }
                }}
              />
              <p className="text-sm text-gray-500 mt-1">Tamanho recomendado: 1200x400 pixels</p>
            </div>
          </div>
        </div>
        
        {/* Avaliação */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium mb-4">Avaliação</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="rating">Classificação (0-5)</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                {...register('rating', { 
                  required: 'Classificação é obrigatória',
                  min: { value: 0, message: 'A classificação mínima é 0' },
                  max: { value: 5, message: 'A classificação máxima é 5' }
                })}
              />
              {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="reviewCount">Número de Avaliações</Label>
              <Input
                id="reviewCount"
                type="number"
                min="0"
                {...register('reviewCount', { 
                  required: 'Número de avaliações é obrigatório',
                  min: { value: 0, message: 'O número mínimo de avaliações é 0' }
                })}
              />
              {errors.reviewCount && <p className="text-red-500 text-sm mt-1">{errors.reviewCount.message}</p>}
            </div>
          </div>
        </div>
        
        {/* Botão de Submissão */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="px-6 py-2"
          >
            {isSubmitting ? 'Criando Loja...' : 'Criar Loja'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StoreCreationForm;