import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from './config';

// Chat server URL - thay đổi theo môi trường
const CHAT_SOCKET_URL = `http://${config.port}:3000`;

let socket = null;

/**
 * Khởi tạo socket connection với token
 * @param {string} token - JWT token
 */
export function initChatSocket(token) {
  if (!token) {
    console.warn('No token provided for chat socket');
    return null;
  }

  // Nếu đã có socket đang kết nối thì tái sử dụng
  if (socket && socket.connected) {
    return socket;
  }

  // Disconnect socket cũ nếu có
  if (socket) {
    socket.disconnect();
  }

  socket = io(CHAT_SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('Chat socket connected');
  });

  socket.on('connect_error', (err) => {
    console.error('Chat socket connect error:', err?.message || err);
  });

  socket.on('disconnect', (reason) => {
    console.log('Chat socket disconnected:', reason);
  });

  return socket;
}

/**
 * Lấy socket instance hiện tại
 */
export function getChatSocket() {
  return socket;
}

/**
 * Ngắt kết nối socket
 */
export function disconnectChatSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * Join vào room chat
 * @param {string} roomId - Conversation ID
 */
export function joinRoom(roomId, callback) {
  if (socket && socket.connected) {
    socket.emit('join-room', { roomId }, callback);
  }
}

/**
 * Rời khỏi room chat
 * @param {string} roomId - Conversation ID
 */
export function leaveRoom(roomId, callback) {
  if (socket && socket.connected) {
    socket.emit('leave-room', { roomId }, callback);
  }
}

/**
 * Gửi typing indicator
 * @param {string} roomId - Conversation ID
 * @param {boolean} isTyping - Đang gõ hay không
 */
export function sendTyping(roomId, isTyping) {
  if (socket && socket.connected) {
    socket.emit('typing', { roomId, isTyping });
  }
}

/**
 * Đánh dấu đã đọc tin nhắn
 * @param {string} roomId - Conversation ID
 * @param {string} messageId - Message ID
 */
export function markAsRead(roomId, messageId) {
  if (socket && socket.connected) {
    socket.emit('read', { roomId, messageId });
  }
}
