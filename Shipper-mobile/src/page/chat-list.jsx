import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useChat } from '../shipper-context/ChatContext';
import { useAuth } from '../shipper-context/auth-context';

export default function ChatListScreen({ navigation }) {
  const { conversations, loadConversations, getOtherParticipant, isConnected } = useChat();
  const { userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await loadConversations();
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  }, [loadConversations]);

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // Trong ngày
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }
    // Trong tuần
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      return days[date.getDay()];
    }
    // Khác
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };


  const renderConversation = ({ item }) => {
    const other = getOtherParticipant(item);
    const lastMsg = item.last_message;
    const isMyMessage = lastMsg?.sender?.user_id === userId;

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => navigation.navigate('ChatRoom', { 
          conversationId: item._id,
          otherUser: other 
        })}
      >
        <View style={styles.avatar}>
          <Ionicons name="person-circle" size={50} color="#3B82F6" />
          {other?.status === 'online' && <View style={styles.onlineDot} />}
        </View>
        
        <View style={styles.conversationInfo}>
          <View style={styles.topRow}>
            <Text style={styles.username} numberOfLines={1}>
              {other?.username || 'Người dùng'}
            </Text>
            <Text style={styles.time}>
              {formatTime(lastMsg?.sent_at)}
            </Text>
          </View>
          
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMsg?.attachments?.length > 0 
              ? '📷 Hình ảnh'
              : isMyMessage 
                ? `Bạn: ${lastMsg?.content || ''}`
                : lastMsg?.content || 'Chưa có tin nhắn'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={80} color="#CBD5E1" />
      <Text style={styles.emptyText}>Chưa có cuộc trò chuyện nào</Text>
      <Text style={styles.emptySubtext}>
        Bắt đầu chat với khách hàng từ chi tiết đơn hàng
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tin nhắn</Text>
        <View style={styles.connectionStatus}>
          <View style={[styles.statusDot, isConnected ? styles.connected : styles.disconnected]} />
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item._id}
          renderItem={renderConversation}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3B82F6']} />
          }
          contentContainerStyle={conversations.length === 0 ? styles.emptyList : null}
        />
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  connectionStatus: {
    width: 24,
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  connected: {
    backgroundColor: '#22C55E',
  },
  disconnected: {
    backgroundColor: '#EF4444',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  avatar: {
    position: 'relative',
    marginRight: 12,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  conversationInfo: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    color: '#94A3B8',
  },
  lastMessage: {
    fontSize: 14,
    color: '#64748B',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyList: {
    flex: 1,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
  },
});
