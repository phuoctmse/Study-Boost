export interface n8nSurveyData {
    user_id: string,
    title: string,
    subject: string,
    weekly_plan: string[]
    daily_session: {
        session_title: string,
        duration_minutes: number,
        study_days: string[],
        activities: {
            name: string,
            duration_minutes: number,
            description: string,
            techniques: string[]
        }[]
    },
    milestones: {
        id: number,
        description: string
    }[]
} 