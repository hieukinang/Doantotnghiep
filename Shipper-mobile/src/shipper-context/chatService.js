import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from './config';

// Base URL cho chat API - dùng chung IP với backend
const CHAT_API_URL = `http://${config.port}:3000/api`;

class ChatService {
  // Lấy token từ AsyncStorage
  async getToken() {
    return await AsyncStorage.getItem('token');
  }

  // Lấy headers với Authorization
  async getAuthHeaders() {
    const token = await this.getToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * 1. Tạo account chat (gọi sau khi đăng ký)
   * POST /api/users/create
   * Body: { user_id, username }
   */
  async createChatAccount(userId, username) {
    try {
      const res = await axios.post(`${CHAT_API_URL}/users/create`, {
        user_id: userId,
        username: username,
      });
      return res.data;
    } catch (error) {
      console.warn('Create chat account error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * 2. Tạo conversation mới / gửi tin nhắn đầu tiên
   * POST /api/conversations/direct?userId=xxx
   * Body: FormData { message, attachments[] }
   */
  async createDirectChat(targetUserId, message = '', attachments = []) {
    try {
      const headers = await this.getAuthHeaders();
      
      const formData = new FormData();
      if (message) {
        formData.append('message', message);
      }
      
      // Thêm attachments nếu có
      attachments.forEach((file, index) => {
        formData.append('attachments', {
          uri: file.uri,
          type: file.type || 'image/jpeg',
          name: file.name || `attachment_${index}.jpg`,
        });
      });

      const res = await axios.post(
        `${CHAT_API_URL}/conversations/direct?userId=${targetUserId}`,
        formData,
        {
          headers: {
            ...headers,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return res.data;
    } catch (error) {
      console.warn('Create direct chat error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * 3. Lấy danh sách tất cả cuộc trò chuyện
   * GET /api/conversations/
   */
  async getConversations() {
    try {
      const headers = await this.getAuthHeaders();
      const res = await axios.get(`${CHAT_API_URL}/conversations/`, {
        headers,
      });
      return res.data;
    } catch (error) {
      console.warn('Get conversations error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * 4. Gửi tin nhắn vào phòng đã có
   * POST /api/messages/:conversationId
   * Body: FormData { content, attachments[] }
   */
  async sendMessage(conversationId, content = '', attachments = []) {
    try {
      const headers = await this.getAuthHeaders();
      
      const formData = new FormData();
      if (content) {
        formData.append('content', content);
      }
      
      // Thêm attachments nếu có
      attachments.forEach((file, index) => {
        formData.append('attachments', {
          uri: file.uri,
          type: file.type || 'image/jpeg',
          name: file.name || `attachment_${index}.jpg`,
        });
      });

      const res = await axios.post(
        `${CHAT_API_URL}/messages/${conversationId}`,
        formData,
        {
          headers: {
            ...headers,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return res.data;
    } catch (error) {
      console.warn('Send message error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * 5. Lấy tất cả tin nhắn trong phòng
   * GET /api/messages/:conversationId
   * Query: limit, skip (optional)
   */
  async getMessages(conversationId, limit = 50, skip = 0) {
    try {
      const headers = await this.getAuthHeaders();
      const res = await axios.get(
        `${CHAT_API_URL}/messages/${conversationId}?limit=${limit}&skip=${skip}`,
        { headers }
      );
      return res.data;
    } catch (error) {
      console.warn('Get messages error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * 6. Rời khỏi cuộc trò chuyện
   * DELETE /api/conversations/:id
   */
  async leaveConversation(conversationId) {
    try {
      const headers = await this.getAuthHeaders();
      const res = await axios.delete(
        `${CHAT_API_URL}/conversations/${conversationId}`,
        { headers }
      );
      return res.data;
    } catch (error) {
      console.warn('Leave conversation error:', error.response?.data || error.message);
      throw error;
    }
  }
}

// Export instance
const chatService = new ChatService();
export default chatService;
