import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Image,
  Alert,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useChat } from '../shipper-context/ChatContext';
import { useAuth } from '../shipper-context/auth-context';
import { getChatSocket, joinRoom, sendTyping, markAsRead } from '../shipper-context/chatConfig';

export default function ChatRoomScreen({ navigation, route }) {
  const { conversationId: initialConversationId, otherUser, targetUserId } = route.params;
  const { getMessages, sendMessage, openDirectChat } = useChat();
  const { userId } = useAuth();
  
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(!!initialConversationId);
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [otherTyping, setOtherTyping] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Lắng nghe keyboard show/hide (cho Android)
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        // Scroll xuống cuối khi keyboard hiện
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Load messages khi có conversationId
  useEffect(() => {
    if (conversationId) {
      loadMessages();
    } else {
      setLoading(false);
    }
  }, [conversationId]);

  // Setup socket riêng biệt
  useEffect(() => {
    if (!conversationId) return;
    
    const socket = getChatSocket();
    if (!socket) return;

    // Join room
    joinRoom(conversationId, (res) => {
      if (res?.error) console.error('Join room error:', res.error);
    });

    // Lắng nghe tin nhắn mới
    const handleNewMessage = (message) => {
      if (message.conversation_id === conversationId) {
        setMessages(prev => [...prev, message]);
        // Đánh dấu đã đọc
        if (message.sender?.user_id !== userId) {
          markAsRead(conversationId, message._id);
        }
      }
    };

    // Lắng nghe typing
    const handleTyping = ({ roomId, userId: typingUserId, isTyping }) => {
      if (roomId === conversationId && typingUserId !== userId) {
        setOtherTyping(isTyping);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('typing', handleTyping);

    // Cleanup khi unmount hoặc conversationId thay đổi
    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('typing', handleTyping);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversationId, userId]);

  const loadMessages = async () => {
    if (!conversationId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getMessages(conversationId);
      setMessages(data || []);
    } catch (error) {
      console.error('Load messages error:', error);
    }
    setLoading(false);
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text && attachments.length === 0) return;

    setSending(true);
    try {
      // Nếu chưa có conversationId, tạo conversation mới với tin nhắn đầu tiên
      if (!conversationId && targetUserId) {
        const result = await openDirectChat(targetUserId, text);
        if (result?.conversation) {
          const newConvId = result.conversation._id;
          setConversationId(newConvId);
          
          // Nếu API trả về message, hiển thị luôn thay vì load lại
          if (result.message) {
            setMessages([result.message]);
          }
          
          // Setup socket cho conversation mới
          const socket = getChatSocket();
          if (socket) {
            joinRoom(newConvId, (res) => {
              if (res?.error) console.error('Join room error:', res.error);
            });
          }
        }
      } else if (conversationId) {
        await sendMessage(conversationId, text, attachments);
        sendTyping(conversationId, false);
      }
      setInputText('');
      setAttachments([]);
    } catch (error) {
      console.error('Send message error:', error);
      Alert.alert('Lỗi', 'Không thể gửi tin nhắn. Vui lòng thử lại.');
    }
    setSending(false);
  };

  const handleTextChange = (text) => {
    setInputText(text);
    
    // Chỉ gửi typing indicator khi đã có conversationId
    if (conversationId) {
      sendTyping(conversationId, true);
      
      // Clear timeout cũ
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout để tắt typing sau 2s
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(conversationId, false);
      }, 2000);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // Cập nhật theo API mới
      allowsMultipleSelection: true,
      selectionLimit: 5 - attachments.length,
      quality: 0.7, // Giảm quality để tránh crash
      exif: false,
    });

    if (!result.canceled && result.assets) {
      const newAttachments = result.assets.map(asset => ({
        uri: asset.uri,
        type: 'image/jpeg',
        name: `image_${Date.now()}.jpg`,
      }));
      setAttachments(prev => [...prev, ...newAttachments].slice(0, 5));
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item, index }) => {
    const isMe = item.sender?.user_id === userId;
    const showDate = index === 0 || 
      new Date(item.sent_at).toDateString() !== new Date(messages[index - 1]?.sent_at).toDateString();

    return (
      <View>
        {showDate && (
          <Text style={styles.dateHeader}>
            {new Date(item.sent_at).toLocaleDateString('vi-VN', { 
              weekday: 'long', day: 'numeric', month: 'numeric' 
            })}
          </Text>
        )}
        <View style={[styles.messageRow, isMe ? styles.myMessageRow : styles.otherMessageRow]}>
          <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.otherBubble]}>
            {/* Attachments */}
            {item.attachments?.length > 0 && (
              <View style={styles.attachmentsContainer}>
                {item.attachments.map((url, i) => (
                  <Image key={i} source={{ uri: url }} style={styles.messageImage} />
                ))}
              </View>
            )}
            {/* Text content */}
            {item.content ? (
              <Text style={[styles.messageText, isMe ? styles.myText : styles.otherText]}>
                {item.content}
              </Text>
            ) : null}
            <Text style={[styles.messageTime, isMe ? styles.myTime : styles.otherTime]}>
              {formatTime(item.sent_at)}
            </Text>
          </View>
        </View>
      </View>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName} numberOfLines={1}>
            {otherUser?.username || 'Người dùng'}
          </Text>
          {otherTyping ? (
            <Text style={styles.typingText}>Đang nhập...</Text>
          ) : (
            <Text style={styles.statusText}>
              {otherUser?.status === 'online' ? 'Đang hoạt động' : 'Offline'}
            </Text>
          )}
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Messages */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          onLayout={() => flatListRef.current?.scrollToEnd()}
        />
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <View style={styles.attachmentsPreview}>
          {attachments.map((att, index) => (
            <View key={index} style={styles.attachmentItem}>
              <Image source={{ uri: att.uri }} style={styles.attachmentThumb} />
              <TouchableOpacity 
                style={styles.removeAttachment}
                onPress={() => removeAttachment(index)}
              >
                <Ionicons name="close-circle" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Input - với padding bottom động theo keyboard trên Android */}
      <View style={[
        styles.inputWrapper, 
        Platform.OS === 'android' && keyboardHeight > 0 && { paddingBottom: keyboardHeight }
      ]}>
        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={styles.attachButton}
            onPress={pickImage}
            disabled={attachments.length >= 5}
          >
            <Ionicons 
              name="image-outline" 
              size={24} 
              color={attachments.length >= 5 ? '#CBD5E1' : '#3B82F6'} 
            />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            placeholder="Nhập tin nhắn..."
            placeholderTextColor="#94A3B8"
            value={inputText}
            onChangeText={handleTextChange}
            multiline
            maxLength={1000}
          />
          
          <TouchableOpacity
            style={[styles.sendButton, (inputText.trim() || attachments.length > 0) && styles.sendButtonActive]}
            onPress={handleSend}
            disabled={sending || (!inputText.trim() && attachments.length === 0)}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="send" size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 4,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  statusText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  typingText: {
    fontSize: 12,
    color: '#3B82F6',
    fontStyle: 'italic',
  },
  headerRight: {
    width: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    padding: 12,
    paddingBottom: 20,
  },
  dateHeader: {
    textAlign: 'center',
    fontSize: 12,
    color: '#64748B',
    marginVertical: 12,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageRow: {
    marginVertical: 2,
  },
  myMessageRow: {
    alignItems: 'flex-end',
  },
  otherMessageRow: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 16,
  },
  myBubble: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myText: {
    color: '#FFFFFF',
  },
  otherText: {
    color: '#1E293B',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  myTime: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  otherTime: {
    color: '#94A3B8',
  },
  attachmentsContainer: {
    marginBottom: 6,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 4,
  },
  attachmentsPreview: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  attachmentItem: {
    position: 'relative',
    marginRight: 8,
  },
  attachmentThumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  removeAttachment: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  attachButton: {
    padding: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1E293B',
    marginHorizontal: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#3B82F6',
  },
});
