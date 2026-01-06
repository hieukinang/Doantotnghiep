import { io } from 'socket.io-client';
import chatService from './chatService';

const CHAT_SOCKET_URL =
  import.meta.env.VITE_CHAT_SOCKET_URL || 'http://127.0.0.1:3000';

let socket = null;
let currentToken = null; // Lưu token hiện tại để so sánh

/**
 * Socket.io client dùng chung cho ứng dụng user (client + seller).
 * Lấy token từ chatService (đã xử lý chọn clientToken/sellerToken theo ngữ cảnh).
 */
export function getChatSocket() {
  // Kiểm tra URL để chọn đúng token
  const isSeller = window.location.href.includes('/seller');
  const token = isSeller 
    ? localStorage.getItem('sellerToken') 
    : localStorage.getItem('clientToken');
  
  if (!token) {
    return null;
  }

  // Nếu token thay đổi (chuyển từ user sang seller hoặc ngược lại), disconnect socket cũ
  if (socket && currentToken !== token) {
    socket.disconnect();
    socket = null;
  }

  // Nếu đã có socket đang kết nối với đúng token thì tái sử dụng
  if (socket && socket.connected) {
    return socket;
  }

  currentToken = token;
  console.log('🔌 Đang kết nối socket tới:', CHAT_SOCKET_URL);
  
  socket = io(CHAT_SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected successfully! ID:', socket.id);
  });

  socket.on('connect_error', (err) => {
    console.error('❌ Chat socket connect error:', err?.message || err);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔴 Socket disconnected:', reason);
  });

  return socket;
}

export function disconnectChatSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentToken = null;
  }
}
