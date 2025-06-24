import { n8nSurveyData } from "@/types/n8n_response";
import { Query } from "react-native-appwrite";
import { config, databases } from "../index";

export const sendSurveyToN8n = async (userId: string, responses: { questionId: string; response: string }[]): Promise<n8nSurveyData> => {
    try {
        // Log the request payload
        const payload = {
            userId,
            responses,
        };
        console.log("Sending to n8n payload:", JSON.stringify(payload, null, 2));

        const response = await fetch("https://n8n.minhphuoc.io.vn/webhook/survey/start", {
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

export const getWeeklyPlanByStudyScheduleId = async (studyScheduleId: string) => {
    try {
        const response = await databases.listDocuments(
            config.databaseId,
            config.collections.weeklyPlans,
            [Query.equal("study_schedule_id", studyScheduleId)]
        );
        console.log("Weekly Plan Output:", response);
        return response.documents;
    } catch (error: any) {
        console.error("Weekly Plan fetch error:", error);
        throw new Error(`Failed to fetch weekly plan: ${error.message}`);
    }
};

export const getStudySchedule = async (studyScheduleId: string) => {
    try {
        const studySchedule = await databases.getDocument(
            config.databaseId,
            config.collections.studySchedules,
            studyScheduleId
        );
        console.log("Study Schedule Output:", studySchedule);
        return studySchedule;
    } catch (error: any) {
        console.error("Study schedule fetch error:", error);
        throw new Error(`Failed to fetch study schedule: ${error.message}`);
    }
};

export const getStudySchedulesByUserId = async (userId: string) => {
    try {
        const response = await databases.listDocuments(
            config.databaseId,
            config.collections.studySchedules,
            [Query.equal("user_id", userId)]
        );
        console.log("Study Schedules by User Output:", response);
        return response.documents;
    } catch (error: any) {
        console.error("Study schedules by user fetch error:", error);
        throw new Error(`Failed to fetch study schedules by user: ${error.message}`);
    }
};

export const getWeeklyPlansByIds = async (ids: string[]) => {
    if (!ids || ids.length === 0) return [];
    console.log('WeeklyPlan Collection ID:', config.collections.weeklyPlans);
    const response = await databases.listDocuments(
        config.databaseId,
        config.collections.weeklyPlans,
        [Query.equal('$id', ids)]
    );
    return response.documents;
};

export const getDailySessionsByIds = async (ids: string[]) => {
    if (!ids || ids.length === 0) return [];
    const response = await databases.listDocuments(
        config.databaseId,
        config.collections.dailySessions,
        [Query.equal('$id', ids)]
    );
    return response.documents;
};

export const getActivitiesByIds = async (ids: string[]) => {
    if (!ids || ids.length === 0) return [];
    const response = await databases.listDocuments(
        config.databaseId,
        config.collections.activities,
        [Query.equal('$id', ids)]
    );
    return response.documents;
};

export const getMilestonesByIds = async (ids: string[]) => {
    if (!ids || ids.length === 0) return [];
    const response = await databases.listDocuments(
        config.databaseId,
        config.collections.milestones,
        [Query.equal('$id', ids)]
    );
    return response.documents;
};

