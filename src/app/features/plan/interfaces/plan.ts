export interface IUser {
    id: number;
    first_name: string;
    last_name: string;
    phone: number | string | null;
    avatar: string;
    created_at: Date | string;
    updated_at: Date | string;
}

export interface IPlanUser {
    id: number;
    plan: number;
    user: IUser;
    status: 'Принято' | 'Отклонено' | 'Ожидает ответа' | 'Удален из группы чата';
    created_at: Date | string;
    updated_at: Date | string;
}

interface IBasePlan {
    id: number;
    emoji: string;
    name: string;
    location: string;
    lat: number | string | null;
    lng: number | string | null;
    datetime: Date;
    user: IUser;
    count_user: number;
    created_at: Date | string;
    updated_at: Date | string;
}

export interface IApprovedAndYoursPlan extends IBasePlan {
    user_plan_number: number;
    tokens: string[];
    plan_users: IPlanUser[];
}

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
    pending_plans: IApprovedAndYoursPlan[];
}

export interface IPlanShare {
    id: number;
    token: string;
    link: string;
    msg: string;
}

export interface IRootPlanRes {
    id: string; // UUID
    token: string;
    plan: IApprovedAndYoursPlan;
    created_by: IUser;
    expires_at: string;
    max_uses: number;
    current_uses: number;
    is_active: boolean;
    is_valid: boolean;
    created_at: string;
    updated_at: string;
}