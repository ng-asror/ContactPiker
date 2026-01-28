import { IApprovedAndYoursPlan, IUser } from "../../plan";

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