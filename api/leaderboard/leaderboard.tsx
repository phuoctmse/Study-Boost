import { Query } from "react-native-appwrite";
import { config, databases } from "../index";

export const getLeaderboardByScore = async () => {
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.collections.leaderBoard,
      [Query.orderDesc("score"), Query.limit(10)]
    );
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
  } catch (error: any) {
    throw new Error(`Failed to get leaderboard: ${error.message}`);
  }
};

export const savePointToLeaderboard = async (userId: string) => {
  try {
    const checkUserIsInLeaderboard = await databases.listDocuments(
      config.databaseId,
      config.collections.leaderBoard,
      [Query.equal("userId", userId)]
    );
    if (checkUserIsInLeaderboard.documents.length > 0) {
      const userDocument = checkUserIsInLeaderboard.documents[0];
      const updatedScore = userDocument.score + 10;
      const updatedStreak = userDocument.streak + 1;
      await databases.updateDocument(
        config.databaseId,
        config.collections.leaderBoard,
        userDocument.$id,
        {
          score: updatedScore,
          streak: updatedStreak,
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
          score: 10,
          streak: 1,
          updated_at: new Date().toISOString(),
        }
      );
    }
  } catch (error: any) {
    throw new Error(`Failed to save point to leaderboard: ${error.message}`);
  }
};
