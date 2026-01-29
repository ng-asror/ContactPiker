import { IUser } from '../../plan';

export interface IFriend {
  user: IUser;
  plan_ids: number[];
  plans_count: number;
}

export interface IFriendsRes {
  friends: IFriend[];
}

export interface IRemoveUserRes {
  message: string;
  room_id: number;
  removed_user_id: number;
  plan_id: number;
}
