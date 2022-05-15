import {Document, Model, UpdateWriteOpResult} from "mongoose";

export interface IUser {
    name?: string;
    login?: string;
    email?: string;
    password?: string;
    avatarUrl?: string;
    emailVerificationToken?: string;
    emailIsVerified?: boolean;
    facebook_id?: string;
    google_id?: string;
    linkedin_id?: string;
    status?: TUserStatus;
}

export interface IUserDocument extends IUser, Document {
    verifyEmail: (token: string) => Promise<UpdateWriteOpResult>;
    comparePassword: (userPass: string, dbPass: string) => boolean;
}

export interface IUserModel extends Model<IUserDocument> {
    getUserByEmail: (email: string) => Promise<IUserDocument | null>;
    getUserByLogin: (login: string) => Promise<IUserDocument | null>;
    getUserById: (id: string) => Promise<IUserDocument | null>;
    getAllUsers: () => Promise<IUserDocument[]>;
    addUser: (newUser: IUserDocument) => Promise<IUserDocument>;
}

export type TUserStatus = undefined | 'online' | 'offline' | 'in-meeting';