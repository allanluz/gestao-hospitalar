export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'urgent';
  timestamp: Date;
  read: boolean;
  category: 'sistema' | 'paciente' | 'cirurgia' | 'estoque' | 'financeiro' | 'infeccao';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionLabel?: string;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}