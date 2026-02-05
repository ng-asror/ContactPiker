import { IApprovedAndYoursPlan, IUser } from '../../plan';

export interface IRoomsRes {
  rooms: IRoom[];
}
export interface IRoom {
  id: number;
  plan: IApprovedAndYoursPlan;
  owner: IUser;
  channel_name: string;
  members_count: number;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface IRoomRes {
  id: number;
  plan: IApprovedAndYoursPlan;
  owner: IUser;
  channel_name: string;
  members: IUser[];
  messages_count: number;
  created_at: string;
  updated_at: string;
}

export interface IChatUser {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface IMessage {
  id: number;
  room: number;
  user: IChatUser;
  message: string;
  sender_type: 'initiator' | 'receiver' | string;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface IMessagesRes {
  messages: IMessage[];
  count: number;
  limit: number;
  offset: number;
}
