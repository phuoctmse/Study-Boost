import axios from 'axios';
import { ID } from 'react-native-appwrite';
import { config, databases } from '../index';

export const createChatRoom = async (user_id: string, title: string) => {
  const response = await databases.createDocument(
    config.databaseId,
    config.collections.chatRooms,
    ID.unique(),
    {
      user_id,
      title,
    }
  );
  return response.$id;
};

export const sendMessage = async (
  user_id: string,
  message_content: string,
  chat_room_id: string,
  is_from_user: boolean
) => {
  // Only send to n8n, do not save to Appwrite (n8n already does this)
  const n8nRes = await axios.post(
    'https://n8n.minhphuoc.io.vn/webhook/989c0ca7-17f0-4840-9f34-6b106d938570/chat',
    {
      message_content,
      user_id,
      chat_room_id,
      is_from_user,
    }
  );
  // Only return the AI response
  return (n8nRes.data as { message_content: string }).message_content;
};
