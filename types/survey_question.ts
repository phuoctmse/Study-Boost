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

enum QuestionType {
  TEXT = "Text",
  MULTIPLE_CHOICE = "MultipleChoice",
  Scale = "Scale",
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
  FIVE = "5",
  SIX = "6",
  SEVEN = "7",
  EIGHT = "8",
  NINE = "9",
  TEN = "10",
}
