export interface INotificationData {
  plan_id: number;
  room_id: number;
  sender_id: number;
  message_id: number;
}

export interface INotification {
  id: number;
  notification_type: 'chat_message';
  title: string;
  message: string;
  data: INotificationData;
  is_read: boolean;
  created_at: Date;
}

export interface INotificationWrapper {
  type: 'notification';
  notification: INotification;
}
