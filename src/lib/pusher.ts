import Pusher from 'pusher-js';

// Initialize Pusher client
const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2',
  forceTLS: true,
});

export default pusher;

export const subscribeToUserNotifications = (userId: string, callback: (data: any) => void) => {
  const channel = pusher.subscribe(`user-${userId}`);
  
  channel.bind('new-notification', callback);
  
  return () => {
    channel.unbind('new-notification', callback);
    pusher.unsubscribe(`user-${userId}`);
  };
};

export const subscribeToProjectActivity = (projectId: string, callback: (data: any) => void) => {
  const channel = pusher.subscribe(`project-${projectId}`);
  
  channel.bind('new-view', callback);
  channel.bind('new-comment', callback);
  channel.bind('new-like', callback);
  
  return () => {
    channel.unbind('new-view', callback);
    channel.unbind('new-comment', callback);
    channel.unbind('new-like', callback);
    pusher.unsubscribe(`project-${projectId}`);
  };
};
