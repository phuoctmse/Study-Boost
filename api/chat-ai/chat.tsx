import { AIChatMessage, ChatRooms } from "@/types/ai-chat";
import { ID, Query } from "react-native-appwrite";
import { config, databases } from "../index";

export const saveChatAi = async (aiChatBody: AIChatMessage) => {
  try {
    const response = await databases.createDocument(
      config.databaseId,
      config.collections.studySchedules,
      ID.unique(),
      aiChatBody
    );
  } catch (error) {
    console.error("AI Chat save error:", error);
    throw new Error(`Failed to save AI Chat: ${error}`);
  }
};

export const getChatAi = async (userId: string) => {
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.collections.aiChatMessages,
      [Query.equal("user_id", userId)]
    );
  } catch (error) {
    console.error("AI Chat get error:", error);
    throw new Error(`Failed to get AI Chat: ${error}`);
  }
};

export const deleteChatAi = async (userId: string) => {
  try {
    const response = await databases.deleteDocument(
      config.databaseId,
      config.collections.aiChatMessages,
      userId
    );
  } catch (error) {
    console.error("AI Chat delete error:", error);
    throw new Error(`Failed to delete AI Chat: ${error}`);
  }
};

export const createChatRoom = async (chatRoom: ChatRooms) => {
  try {
    const response = await databases.createDocument(
      config.databaseId,
      config.collections.chatRooms,
      ID.unique(),
      chatRoom
    );
    return response;
  } catch (error) {
    console.error("Chat Room creation error:", error);
    throw new Error(`Failed to create Chat Room: ${error}`);
  }
};

export const getChatRooms = async (userId: string) => {
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.collections.chatRooms,
      [Query.equal("user_id", userId)]
    );
    return response;
  } catch (error) {
    console.error("Get Chat Rooms error:", error);
    throw new Error(`Failed to get Chat Rooms: ${error}`);
  }
};

export const deleteChatRoom = async (roomId: string) => {
  try {
    const response = await databases.deleteDocument(
      config.databaseId,
      config.collections.chatRooms,
      roomId
    );
    return response;
  } catch (error) {
    console.error("Delete Chat Room error:", error);
    throw new Error(`Failed to delete Chat Room: ${error}`);
  }
};
