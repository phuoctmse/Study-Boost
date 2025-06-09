import { config, databases } from "../index";

export const getSurveyQuestions = async () => {
  try {
    
    const listSurveyQuestions = await databases.listDocuments(
      config.databaseId,
      config.collections.surveyQuestions,
      []
    );
    // console.log("Survey Questions Output:", listSurveyQuestions);
    return listSurveyQuestions;
  } catch (error: any) {
    console.error("Survey questions fetch error:", error);
    throw new Error(`Failed to fetch survey questions: ${error.message}`);
  }
};


