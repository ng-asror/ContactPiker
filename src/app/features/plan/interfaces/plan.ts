export interface IPlanReq {
	emoji: string;
	name: string;
	location: string;
	lat: string;
	lng: string;
	datetime: string;
}

export interface IPlansRes {
	approved_and_yours_plans: IApprovedAndYoursPlan[];
	pending_plans: any[];
}

export interface IApprovedAndYoursPlan {
	id: number;
	emoji: string;
	name: string;
	location: string;
	lat: number | null;
	lng: number | null;
	datetime: string;
	user: IUser;
	user_plan_number: number;
	tokens: string[];
	plan_users: IUser[];
	count_user: number;
	created_at: Date;
	updated_at: Date;
}

export interface IUser {
	id: number;
	first_name: string;
	last_name: string;
	phone: number | null;
	avatar: string;
	created_at: Date;
	updated_at: Date;
}

export interface IPlanShare {
	id: number
	token: string
	link: string
	msg: string
}