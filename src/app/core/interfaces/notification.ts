export interface INotificationData {
  plan_id: number;
  room_id: number;
  sender_id: number;
  message_id: number;
}

export interface INotification {
  id: number;
  notification_type: 'chat_message' | string; // kelajakda boshqa turlar ham bo‘lishi mumkin
  title: string;
  message: string;
  data: INotificationData;
  is_read: boolean;
  created_at: string; // yoki Date, agar parse qilsangiz
}

export interface INotificationWrapper {
  type: 'notification';
  notification: INotification;
}
