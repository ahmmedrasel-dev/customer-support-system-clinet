"use client";

import { useNotifications } from '../notifications/NotificationContext';

export default function NotificationTest() {
  const { notifications, unreadCount } = useNotifications();

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">Notification Test</h3>
      <p>Total Notifications: {notifications.length}</p>
      <p>Unread Count: {unreadCount}</p>
      <div className="mt-2">
        {notifications.slice(0, 3).map((notification) => (
          <div key={notification.id} className="text-sm p-2 bg-white rounded mb-1">
            <strong>{notification.title}</strong>: {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
}