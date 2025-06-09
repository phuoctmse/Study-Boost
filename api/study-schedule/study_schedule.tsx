// import { config, databases } from "../index";

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

// export const saveStudySchedule = async (studySchedule: any) => {
//     try {
//         const response = await databases.createDocument(
//         config.databaseId,
//         config.collections.studySchedule,
//         studySchedule.$id, // Assuming $id is the unique identifier
//         studySchedule
//         );
//         console.log("Study Schedule Save Output:", response);
//         return response;
//     } catch (error: any) {
//         console.error("Study schedule save error:", error);
//         throw new Error(`Failed to save study schedule: ${error.message}`);
//     }
// }