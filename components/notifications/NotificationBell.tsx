"use client";

import { BellIcon, CheckIcon, TrashIcon } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { useNotifications } from './NotificationContext';

export default function NotificationBell() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearAll,
    refreshNotifications 
  } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ticket_created': return '🎫';
      case 'ticket_assigned': return '👤';
      case 'ticket_updated': return '📝';
      case 'ticket_deleted': return '🗑️';
      default: return '🔔';
    }
  };

  const getPriorityColor = (data: any) => {
    if (data?.priority === 'urgent') return 'bg-red-500';
    if (data?.priority === 'high') return 'bg-orange-500';
    if (data?.priority === 'medium') return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 max-h-[600px] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <CheckIcon className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll}>
                <TrashIcon className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <BellIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications</p>
              <Button variant="outline" size="sm" onClick={refreshNotifications} className="mt-2">
                Refresh
              </Button>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-4 cursor-pointer border-b last:border-b-0 ${
                  !notification.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                }`}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification.id);
                  }
                  if (notification.action_url) {
                    window.location.href = notification.action_url;
                  }
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm truncate">{notification.title}</p>
                        {notification.data?.priority && (
                          <Badge 
                            variant="secondary" 
                            className={`text-xs px-1.5 py-0.5 ${getPriorityColor(notification.data)} text-white`}
                          >
                            {notification.data.priority}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
        {notifications.length > 10 && (
          <div className="p-4 border-t">
            <Button variant="outline" size="sm" onClick={refreshNotifications} className="w-full">
              Load More
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}