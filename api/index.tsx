import { Platform } from 'react-native';
import { Client, Databases, Account } from 'react-native-appwrite';

// Configuration from environment variables
const config = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DB_ID,
    collections: {
        tasks: process.env.EXPO_PUBLIC_APPWRITE_COL_TASKS_ID,
    }
};

// Initialize the Appwrite client
const client = new Client();
client
    .setEndpoint(config.endpoint || '')
    .setProject(config.projectId || '');

// Set platform based on OS
switch (Platform.OS) {
    case "ios":
        // Only set if bundleId is defined
        if (process.env.EXPO_PUBLIC_APPWRITE_BUNDLE_ID) {
            client.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_BUNDLE_ID);
        }
        break;
    case "android":
        // Only set if packageName is defined
        if (process.env.EXPO_PUBLIC_APPWRITE_PACKAGE_NAME) {
            client.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PACKAGE_NAME);
        }
}

// Initialize services
const databases = new Databases(client);
const account = new Account(client);

export { client, databases, account, config };