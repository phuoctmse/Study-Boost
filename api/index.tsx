import { Platform } from "react-native";
import { Account, Client, Databases } from "react-native-appwrite";

// Configuration from environment variables
const config = {
  devKey: process.env.EXPO_PUBLIC_APPWRITE_DEVKEY as string,
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT as string,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID as string,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DB_ID as string,
  n8n: {
    survey: process.env.EXPO_PUBLIC_N8N_SURVEY_TEST_URL as string,
  },
  collections: {
    surveyQuestions: process.env
      .EXPO_PUBLIC_APPWRITE_COL_SURVEY_QUESTIONS_ID as string,
    users: process.env.EXPO_PUBLIC_APPWRITE_COL_USERS_ID as string,
    studySchedules: process.env
      .EXPO_PUBLIC_APPWRITE_COL_STUDY_SCHEDULE_ID as string,
    weeklyPlans: process.env.EXPO_PUBLIC_APPWRITE_COL_WEEKLY_PLAN_ID as string,
    dailySessions: process.env
      .EXPO_PUBLIC_APPWRITE_COL_DAILY_SESSION_ID as string,
    activities: process.env.EXPO_PUBLIC_APPWRITE_COL_ACTIVITIES_ID as string,
    milestones: process.env.EXPO_PUBLIC_APPWRITE_COL_MILESTONES_ID as string,
    chatRooms: process.env.EXPO_PUBLIC_APPWRITE_COL_CHATROOMS_ID as string,
    aiChatMessages: process.env
      .EXPO_PUBLIC_APPWRITE_COL_AICHATMESSAGES_ID as string,
    payment: process.env.EXPO_PUBLIC_APPWRITE_COL_PAYMENT_ID as string,
    leaderBoard: process.env.EXPO_PUBLIC_APPWRITE_COL_LEADERBOARD_ID as string,
    package: process.env.EXPO_PUBLIC_APPWRITE_COL_PACKAGE_ID as string,
  },
};

// Initialize the Appwrite client
const client = new Client();
client.setEndpoint(config.endpoint || "").setProject(config.projectId || "");
client.setDevKey(config.devKey || "");

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
console.log("Databases:", databases);
const account = new Account(client);

export { account, client, config, databases };

