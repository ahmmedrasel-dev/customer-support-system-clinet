"use client";

import pusher, { bindToEvent, subscribeToChannel, unbindFromEvent, unsubscribeFromChannel } from '@/lib/pusher';
import { useEffect, useRef } from 'react';

// Hook for subscribing to a Pusher channel
export const usePusherChannel = (channelName: string) => {
  const channelRef = useRef<any>(null);

  useEffect(() => {
    channelRef.current = subscribeToChannel(channelName);

    return () => {
      if (channelRef.current) {
        unsubscribeFromChannel(channelName);
      }
    };
  }, [channelName]);

  return channelRef.current;
};

// Hook for subscribing to a specific event on a channel
export const usePusherEvent = (
  channelName: string,
  eventName: string,
  callback: (data: any) => void
) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const channel = bindToEvent(channelName, eventName, (data: any) => {
      callbackRef.current(data);
    });

    return () => {
      unbindFromEvent(channelName, eventName, callbackRef.current);
    };
  }, [channelName, eventName]);
};

// Hook for real-time ticket updates
export const useTicketUpdates = (ticketId: number, onUpdate: (data: any) => void) => {
  usePusherEvent(`ticket.${ticketId}`, 'ticket.updated', onUpdate);
};

// Hook for real-time notifications
export const useNotifications = (userId: number, onNotification: (data: any) => void) => {
  usePusherEvent(`user.${userId}`, 'notification', onNotification);
};

// Hook for real-time chat messages
export const useChatMessages = (ticketId: number, onMessage: (data: any) => void) => {
  usePusherEvent(`ticket.${ticketId}.chat`, 'message.sent', onMessage);
};

export default pusher;