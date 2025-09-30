import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification, NotificationContextType } from '../types/notifications';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Gerar notificações de exemplo na inicialização
  useEffect(() => {
    const initialNotifications: Omit<Notification, 'id' | 'timestamp' | 'read'>[] = [
      {
        title: 'Cirurgia Agendada',
        message: 'Prostatectomia robótica - José Roberto Silveira às 14:00',
        type: 'info',
        category: 'cirurgia',
        priority: 'high',
        actionUrl: '/centro-cirurgico',
        actionLabel: 'Ver Agenda'
      },
      {
        title: 'Estoque Baixo',
        message: 'Fio Vicryl 2-0 com apenas 5 unidades em estoque',
        type: 'warning',
        category: 'estoque',
        priority: 'medium',
        actionUrl: '/gerenciamento-materiais',
        actionLabel: 'Repor Estoque'
      },
      {
        title: 'Paciente em Recuperação',
        message: 'Maria Silva Santos - Aldrete Score 10, pronta para alta',
        type: 'success',
        category: 'paciente',
        priority: 'medium',
        actionUrl: '/recuperacao-anestesica',
        actionLabel: 'Ver Paciente'
      },
      {
        title: 'Alerta de Infecção',
        message: 'Possível infecção detectada - Paciente UTI Leito 12',
        type: 'error',
        category: 'infeccao',
        priority: 'urgent',
        actionUrl: '/controle-infeccao',
        actionLabel: 'Investigar'
      },
      {
        title: 'Custeio Pendente',
        message: 'Custeio da cirurgia #2025007 aguarda aprovação financeira',
        type: 'warning',
        category: 'financeiro',
        priority: 'medium',
        actionUrl: '/custeio-cirurgico',
        actionLabel: 'Revisar'
      },
      {
        title: 'Sistema Atualizado',
        message: 'Nova versão 2.1.4 instalada com melhorias de segurança',
        type: 'success',
        category: 'sistema',
        priority: 'low'
      },
      {
        title: 'Backup Concluído',
        message: 'Backup automático dos dados concluído com sucesso',
        type: 'info',
        category: 'sistema',
        priority: 'low'
      },
      {
        title: 'Cirurgia Cancelada',
        message: 'Apendicectomia de urgência - João Pereira Lima cancelada',
        type: 'error',
        category: 'cirurgia',
        priority: 'high',
        actionUrl: '/centro-cirurgico-recepcao',
        actionLabel: 'Reagendar'
      }
    ];

    // Adicionar notificações iniciais
    initialNotifications.forEach(notification => {
      addNotification(notification);
    });

    // Simular notificações periódicas
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          title: 'Nova Internação',
          message: 'Paciente Carlos Alberto Silva admitido na UTI - Leito 08',
          type: 'info' as const,
          category: 'paciente' as const,
          priority: 'medium' as const,
          actionUrl: '/uti',
          actionLabel: 'Ver UTI'
        },
        {
          title: 'Material Usado',
          message: 'Kit de Intubação utilizado na UTI - Estoque: 3 unidades',
          type: 'warning' as const,
          category: 'estoque' as const,
          priority: 'low' as const,
          actionUrl: '/gerenciamento-materiais',
          actionLabel: 'Ver Estoque'
        },
        {
          title: 'Exame Disponível',
          message: 'Resultado de Hemograma - Maria Santos Oliveira disponível',
          type: 'success' as const,
          category: 'paciente' as const,
          priority: 'medium' as const
        }
      ];

      // Adicionar uma notificação aleatória a cada 30 segundos
      const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
      addNotification(randomNotification);
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};