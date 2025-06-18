import { n8nSurveyData } from "@/types/n8n_response";
import { Activities, DailySession, Milestones, StudySchedule, WeeklyPlan } from "@/types/study_schedule";
import { ID } from "react-native-appwrite";
import { config, databases } from "../index";

export const sendSurveyToN8n = async (userId: string, responses: { questionId: string; response: string }[]): Promise<n8nSurveyData> => {
    try {
        // Log the request payload
        const payload = {
            userId,
            responses,
        };
        console.log("Sending to n8n payload:", JSON.stringify(payload, null, 2));

        const response = await fetch("https://n8n.minhphuoc.io.vn/webhook-test/survey/start", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(payload),
        });

        // Log the response status and headers
        console.log("N8N Response Status:", response.status);
        console.log("N8N Response Headers:", response.headers);

        if (!response.ok) {
            // Try to get more error details
            const errorText = await response.text();
            console.error("N8N Error Response:", errorText);
            throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
        }

        const data = await response.json();
        console.log("Survey sent successfully:", data);
        return data;
    } catch (error) {
        console.error("Failed to send survey:", error);
        throw error;
    }
};

export const saveStudySchedule = async (studySchedule: StudySchedule) => {
    try {
        const response = await databases.createDocument(
            config.databaseId,
            config.collections.studySchedules,
            ID.unique(), // Assuming $id is the unique identifier
            studySchedule
        );
        console.log("Study Schedule Save Output:", response);
        return response;
    } catch (error: any) {
        console.error("Study schedule save error:", error);
        throw new Error(`Failed to save study schedule: ${error.message}`);
    }
}

export const saveWeeklyPlan = async (weeklyPlan: WeeklyPlan) => {
    try {
        const response = await databases.createDocument(
            config.databaseId,
            config.collections.weeklyPlans,
            ID.unique(), // Assuming $id is the unique identifier
            weeklyPlan
        );
        console.log("Weekly Plan Save Output:", response);
        return response;
    } catch (error: any) {
        console.error("Weekly Plan save error:", error);
        throw new Error(`Failed to save Weekly Plan: ${error.message}`);
    }
}

export const saveDailySession = async (dailySession: DailySession) => {
    try {
        const response = await databases.createDocument(
            config.databaseId,
            config.collections.dailySessions,
            ID.unique(), // Assuming $id is the unique identifier
            dailySession
        );
        console.log("Daily Session Save Output:", response);
        return response;
    } catch (error: any) {
        console.error("Daily Session save error:", error);
        throw new Error(`Failed to save Daily Session: ${error.message}`);
    }
}

export const saveActivities = async (activities: Activities) => {
    try {
        const response = await databases.createDocument(
            config.databaseId,
            config.collections.activities,
            ID.unique(), // Assuming $id is the unique identifier
            activities
        );
        console.log("Activities Save Output:", response);
        return response;
    } catch (error: any) {
        console.error("Activities save error:", error);
        throw new Error(`Failed to save Activities: ${error.message}`);
    }
}

export const saveMilestones = async (milestones: Milestones) => {
    try {
        const response = await databases.createDocument(
            config.databaseId,
            config.collections.milestones,
            ID.unique(), // Assuming $id is the unique identifier
            milestones
        );
        console.log("Milestones Save Output:", response);
        return response;
    } catch (error: any) {
        console.error("Milestones save error:", error);
        throw new Error(`Failed to save Milestones: ${error.message}`);
    }
}

// export const getStudySchedule = async (studyScheduleId: string) => {
//   try {
//     const studySchedule = await databases.getDocument(
//       config.databaseId,
//       config.collections.studySchedule,
//       studyScheduleId
//     );
//     console.log("Study Schedule Output:", studySchedule);
//     return studySchedule;
//   } catch (error: any) {
//     console.error("Study schedule fetch error:", error);
//     throw new Error(`Failed to fetch study schedule: ${error.message}`);
//   }
// }

