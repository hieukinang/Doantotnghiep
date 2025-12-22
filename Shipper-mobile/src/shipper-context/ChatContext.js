import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth-context';
import { initChatSocket, getChatSocket, disconnectChatSocket } from './chatConfig';
import chatService from './chatService';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { token, userId } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  // Đếm tin nhắn chưa đọc theo user_id: { "user123": 2, "user456": 1 }
  const [unreadByUser, setUnreadByUser] = useState({});

  // Khởi tạo socket và load conversations khi có token
  useEffect(() => {
    if (token) {
      // Load danh sách conversations ngay khi có token
      (async () => {
        try {
          const data = await chatService.getConversations();
          setConversations(data || []);
        } catch (error) {
          console.warn('Auto load conversations error:', error);
        }
      })();

      const socket = initChatSocket(token);
      
      if (socket) {
        socket.on('connect', () => {
          setIsConnected(true);
        });

        socket.on('disconnect', () => {
          setIsConnected(false);
        });

        // Lắng nghe tin nhắn mới
        socket.on('new_message', (message) => {
          // Cập nhật last_message trong conversations
          setConversations(prev => 
            prev.map(conv => 
              conv._id === message.conversation_id
                ? { ...conv, last_message: message }
                : conv
            )
          );
          
          // Tăng số tin nhắn chưa đọc nếu không phải tin nhắn của mình
          if (message.sender?.user_id !== userId) {
            const senderUserId = String(message.sender?.user_id);
            setUnreadByUser(prev => ({
              ...prev,
              [senderUserId]: (prev[senderUserId] || 0) + 1
            }));
            setUnreadCount(prev => prev + 1);
          }
        });

        // Lắng nghe conversation mới
        socket.on('new_conversation', (conversation) => {
          setConversations(prev => [conversation, ...prev]);
        });

        // Lắng nghe user rời khỏi conversation
        socket.on('user-left', ({ roomId, user }) => {
          if (user.user_id === userId) {
            setConversations(prev => prev.filter(c => c._id !== roomId));
          }
        });
      }
    }

    return () => {
      disconnectChatSocket();
    };
  }, [token, userId]);


  // Load danh sách conversations
  const loadConversations = useCallback(async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(data || []);
    } catch (error) {
      console.warn('Load conversations error:', error);
    }
  }, []);

  // Tạo hoặc mở chat với user khác
  const openDirectChat = useCallback(async (targetUserId, message = '') => {
    try {
      const result = await chatService.createDirectChat(targetUserId, message);
      
      // Nếu là conversation mới, thêm vào list
      if (result.isNew && result.conversation) {
        setConversations(prev => [result.conversation, ...prev]);
      }
      
      return result;
    } catch (error) {
      console.warn('Open direct chat error:', error);
      throw error;
    }
  }, []);

  // Gửi tin nhắn
  const sendMessage = useCallback(async (conversationId, content, attachments = []) => {
    try {
      const message = await chatService.sendMessage(conversationId, content, attachments);
      return message;
    } catch (error) {
      console.warn('Send message error:', error);
      throw error;
    }
  }, []);

  // Lấy tin nhắn trong conversation
  const getMessages = useCallback(async (conversationId, limit = 50, skip = 0) => {
    try {
      const messages = await chatService.getMessages(conversationId, limit, skip);
      return messages;
    } catch (error) {
      console.warn('Get messages error:', error);
      throw error;
    }
  }, []);

  // Rời khỏi conversation
  const leaveConversation = useCallback(async (conversationId) => {
    try {
      await chatService.leaveConversation(conversationId);
      setConversations(prev => prev.filter(c => c._id !== conversationId));
    } catch (error) {
      console.warn('Leave conversation error:', error);
      throw error;
    }
  }, []);

  // Lấy thông tin người chat cùng (không phải mình)
  const getOtherParticipant = useCallback((conversation) => {
    if (!conversation?.participants) return null;
    return conversation.participants.find(p => p.user_id !== userId);
  }, [userId]);

  // Lấy số tin nhắn chưa đọc của một user cụ thể
  const getUnreadCountByUser = useCallback((targetUserId) => {
    return unreadByUser[String(targetUserId)] || 0;
  }, [unreadByUser]);

  // Đánh dấu đã đọc tin nhắn của một user
  const clearUnreadByUser = useCallback((targetUserId) => {
    const userIdStr = String(targetUserId);
    setUnreadByUser(prev => {
      const count = prev[userIdStr] || 0;
      setUnreadCount(c => Math.max(0, c - count));
      const newState = { ...prev };
      delete newState[userIdStr];
      return newState;
    });
  }, []);

  const value = {
    conversations,
    isConnected,
    unreadCount,
    unreadByUser,
    loadConversations,
    openDirectChat,
    sendMessage,
    getMessages,
    leaveConversation,
    getOtherParticipant,
    getUnreadCountByUser,
    clearUnreadByUser,
    socket: getChatSocket(),
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
