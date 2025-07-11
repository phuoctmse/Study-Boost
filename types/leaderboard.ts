export interface Leaderboard {
  id?: string;
  userId: string;
  score: number;
  streak: number;
  updated_at: Date;
}
