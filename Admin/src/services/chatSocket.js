import { io } from 'socket.io-client';
import adminChatService from './chatService';

const CHAT_SOCKET_URL =
  import.meta.env.VITE_CHAT_SOCKET_URL || 'http://127.0.0.1:3000';

let socket = null;

/**
 * Socket.io client dùng cho trang quản lý chat của admin.
 */
export function getAdminChatSocket() {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return null;
  }

  if (socket && socket.connected) {
    return socket;
  }

  socket = io(CHAT_SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
  });

  socket.on('connect_error', (err) => {
    console.error('Admin chat socket connect error:', err?.message || err);
  });

  return socket;
}

export function disconnectAdminChatSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
