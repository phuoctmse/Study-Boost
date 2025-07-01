import { Query } from "react-native-appwrite";
import { config, databases } from "../index";

export const getLeaderboardByScore = async () => {
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.collections.leaderBoard,
      [Query.orderDesc("score"), Query.limit(10)]
    );
    return response;
  } catch (error: any) {
    throw new Error(`Failed to get leaderboard: ${error.message}`);
  }
};

export const getLeaderboardByStreak = async () => {
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.collections.leaderBoard,
      [Query.orderDesc("streak"), Query.limit(10)]
    );
    return response;
  } catch (error: any) {
    throw new Error(`Failed to get leaderboard: ${error.message}`);
  }
};

const isStreakUpdatedToday = (lastUpdateTime: string): boolean => {
  const lastUpdate = new Date(lastUpdateTime);
  const now = new Date();
  
  return lastUpdate.toDateString() === now.toDateString();
};

export const updateDailyStreak = async (userId: string) => {
  try {
    const userDoc = await databases.listDocuments(
      config.databaseId,
      config.collections.leaderBoard,
      [Query.equal("userId", userId)]
    );

    if (userDoc.documents.length > 0) {
      const document = userDoc.documents[0];
      
      // Check if streak was already updated today
      if (!isStreakUpdatedToday(document.updated_at)) {
        await databases.updateDocument(
          config.databaseId,
          config.collections.leaderBoard,
          document.$id,
          {
            streak: document.streak + 1,
            updated_at: new Date().toISOString(),
          }
        );
        return true;
      }
      return false;
    }
    return false;
  } catch (error: any) {
    throw new Error(`Failed to update daily streak: ${error.message}`);
  }
};

export const savePointToLeaderboard = async (userId: string, userName: string) => {
  try {
    const checkUserIsInLeaderboard = await databases.listDocuments(
      config.databaseId,
      config.collections.leaderBoard,
      [Query.equal("userId", userId)]
    );
    if (checkUserIsInLeaderboard.documents.length > 0) {
      const userDocument = checkUserIsInLeaderboard.documents[0];
      const updatedScore = userDocument.score + 10;
      
      await databases.updateDocument(
        config.databaseId,
        config.collections.leaderBoard,
        userDocument.$id,
        {
          score: updatedScore,
          updated_at: new Date().toISOString(),
        }
      );
    } else {
      await databases.createDocument(
        config.databaseId,
        config.collections.leaderBoard,
        userId,
        {
          userId: userId,
          userName: userName,
          score: 10,
          streak: 0,
          updated_at: new Date().toISOString(),
        }
      );
    }
  } catch (error: any) {
    throw new Error(`Failed to save point to leaderboard: ${error.message}`);
  }
};
