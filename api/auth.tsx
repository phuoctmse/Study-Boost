import { ID } from 'react-native-appwrite';
import { account, config, databases } from './index';

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
        const response = await account.deleteSession('current');
        return response;
    } catch (error: any) {
        throw new Error(`Logout failed: ${error.message}`);
    }
};

export const register = async (email: string, password: string, name: string) => {
    try {
        const response = await account.create(ID.unique(), email, password, name);
        const document = await databases.createDocument(
            config.databaseId,
            config.collections.users,
            response.$id,
            { userId: response.$id, email, name }
        );
        await account.createEmailPasswordSession(email, password);
        return response;
    } catch (error: any) {
        throw new Error(`Registration failed: ${error.message}`);
    }
};

export const getCurrentUser = async () => {
    try {
        const user = await account.get();
        return user;
    } catch (error: any) {
        throw new Error(`Failed to get current user: ${error.message}`);
    }
};