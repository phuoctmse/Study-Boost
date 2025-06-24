import { Feedback } from "@/types/feedback";
import { Query } from "react-native-appwrite";
import { databases } from "..";

export const submitFeedback = async (feedback: Feedback) => {
  try {
    const reponse = await databases.createDocument(
      process.env.EXPO_PUBLIC_APPWRITE_DB_ID as string,
      process.env.EXPO_PUBLIC_APPWRITE_COL_FEEDBACK_ID as string,
      feedback.user_id,
      {
        content: feedback.content,
        rate: feedback.rate,
        created_at: new Date().toISOString(),
      }
    );
  } catch (error: any) {
    throw new Error(`Failed to submit feedback: ${error.message}`);
  }
};

export const getFeedbackByUserId = async (userId: string) => {
  try {
    const response = await databases.listDocuments(
      process.env.EXPO_PUBLIC_APPWRITE_DB_ID as string,
      process.env.EXPO_PUBLIC_APPWRITE_COL_FEEDBACK_ID as string,
      [Query.equal("user_id", userId)]
    );
    return response.documents;
  } catch (error: any) {
    throw new Error(`Failed to get feedback by user ID: ${error.message}`);
  }
};