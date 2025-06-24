import { ID } from "react-native-appwrite";
import { account, config, databases } from "./index";

export const login = async (email: string, password: string) => {
  try {
    const response = await account.createEmailPasswordSession(email, password);
    return response;
  } catch (error: any) {
    throw new Error(`Login failed: ${error.message}`);
  }
};

export const logout = async () => {
  try {
    const response = await account.deleteSession("current");
    return response;
  } catch (error: any) {
    throw new Error(`Logout failed: ${error.message}`);
  }
};

export const register = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    const response = await account.create(ID.unique(), email, password, name);
    console.log('User registration response:', response);
    const document = await databases.createDocument(
      config.databaseId,
      config.collections.users,
      response.$id,
      { username: name, email: email }
    );
    console.log('User document created:', document);
    const session = await account.createEmailPasswordSession(email, password);
    console.log('User registered and session created:', session);
    const sendEmail = await account.createVerification('https://study-boost-website.vercel.app/verify')
    console.log('email sent', sendEmail)
    return response;
  } catch (error: any) {
    throw new Error(`Registration failed: ${error.message}`);
  }
};

export const forgotPassword = async (email: string) => {
  try {
    console.log('Forgot password response:', email);
    const response = await account.createRecovery(email, "https://study-boost-website.vercel.app/recover");
    console.log('Forgot password response:', response);
    return response;
  } catch (error: any) {
    throw new Error(`Forgot password failed: ${error.message}`);
  }
}

export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    return user;
  } catch (error: any) {
    throw new Error(`Failed to get current user: ${error.message}`);
  }
};

export const getCurrentUserProfile = async () => {
  try {
    const user = await account.get();
    return user;
  } catch (error: any) {
    throw new Error(`Failed to get current user profile: ${error.message}`);
  }
};

export const getUserDocumentById = async (userId: string) => {
  try {
    const userDoc = await databases.getDocument(
      config.databaseId,
      config.collections.users,
      userId
    );
    return userDoc;
  } catch (error: any) {
    throw new Error(`Failed to get user document: ${error.message}`);
  }
};
