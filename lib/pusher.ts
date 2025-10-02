import Pusher from 'pusher-js';

// Initialize Pusher
const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
  forceTLS: process.env.NEXT_PUBLIC_PUSHER_FORCE_TLS === 'true',
  ...(process.env.NEXT_PUBLIC_PUSHER_HOST && {
    wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST,
    wsPort: parseInt(process.env.NEXT_PUBLIC_PUSHER_PORT || '443'),
    wssPort: parseInt(process.env.NEXT_PUBLIC_PUSHER_PORT || '443'),
    enabledTransports: ['ws', 'wss'],
  }),
});

export default pusher;

// Helper function to subscribe to a channel
export const subscribeToChannel = (channelName: string) => {
  return pusher.subscribe(channelName);
};

// Helper function to unsubscribe from a channel
export const unsubscribeFromChannel = (channelName: string) => {
  pusher.unsubscribe(channelName);
};

// Helper function to bind to an event
export const bindToEvent = (
  channelName: string,
  eventName: string,
  callback: (data: any) => void
) => {
  const channel = pusher.subscribe(channelName);
  channel.bind(eventName, callback);
  return channel;
};

// Helper function to unbind from an event
export const unbindFromEvent = (
  channelName: string,
  eventName: string,
  callback?: (data: any) => void
) => {
  const channel = pusher.channel(channelName);
  if (channel) {
    if (callback) {
      channel.unbind(eventName, callback);
    } else {
      channel.unbind(eventName);
    }
  }
};

// Disconnect Pusher
export const disconnectPusher = () => {
  pusher.disconnect();
};