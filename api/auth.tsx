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
    await account.createVerification('http://localhost:3000/verify')
    // console.log('User registration response:', response);
    const document = await databases.createDocument(
      config.databaseId,
      config.collections.users,
      response.$id,
      { username: name, email: email }
    );
    // console.log('User document created:', document);
    const session = await account.createEmailPasswordSession(email, password);
    // console.log('User registered and session created:', session);
    return response;
  } catch (error: any) {
    throw new Error(`Registration failed: ${error.message}`);
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await account.createRecovery(email, "http://localhost:3000/reset-password");
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
