import React from 'react';

import { MessageSquare, ThumbsUp, ThumbsDown, Star, TrendingUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface FeedbackItem {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: Date;
  category: 'product' | 'service' | 'support' | 'general';
}

const feedback: FeedbackItem[] = [
  {
    id: '1',
    user: 'João Silva',
    rating: 5,
    comment: 'Excelente atendimento e produtos de qualidade!',
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    category: 'service'
  },
  {
    id: '2',
    user: 'Maria Santos',
    rating: 4,
    comment: 'Produto muito bom, mas poderia ter mais opções de cores.',
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    category: 'product'
  },
  {
    id: '3',
    user: 'Carlos Oliveira',
    rating: 3,
    comment: 'Entrega dentro do prazo, mas o chatbot poderia ser mais preciso.',
    date: new Date(new Date().setDate(new Date().getDate() - 3)),
    category: 'support'
  },
  {
    id: '4',
    user: 'Ana Costa',
    rating: 5,
    comment: 'Melhor loja que já comprei! Recomendo a todos.',
    date: new Date(new Date().setDate(new Date().getDate() - 5)),
    category: 'general'
  }
];

const getCategoryColor = (category: FeedbackItem['category']) => {
  switch (category) {
    case 'product': return 'bg-green-100 text-green-800';
    case 'service': return 'bg-blue-100 text-blue-800';
    case 'support': return 'bg-yellow-100 text-yellow-800';
    case 'general': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getCategoryLabel = (category: FeedbackItem['category']) => {
  switch (category) {
    case 'product': return 'Produto';
    case 'service': return 'Serviço';
    case 'support': return 'Suporte';
    case 'general': return 'Geral';
    default: return 'Geral';
  }
};

export function UserFeedback() {
  // Calcular estatísticas
  const totalFeedback = feedback.length;
  const averageRating = feedback.reduce((sum, item) => sum + item.rating, 0) / totalFeedback;
  const positiveFeedback = feedback.filter(item => item.rating >= 4).length;
  const negativeFeedback = feedback.filter(item => item.rating <= 2).length;
  
  const ratingDistribution = [0, 0, 0, 0, 0]; // 1-5 stars
  feedback.forEach(item => {
    ratingDistribution[item.rating - 1]++;
  });

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Feedback dos Usuários
        </CardTitle>
        <CardDescription>
          Avaliações e comentários dos clientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="font-medium">Avaliação Média</span>
            </div>
            <p className="text-2xl font-bold mt-2">{averageRating.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground mt-1">de 5 estrelas</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <ThumbsUp className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium">Feedback Positivo</span>
            </div>
            <p className="text-2xl font-bold mt-2">{positiveFeedback}</p>
            <p className="text-xs text-muted-foreground mt-1">avaliações 4-5 estrelas</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <ThumbsDown className="h-5 w-5 text-red-500 mr-2" />
              <span className="font-medium">Feedback Negativo</span>
            </div>
            <p className="text-2xl font-bold mt-2">{negativeFeedback}</p>
            <p className="text-xs text-muted-foreground mt-1">avaliações 1-2 estrelas</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium">Total de Avaliações</span>
            </div>
            <p className="text-2xl font-bold mt-2">{totalFeedback}</p>
            <p className="text-xs text-muted-foreground mt-1">nos últimos 30 dias</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-3">Distribuição de Avaliações</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center">
                <div className="w-12 text-sm">{stars} estrelas</div>
                <div className="flex-1 mx-3">
                  <Progress 
                    value={(ratingDistribution[stars - 1] / totalFeedback) * 100} 
                    className="h-2" 
                  />
                </div>
                <div className="w-10 text-sm text-right">
                  {ratingDistribution[stars - 1]}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-3">Comentários Recentes</h4>
          <div className="space-y-4">
            {feedback.map((item) => (
              <div key={item.id} className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center">
                      <h5 className="font-medium">{item.user}</h5>
                      <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getCategoryColor(item.category)}`}>
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < item.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-2">
                        {item.date.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {item.comment}
                </p>
                <div className="flex justify-end mt-3">
                  <Button variant="outline" size="sm">
                    Responder
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}