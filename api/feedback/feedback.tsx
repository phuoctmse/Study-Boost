import { Feedback } from "@/types/feedback";
import { Query } from "react-native-appwrite";
import { databases } from "..";

export const submitFeedback = async (feedback: Feedback, id?: string) => {
  try {
    if (id) {
      // Update existing feedback
      const response = await databases.updateDocument(
        process.env.EXPO_PUBLIC_APPWRITE_DB_ID as string,
        process.env.EXPO_PUBLIC_APPWRITE_COL_FEEDBACK_ID as string,
        id,
        {
          user_id: feedback.user_id, // Make sure user_id is saved in the document
          content: feedback.content,
          rate: feedback.rate,
          created_at: new Date().toISOString(),
        }
      );
      return response;
    } else {
      // Create new feedback
      const response = await databases.createDocument(
        process.env.EXPO_PUBLIC_APPWRITE_DB_ID as string,
        process.env.EXPO_PUBLIC_APPWRITE_COL_FEEDBACK_ID as string,
        "unique()", // Generate a unique ID for the document
        {
          user_id: feedback.user_id, // Include user_id in the document data
          content: feedback.content,
          rate: feedback.rate,
          created_at: new Date().toISOString(),
        }
      );
      return response;
    }
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