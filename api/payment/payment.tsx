import { Payment } from "@/types/payment";
import { ID, Query } from "react-native-appwrite";
import { config, databases } from "../index";

export const createPayment = async (payment: Payment) => {
  try {
    const response = await databases.createDocument(
      config.databaseId,
      config.collections.payment,
      ID.unique(),
      payment
    );
  } catch (error) {
    console.error("Payment creation error:", error);
    throw new Error(`Failed to create Payment: ${error}`);
  }
};

export const getPaymentById = async (paymentId: string) => {
  try {
    const response = await databases.getDocument(
      config.databaseId,
      config.collections.payment,
      paymentId
    );
    return response;
  } catch (error) {}
};

export const getPaymentsByUserId = async (userId: string) => {
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.collections.payment,
      [Query.equal("user_id", userId)]
    );
  } catch (error) {
    console.error("Error fetching payments by user ID:", error);
    throw new Error(`Failed to fetch payments: ${error}`);
  }
};
