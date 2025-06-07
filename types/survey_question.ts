export interface SurveyQuestion {
  id?: string;
  question_text: string;
  question_type: QuestionType;
  category: Category;
  created_at: Date;
  updated_at: Date;
  options?: string[];
  question_no: QuestionNo;
}

export interface SurveyResponse {
  id?: string;
  userId: string;
  question_id: string;
  response: string;
  submited_at: Date;
}

enum QuestionType {
  TEXT = "Text",
  MULTIPLE_CHOICE = "MultipleChoice",
  SINGLE_CHOICE = "Scale",
}

enum Category {
  GOALS = "Goal",
  STYLE = "Style",
  HABIT = "Habit",
  EMOTION = "Emotion",
}

enum QuestionNo {
  ONE = "1",
  TWO = "2",
  THREE = "3",
  FOUR = "4",
}
