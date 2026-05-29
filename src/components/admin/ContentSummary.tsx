import React, { useState, useEffect } from 'react';

import { FileText, Image, Video, PenTool, Eye, Calendar, TrendingUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentService } from '@/services/adminContentService';
import { ContentItem } from '@/services/adminContentService';

const getContentIcon = (type: ContentItem['type']) => {
  switch (type) {
    case 'article': return <FileText className="h-4 w-4" />;
    case 'image': return <Image className="h-4 w-4" />;
    case 'video': return <Video className="h-4 w-4" />;
    case 'blog': return <PenTool className="h-4 w-4" />;
    default: return <FileText className="h-4 w-4" />;
  }
};

const getContentColor = (type: ContentItem['type']) => {
  switch (type) {
    case 'article': return 'text-blue-500';
    case 'image': return 'text-green-500';
    case 'video': return 'text-purple-500';
    case 'blog': return 'text-orange-500';
    default: return 'text-gray-500';
  }
};

const getStatusColor = (status: ContentItem['status']) => {
  switch (status) {
    case 'draft': return 'bg-gray-100 text-gray-800';
    case 'published': return 'bg-green-100 text-green-800';
    case 'scheduled': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: ContentItem['status']) => {
  switch (status) {
    case 'draft': return 'Rascunho';
    case 'published': return 'Publicado';
    case 'scheduled': return 'Agendado';
    default: return status;
  }
};

export function ContentSummary() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [popularContent, setPopularContent] = useState<ContentItem[]>([]);
  const [stats, setStats] = useState({
    totalContent: 0,
    publishedContent: 0,
    draftContent: 0,
    scheduledContent: 0,
    totalViews: 0,
    avgViewsPerContent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Carregar todos os conteúdos
        const allContent = await ContentService.getAllContents();
        setContentItems(allContent);
        
        // Carregar conteúdos populares
        const popular = await ContentService.getPopularContents(3);
        setPopularContent(popular);
        
        // Carregar estatísticas
        const contentStats = await ContentService.getContentStats();
        setStats(contentStats);
        
      } catch (error) {
        console.error('Erro ao carregar dados do conteúdo:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center">
            <PenTool className="h-5 w-5 mr-2" />
            Gerenciamento de Conteúdo
          </CardTitle>
          <CardDescription>
            Carregando dados...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-allin-orange"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center">
          <PenTool className="h-5 w-5 mr-2" />
          Gerenciamento de Conteúdo
        </CardTitle>
        <CardDescription>
          Artigos, imagens e vídeos do site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium">Total de Conteúdos</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.totalContent}</p>
            <p className="text-xs text-muted-foreground mt-1">itens criados</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <Eye className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium">Publicados</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.publishedContent}</p>
            <p className="text-xs text-muted-foreground mt-1">itens no ar</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <PenTool className="h-5 w-5 text-gray-500 mr-2" />
              <span className="font-medium">Rascunhos</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.draftContent}</p>
            <p className="text-xs text-muted-foreground mt-1">itens em edição</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="font-medium">Agendados</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.scheduledContent}</p>
            <p className="text-xs text-muted-foreground mt-1">itens programados</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-teal-500 mr-2" />
              <span className="font-medium">Média de Visualizações</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.avgViewsPerContent}</p>
            <p className="text-xs text-muted-foreground mt-1">por conteúdo publicado</p>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Conteúdos Recentes</h4>
            <Button variant="outline">
              Criar Novo Conteúdo
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Título</th>
                  <th className="text-left py-2">Tipo</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Autor</th>
                  <th className="text-left py-2">Criado em</th>
                  <th className="text-left py-2">Visualizações</th>
                  <th className="text-right py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {contentItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3">{item.title}</td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <span className={`${getContentColor(item.type)} mr-2`}>
                          {getContentIcon(item.type)}
                        </span>
                        {item.type === 'article' && 'Artigo'}
                        {item.type === 'image' && 'Imagem'}
                        {item.type === 'video' && 'Vídeo'}
                        {item.type === 'blog' && 'Blog'}
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="py-3">{item.author}</td>
                    <td className="py-3">
                      {new Date(item.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3">
                      {item.views ? item.views.toLocaleString('pt-BR') : '-'}
                    </td>
                    <td className="text-right py-3">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <h4 className="font-medium mb-4">Conteúdo Mais Popular</h4>
            <div className="space-y-4">
              {popularContent.map((item) => (
                <div key={item.id} className="flex items-center">
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">{item.title}</h5>
                    <p className="text-xs text-muted-foreground">
                      {item.views?.toLocaleString('pt-BR')} visualizações
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <h4 className="font-medium mb-4">Tipos de Conteúdo</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Artigos</span>
                </div>
                <span className="font-medium">
                  {contentItems.filter(item => item.type === 'article').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image className="h-4 w-4 text-green-500 mr-2" />
                  <span>Imagens</span>
                </div>
                <span className="font-medium">
                  {contentItems.filter(item => item.type === 'image').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Video className="h-4 w-4 text-purple-500 mr-2" />
                  <span>Vídeos</span>
                </div>
                <span className="font-medium">
                  {contentItems.filter(item => item.type === 'video').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <PenTool className="h-4 w-4 text-orange-500 mr-2" />
                  <span>Blog</span>
                </div>
                <span className="font-medium">
                  {contentItems.filter(item => item.type === 'blog').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
