import { IUser } from "../../plan";

export interface IFriend {
    user: IUser;
    plan_ids: number[];
    plans_count: number;
}

export interface IFriendsRes {
    friends: IFriend[];
}