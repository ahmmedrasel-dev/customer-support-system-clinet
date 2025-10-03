"use client";

import Pusher from 'pusher-js';
import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../components/auth/AuthContext';

export type Notification = {
  id: string;
  type: 'ticket_created' | 'ticket_assigned' | 'ticket_updated' | 'ticket_deleted' | 'ticket_assigned_other';
  title: string;
  message: string;
  action_url: string;
  data: any;
  read: boolean;
  created_at: string;
  sender?: {
    id: number;
    name: string;
  };
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  refreshNotifications: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pusherInstance, setPusherInstance] = useState<Pusher | null>(null);

  const fetchNotifications = async () => {
    // Only fetch if user is authenticated
    if (!token || !user) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id: string) => {
    if (!token) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      await fetch(`${apiUrl}/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!token) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      await fetch(`${apiUrl}/api/notifications/mark-all-read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const refreshNotifications = () => {
    fetchNotifications();
  };

  // Fetch notifications when user logs in
  useEffect(() => {
    if (user && token) {
      fetchNotifications();
    } else {
      // Clear notifications when user logs out
      setNotifications([]);
    }
  }, [user, token]);

  // Handle real-time subscriptions
  useEffect(() => {
    // Only subscribe if user is authenticated
    if (!user || !token) {
      if (pusherInstance) {
        pusherInstance.disconnect();
        setPusherInstance(null);
      }
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const pusher = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_APP_KEY || "6a68baf450e0cf971739",
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || "ap2",
        forceTLS: true,
      }
    );

    setPusherInstance(pusher);

    // Admin notifications
    if (user.role === 'admin') {
      const adminChannel = pusher.subscribe('admin-notifications');

      adminChannel.bind('notification.ticket.created', (data: any) => {
        handleNewNotification(data);
      });

      adminChannel.bind('notification.ticket.assigned', (data: any) => {
        handleNewNotification(data);
      });

      adminChannel.bind('notification.ticket.updated', (data: any) => {
        handleNewNotification(data);
      });

      adminChannel.bind('notification.ticket.deleted', (data: any) => {
        handleNewNotification(data);
      });
    }

    // User-specific notifications (for both admin and customer)
    const userChannel = pusher.subscribe(`user.${user.id}`);
    userChannel.bind('notification.ticket.assigned', (data: any) => {
      handleNewNotification(data);
    });
    userChannel.bind('notification.ticket.updated', (data: any) => {
      handleNewNotification(data);
    });
    userChannel.bind('notification.ticket.deleted', (data: any) => {
      handleNewNotification(data);
    });

    const handleNewNotification = (data: any) => {
      const notification: Notification = {
        id: `realtime-${Date.now()}-${Math.random()}`,
        type: data.type,
        title: data.title,
        message: data.message,
        action_url: data.action_url,
        data: data.data,
        read: false,
        created_at: new Date().toISOString(),
      };

      setNotifications(prev => [notification, ...prev]);

      // Show toast with action
      toast.custom(
        <div
          onClick={() => {
            if (data.action_url) {
              window.location.href = data.action_url;
            }
          }}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 max-w-sm"
        >
          <p className="font-medium text-gray-900 dark:text-white">{data.title}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{data.message}</p>
          <p className="text-xs text-blue-500 mt-2">Click to view</p>
        </div>,
        { duration: 8000 }
      );
    };

    return () => {
      pusher.unsubscribe('admin-notifications');
      pusher.unsubscribe(`user.${user.id}`);
      pusher.disconnect();
    };
  }, [user, token]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      clearAll,
      refreshNotifications,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}