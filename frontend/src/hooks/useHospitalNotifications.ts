import { useNotifications } from '../contexts/NotificationContext';

export const useHospitalNotifications = () => {
  const { addNotification } = useNotifications();

  const notifyCircurgiaCriada = (paciente: string, cirurgia: string, data: string) => {
    addNotification({
      title: 'Nova Cirurgia Agendada',
      message: `${cirurgia} - ${paciente} agendada para ${data}`,
      type: 'info',
      category: 'cirurgia',
      priority: 'medium',
      actionUrl: '/centro-cirurgico',
      actionLabel: 'Ver Agenda'
    });
  };

  const notifyEstoqueBaixo = (material: string, quantidade: number) => {
    addNotification({
      title: 'Estoque Baixo',
      message: `${material} com apenas ${quantidade} unidades em estoque`,
      type: 'warning',
      category: 'estoque',
      priority: 'medium',
      actionUrl: '/gerenciamento-materiais',
      actionLabel: 'Repor Estoque'
    });
  };

  const notifyPacienteRecuperacao = (paciente: string, status: string) => {
    addNotification({
      title: 'Paciente em Recuperação',
      message: `${paciente} - ${status}`,
      type: 'success',
      category: 'paciente',
      priority: 'medium',
      actionUrl: '/recuperacao-anestesica',
      actionLabel: 'Ver Paciente'
    });
  };

  const notifyInfeccaoSuspeita = (local: string, paciente?: string) => {
    addNotification({
      title: 'Alerta de Infecção',
      message: `Possível infecção detectada${paciente ? ` - ${paciente}` : ''} - ${local}`,
      type: 'error',
      category: 'infeccao',
      priority: 'urgent',
      actionUrl: '/controle-infeccao',
      actionLabel: 'Investigar'
    });
  };

  const notifyCusteioPendente = (numeroInternacao: string) => {
    addNotification({
      title: 'Custeio Pendente',
      message: `Custeio da cirurgia ${numeroInternacao} aguarda aprovação financeira`,
      type: 'warning',
      category: 'financeiro',
      priority: 'medium',
      actionUrl: '/custeio-cirurgico',
      actionLabel: 'Revisar'
    });
  };

  const notifyCircurgiaCancelada = (paciente: string, cirurgia: string, motivo?: string) => {
    addNotification({
      title: 'Cirurgia Cancelada',
      message: `${cirurgia} - ${paciente}${motivo ? ` - Motivo: ${motivo}` : ''}`,
      type: 'error',
      category: 'cirurgia',
      priority: 'high',
      actionUrl: '/centro-cirurgico-recepcao',
      actionLabel: 'Reagendar'
    });
  };

  const notifyBackupRealizado = () => {
    addNotification({
      title: 'Backup Concluído',
      message: 'Backup automático dos dados concluído com sucesso',
      type: 'success',
      category: 'sistema',
      priority: 'low'
    });
  };

  const notifyUrgencia = (titulo: string, mensagem: string, actionUrl?: string) => {
    addNotification({
      title: titulo,
      message: mensagem,
      type: 'urgent',
      category: 'paciente',
      priority: 'urgent',
      actionUrl,
      actionLabel: actionUrl ? 'Atender' : undefined
    });
  };

  const notifyManutencaoSistema = (inicio: string, fim: string) => {
    addNotification({
      title: 'Manutenção Programada',
      message: `Sistema ficará indisponível de ${inicio} às ${fim} para manutenção`,
      type: 'warning',
      category: 'sistema',
      priority: 'medium'
    });
  };

  return {
    notifyCircurgiaCriada,
    notifyEstoqueBaixo,
    notifyPacienteRecuperacao,
    notifyInfeccaoSuspeita,
    notifyCusteioPendente,
    notifyCircurgiaCancelada,
    notifyBackupRealizado,
    notifyUrgencia,
    notifyManutencaoSistema
  };
};