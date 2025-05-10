import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (userId: string) => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000', {
      auth: {
        userId,
      },
    });

    socket.on('connect', () => {
      console.log('Socket.io connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket.io disconnected');
    });

    socket.on('error', (error) => {
      console.error('Socket.io error:', error);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinCommunityRoom = (projectId: string) => {
  if (socket) {
    socket.emit('join_room', { room: `community-${projectId}` });
  }
};

export const leaveCommunityRoom = (projectId: string) => {
  if (socket) {
    socket.emit('leave_room', { room: `community-${projectId}` });
  }
};

export const sendCommunityMessage = (projectId: string, message: string) => {
  if (socket) {
    socket.emit('community_message', {
      room: `community-${projectId}`,
      message,
    });
  }
};

export const listenToCommunityMessages = (callback: (data: any) => void) => {
  if (socket) {
    socket.on('community_message', callback);
  }

  return () => {
    if (socket) {
      socket.off('community_message', callback);
    }
  };
};
