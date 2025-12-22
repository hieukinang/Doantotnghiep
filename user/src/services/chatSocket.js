import { io } from 'socket.io-client';
import chatService from './chatService';

const CHAT_SOCKET_URL =
  import.meta.env.VITE_CHAT_SOCKET_URL || 'http://127.0.0.1:3000/api';

let socket = null;

/**
 * Socket.io client dùng chung cho ứng dụng user (client + seller).
 * Lấy token từ chatService (đã xử lý chọn clientToken/sellerToken theo ngữ cảnh).
 */
export function getChatSocket(tokenuser) {
  const token = tokenuser ;
  if (!token) {
    return null;
  }

  // Nếu đã có socket đang kết nối thì tái sử dụng
  if (socket && socket.connected) {
    return socket;
  }

  socket = io(CHAT_SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
  });

  socket.on('connect_error', (err) => {
    console.error('Chat socket connect error:', err?.message || err);
  });

  return socket;
}

export function disconnectChatSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
