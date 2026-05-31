import React, { useState } from 'react';

import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Event {
  id: string;
  title: string;
  date: Date;
  type: 'meeting' | 'deadline' | 'reminder' | 'launch';
  description: string;
}

const events: Event[] = [
  {
    id: '1',
    title: 'Reunião de equipe',
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    type: 'meeting',
    description: 'Reunião semanal para alinhamento de metas'
  },
  {
    id: '2',
    title: 'Deadline de relatórios',
    date: new Date(new Date().setDate(new Date().getDate() + 3)),
    type: 'deadline',
    description: 'Prazo final para envio de relatórios mensais'
  },
  {
    id: '3',
    title: 'Lançamento de novo produto',
    date: new Date(new Date().setDate(new Date().getDate() + 7)),
    type: 'launch',
    description: 'Lançamento do novo tênis esportivo'
  },
  {
    id: '4',
    title: 'Manutenção do sistema',
    date: new Date(new Date().setDate(new Date().getDate() + 10)),
    type: 'reminder',
    description: 'Manutenção programada do sistema'
  }
];

const getEventTypeColor = (type: Event['type']) => {
  switch (type) {
    case 'meeting': return 'bg-blue-100 text-blue-800';
    case 'deadline': return 'bg-red-100 text-red-800';
    case 'reminder': return 'bg-yellow-100 text-yellow-800';
    case 'launch': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getEventTypeLabel = (type: Event['type']) => {
  switch (type) {
    case 'meeting': return 'Reunião';
    case 'deadline': return 'Prazo';
    case 'reminder': return 'Lembrete';
    case 'launch': return 'Lançamento';
    default: return 'Evento';
  }
};

export function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Dias vazios no início do mês
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-100 dark:border-allin-bg-dark-3"></div>);
    }
    
    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = events.filter(event => 
        event.date.getDate() === day && 
        event.date.getMonth() === month && 
        event.date.getFullYear() === year
      );
      
      days.push(
        <div key={day} className="h-24 border border-gray-100 dark:border-allin-bg-dark-3 p-1">
          <div className="font-medium text-sm">{day}</div>
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 2).map(event => (
              <div 
                key={event.id} 
                className={`text-xs px-1 py-0.5 rounded truncate ${getEventTypeColor(event.type)}`}
                title={event.title}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{dayEvents.length - 2} mais
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'prev' ? -1 : 1));
      return newDate;
    });
  };
  
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2" />
          Calendário de Eventos
        </CardTitle>
        <CardDescription>
          Eventos e compromissos importantes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-medium">{getMonthName(currentDate)}</h3>
          <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {renderCalendar()}
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium mb-3">Próximos Eventos</h4>
          <div className="space-y-3">
            {events
              .filter(event => event.date >= new Date())
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .slice(0, 3)
              .map(event => (
                <div key={event.id} className="flex items-center p-3 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getEventTypeColor(event.type)}`}>
                    {getEventTypeLabel(event.type)}
                  </div>
                  <div className="ml-3 flex-1">
                    <h5 className="font-medium text-sm">{event.title}</h5>
                    <p className="text-xs text-muted-foreground">
                      {event.date.toLocaleDateString('pt-BR')} - {event.description}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}