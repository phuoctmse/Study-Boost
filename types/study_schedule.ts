export interface StudySchedule {
  id?: string;
  title: string;
  user_id: string;
  start_date: Date;
  end_date: Date;
  status: StudyStatus;
  created_at: Date;
  subject: string;
  weekly_plan_id?: string;
  daily_session_id?: string;
  milestones_id?: string;
}

export interface WeeklyPlan {
  study_schedule_id: string;
  week: number;
  focus: string;
  topics: string[];
  objective: string;
}

export interface DailySession {
  study_schedule_id: string;
  session_title: string;
  duration_minutes: number;
  study_days: string[]; // e.g., ["Monday", "Wednesday", "Friday"]
  activities_id: string[];
}

export interface Activities {
  daily_session_id: string;
  name: string;
  duration_minutes: number;
  description?: string;
  techniques?: string[];
}

export interface Milestones {
  id: number;
  description: string;
  target_completion: string;
  study_schedule_id: string;
}

enum StudyStatus {
  ACTIVE = "Active",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}
