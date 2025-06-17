import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Query } from 'react-native-appwrite';
import { getCurrentUserProfile } from '../../api/auth';
import { createChatRoom, sendMessage } from '../../api/chat/chat';
import { config, databases } from '../../api/index';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AIAssist() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [chatRoomTitle, setChatRoomTitle] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUserProfile();
        setUserId(user.$id);
        // Fetch chat rooms for this user
        const rooms = await databases.listDocuments(
          config.databaseId,
          config.collections.chatRooms,
          [Query.equal('user_id', user.$id)]
        );
        setChatRooms(rooms.documents);
      } catch (err) {
        console.error('Failed to fetch user or chat rooms:', err);
      }
    };
    fetchUser();
  }, []);

  const handleSelectChatRoom = async (roomId: string) => {
    setChatRoomId(roomId);
    setShowDropdown(false);
    setLoading(true);
    try {
      const msgs = await databases.listDocuments(
        config.databaseId,
        config.collections.aiChatMessages,
        [Query.equal('chat_room_id', roomId)]
      );
      // Map to Message[]
      const mapped = msgs.documents.map((doc: any) => ({
        id: doc.$id,
        text: doc.message_content,
        isUser: doc.is_from_user,
        timestamp: new Date(doc.sent_at),
      }));
      setMessages(mapped);
      // Set chat room title
      const room = chatRooms.find(r => r.$id === roomId);
      setChatRoomTitle(room ? room.title : null);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setMessages([]);
      setChatRoomTitle(null);
    }
    setLoading(false);
  };

  const handleNewChat = async () => {
    setLoading(true);
    try {
      if (!userId) throw new Error('User not loaded');
      const roomId = await createChatRoom(userId, 'New AI chat');
      setChatRoomId(roomId);
      setMessages([]);
      // Refresh chat rooms
      const rooms = await databases.listDocuments(
        config.databaseId,
        config.collections.chatRooms,
        [Query.equal('user_id', userId)]
      );
      setChatRooms(rooms.documents);
      setChatRoomTitle('New AI chat');
    } catch (err) {
      console.error('Create chat room error:', err);
      alert('Failed to create chat room');
      setChatRoomTitle(null);
    }
    setLoading(false);
  };

  const handleSend = async () => {
    if (inputText.trim() === '' || !chatRoomId || !userId) return;
    setLoading(true);
    try {
      const aiText = await sendMessage(userId, inputText, chatRoomId, true);
      setInputText('');
      // After sending, refresh messages from Appwrite
      const msgs = await databases.listDocuments(
        config.databaseId,
        config.collections.aiChatMessages,
        [Query.equal('chat_room_id', chatRoomId)]
      );
      const mapped = msgs.documents.map((doc: any) => ({
        id: doc.$id,
        text: doc.message_content,
        isUser: doc.is_from_user,
        timestamp: new Date(doc.sent_at),
      }));
      setMessages(mapped);
    } catch (err) {
      console.error('Send message error:', err);
      alert('Failed to send message');
    }
    setLoading(false);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.botMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.botBubble
      ]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Assistant</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowDropdown(!showDropdown)}
            disabled={loading || chatRooms.length === 0}
          >
            <Ionicons name="chevron-down" size={20} color="#007AFF" />
            <Text style={{ marginLeft: 4, color: '#007AFF', fontWeight: 'bold' }}>Recent chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatroomButton} onPress={handleNewChat} disabled={loading}>
            <Ionicons name="chatbubbles-outline" size={24} color="#007AFF" />
            <Text style={{ marginLeft: 6, color: '#007AFF', fontWeight: 'bold' }}>New Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Chat Room Title */}
      {chatRoomTitle && (
        <View style={styles.chatRoomTitleContainer}>
          <Ionicons name="chatbubbles-outline" size={20} color="#737AA8" style={{ marginRight: 6 }} />
          <Text style={styles.chatRoomTitle}>{chatRoomTitle}</Text>
        </View>
      )}
      {/* Dropdown for recent chats */}
      {showDropdown && (
        <View style={styles.dropdownList}>
          {chatRooms.map(room => (
            <TouchableOpacity
              key={room.$id}
              style={styles.dropdownItem}
              onPress={() => handleSelectChatRoom(room.$id)}
            >
              <Text>{room.title || room.$id}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {/* Chat Messages Area with white border */}
      <View style={styles.chatroomArea}>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          inverted={false}
        />
      </View>
      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder={chatRoomId ? 'Type your message...' : 'Start a new chat to begin'}
          multiline
          editable={!!chatRoomId && !loading}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={!chatRoomId || loading}>
          <Ionicons name="send" size={24} color="#007AFF" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#737AA8',
    paddingTop: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#737AA8',
    borderBottomWidth: 0,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  chatroomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FCC89B',
    borderRadius: 15,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 15,
    marginRight: 8,
  },
  dropdownList: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    zIndex: 10,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  chatroomArea: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 18,
    marginHorizontal: 10,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  messagesList: {
    padding: 8,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    marginVertical: 4,
    flexDirection: 'row',
  },
  userMessage: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 2,
  },
  userBubble: {
    backgroundColor: '#FCC89B',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#E5E5EA',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#F5F5F7',
    borderTopWidth: 0,
    alignItems: 'center',
    borderRadius: 16,
    margin: 12,
    marginBottom: 18,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    color: '#333',
    fontSize: 16,
  },
  sendButton: {
    padding: 8,
    backgroundColor: '#FCC89B',
    borderRadius: 15,
  },
  chatRoomTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  chatRoomTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 2,
  },
});
