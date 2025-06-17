export interface AIChatMessage {
  chat_room_id: string;
  message_content: string;
  is_from_user: boolean;
  sent_at: Date;
}

export interface ChatRooms {
  user_id: string;
  title: string;
}
