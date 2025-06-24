import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Modal,
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
  isLoading?: boolean; // Add this for the loading animation
}

console.log('Appwrite DB ID:', config.databaseId);
console.log('Users Collection ID:', config.collections.users);

export default function AIAssist() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [chatRoomTitle, setChatRoomTitle] = useState<string | null>(null);
  const sidebarAnimation = useRef(new Animated.Value(-350)).current;
  const overlayAnimation = useRef(new Animated.Value(0)).current;
  const router = useRouter();

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
    setSidebarVisible(false);
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
      // Determine the new chat room title
      const chatCount = chatRooms.length;
      const newTitle = chatCount === 0 ? 'Đoạn chat mới' : `Đoạn chat mới (${chatCount + 1})`;
      const roomId = await createChatRoom(userId, newTitle);
      setChatRoomId(roomId);
      setMessages([]);
      // Refresh chat rooms
      const rooms = await databases.listDocuments(
        config.databaseId,
        config.collections.chatRooms,
        [Query.equal('user_id', userId)]
      );
      setChatRooms(rooms.documents);
      setChatRoomTitle(newTitle);
    } catch (err) {
      console.error('Create chat room error:', err);
      alert('Failed to create chat room');
      setChatRoomTitle(null);
    }
    setLoading(false);
  };

  const handleSend = async () => {
    if (inputText.trim() === '' || !chatRoomId || !userId) return;
    
    // Store the message text before clearing the input
    const messageText = inputText;
    setInputText('');
    
    // Add the user's message to the UI immediately
    const userMessage: Message = {
      id: 'temp-user-' + new Date().getTime(),
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };
    
    // Add a loading message for the AI response
    const loadingMessage: Message = {
      id: 'loading-' + new Date().getTime(),
      text: '',
      isUser: false,
      timestamp: new Date(),
      isLoading: true
    };
    
    // Update the UI with user message and loading state
    setMessages(prevMessages => [...prevMessages, userMessage, loadingMessage]);
    
    // Now send the message to the API
    try {
      const aiText = await sendMessage(userId, messageText, chatRoomId, true);
      
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
      // Show error by replacing loading message with error message
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.isLoading ? 
          { ...msg, isLoading: false, text: "Sorry, something went wrong. Please try again." } : 
          msg
        )
      );
    }
  };

  // Loading animation component for the bot message
  const LoadingAnimation = () => (
    <View style={styles.loadingContainer}>
      <View style={[styles.loadingDot, styles.loadingDot1]} />
      <View style={[styles.loadingDot, styles.loadingDot2]} />
      <View style={[styles.loadingDot, styles.loadingDot3]} />
    </View>
  );

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.botMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.botBubble
      ]}>
        {item.isLoading ? (
          <LoadingAnimation />
        ) : (
          <Text style={styles.messageText}>{item.text}</Text>
        )}
      </View>
    </View>
  );

  // Show sidebar animation
  const showSidebar = () => {
    setSidebarVisible(true);
    Animated.parallel([
      Animated.timing(sidebarAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Hide sidebar animation
  const hideSidebar = () => {
    Animated.parallel([
      Animated.timing(sidebarAnimation, {
        toValue: -350,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSidebarVisible(false);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={showSidebar}>
          <Feather name="menu" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Assistant</Text>
        <TouchableOpacity style={styles.chatroomButton} onPress={handleNewChat} disabled={loading}>
          <Ionicons name="chatbubbles-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      {/* Chat Room Title */}
      {chatRoomTitle && (
        <View style={styles.chatRoomTitleContainer}>
          <Ionicons name="chatbubbles-outline" size={20} color="#737AA8" style={{ marginRight: 6 }} />
          <Text style={styles.chatRoomTitle}>{chatRoomTitle}</Text>
        </View>
      )}
      {/* Sidebar Modal for Recent Chats */}
      <Modal
        visible={sidebarVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideSidebar}
      >
        <View style={styles.sidebarOverlay}>
          <Animated.View 
            style={[
              styles.overlayBackground,
              { opacity: overlayAnimation }
            ]}
          >
            <TouchableOpacity 
              style={styles.overlayTouchable} 
              activeOpacity={0.7}
              onPress={hideSidebar}
            />
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.sidebar,
              { transform: [{ translateX: sidebarAnimation }] }
            ]}
          >
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>Đoạn chat gần đây</Text>
              <TouchableOpacity
                style={styles.closeSidebarButton}
                onPress={hideSidebar}
              >
                <Ionicons name="close-circle" size={28} color="#737AA8" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.newChatButtonContainer}>
              <TouchableOpacity
                style={styles.drawerNewChatButton}
                onPress={() => {
                  handleNewChat();
                  setSidebarVisible(false);
                }}
              >
                <Ionicons name="add-circle" size={22} color="#FFF" style={styles.newChatIcon} />
                <Text style={styles.drawerNewChatText}>Cuộc trò chuyện mới</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.chatListContainer}>
              {chatRooms.length === 0 ? (
                <View style={styles.noChatContainer}>
                  <Ionicons name="chatbubble-ellipses-outline" size={40} color="#E0E0E0" />
                  <Text style={styles.noChatText}>Không có cuộc trò chuyện nào</Text>
                </View>
              ) : (
                <FlatList
                  data={chatRooms}
                  keyExtractor={item => item.$id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.chatItem, 
                        chatRoomId === item.$id && styles.activeChatItem
                      ]}
                      onPress={() => handleSelectChatRoom(item.$id)}
                    >
                      <View style={styles.chatItemIconContainer}>
                        <Ionicons name="chatbubble" size={20} color={chatRoomId === item.$id ? "#FCC89B" : "#737AA8"} />
                      </View>
                      <View style={styles.chatItemContent}>
                        <Text 
                          style={[
                            styles.chatItemText,
                            chatRoomId === item.$id && styles.activeChatItemText
                          ]}
                          numberOfLines={1}
                        >
                          {item.title || "Chat " + (chatRooms.length - chatRooms.indexOf(item))}
                        </Text>
                        <Text style={styles.chatItemDate}>{new Date(item.$createdAt).toLocaleDateString()}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.chatListContent}
                />
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>
      {/* Chat Messages Area or Centered Prompt */}
      <View style={styles.chatroomArea}>
        {messages.length === 0 && !chatRoomId ? (
          <View style={styles.centerContent}>
            <Text style={styles.promptText}>Tôi có thể giúp gì cho bạn?</Text>
            <TouchableOpacity
              style={styles.newChatButton}
              onPress={handleNewChat}
              disabled={loading}
            >
              <Text style={styles.newChatButtonText}>Bắt đầu cuộc trò chuyện mới</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesList}
            inverted={false}
          />
        )}
      </View>
      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TouchableOpacity>
          <Feather name="sliders" size={22} color="#FCC89B" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder={chatRoomId ? 'Type your message...' : ''}
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
    paddingTop: 40,
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
  sidebarOverlay: {
    flex: 1,
    flexDirection: "row",
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  overlayTouchable: {
    flex: 1,
  },
  sidebar: {
    width: '75%',
    maxWidth: 350,
    height: '95%',
    backgroundColor: "#fff",
    paddingTop: Platform.OS === 'ios' ? 48 : 32,
    paddingBottom: 32,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sidebarTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#353859",
  },
  closeSidebarButton: {
    padding: 6,
  },
  newChatButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  drawerNewChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#737AA8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#737AA8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  drawerNewChatText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 15,
  },
  newChatIcon: {
    marginRight: 8,
  },
  chatListContainer: {
    flex: 1,
    paddingTop: 8,
  },
  chatListContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 4,
    backgroundColor: '#F8F8FC',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  activeChatItem: {
    backgroundColor: '#F0F0FF',
    borderLeftColor: '#FCC89B',
  },
  chatItemIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatItemContent: {
    flex: 1,
  },
  chatItemText: {
    color: "#353859",
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  activeChatItemText: {
    color: "#353859",
    fontWeight: '700',
  },
  chatItemDate: {
    fontSize: 12,
    color: '#737AA8',
  },
  noChatContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  noChatText: {
    color: '#A0A0A0',
    marginTop: 12,
    fontSize: 15,
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
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  promptText: {
    color: "#737AA8",
    fontSize: 22,
    fontWeight: "500",
    textAlign: "center",
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
  newChatButton: {
    marginTop: 24,
    backgroundColor: '#FCC89B',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#FCC89B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  newChatButtonText: {
    color: '#353859',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#737AA8',
    marginHorizontal: 3,
    opacity: 0.7,
  },
  loadingDot1: {
    opacity: 0.4,
    transform: [{ scale: 0.9 }],
    backgroundColor: '#737AA8',
  },
  loadingDot2: {
    opacity: 0.7,
    transform: [{ scale: 1 }],
    backgroundColor: '#737AA8',
  },
  loadingDot3: {
    opacity: 0.4,
    transform: [{ scale: 0.9 }],
    backgroundColor: '#737AA8',
  },
});
