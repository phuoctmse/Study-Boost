import { config, databases } from "../index";

export const getPackages = async () => {
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.collections.package
    );
    return response;
  } catch (error: any) {
    console.error("Error fetching packages:", error);
    throw new Error(`Failed to fetch packages: ${error.message}`);
  }
};
