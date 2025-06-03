import { SurveyResponse } from "@/types/survey_question";
import { config, databases } from "./index";

export const getSurveyQuestions = async () => {
  try {
    const listSurveyQuestions = await databases.listDocuments(
      config.databaseId,
      config.collections.surveyQuestions,
      []
    );
    console.log("Survey Questions:", listSurveyQuestions);
    return listSurveyQuestions;
  } catch (error: any) {
    console.log(error)
    throw new Error(`Failed to fetch survey questions: ${error.message}`);
  }
};

export const saveSurveyResponse = async (
  userSurveyRes: SurveyResponse
): Promise<SurveyResponse> => {
  try {
    const response = await databases.createDocument(
      config.databaseId,
      config.collections.surveyResponses,
      "unique()",
      {
        userSurveyRes: userSurveyRes.userId,
        question_id: userSurveyRes.question_id,
      }
    );
    // Map the response to SurveyResponse type
    const surveyResponse: SurveyResponse = {
      userId: response.userSurveyRes,
      question_id: response.question_id,
      response: response.response,
      submited_at: response.submited_at,
    };
    return surveyResponse;
  } catch (error: any) {
    throw new Error(`Failed to save survey response: ${error.message}`);
  }
};
