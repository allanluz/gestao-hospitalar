import { useEffect, useRef } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

export const useNotificationSound = () => {
  const { notifications } = useNotifications();
  const previousCountRef = useRef(0);

  useEffect(() => {
    const currentCount = notifications.length;
    const hasNewNotification = currentCount > previousCountRef.current;
    
    if (hasNewNotification && previousCountRef.current > 0) {
      const latestNotification = notifications[0];
      
      // Reproduzir som apenas para notificações urgentes ou de erro
      if (latestNotification && (latestNotification.type === 'urgent' || latestNotification.type === 'error')) {
        playNotificationSound();
      }
    }
    
    previousCountRef.current = currentCount;
  }, [notifications]);

  const playNotificationSound = () => {
    // Criar um tom de beep usando Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800; // Frequência do beep
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Volume baixo
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio não suportado:', error);
    }
  };

  return { playNotificationSound };
};