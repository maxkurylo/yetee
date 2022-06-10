import {Document, Model, UpdateWriteOpResult} from "mongoose";

export interface IUser {
    name: string;
    email: string;
    isActive?: boolean;
    password?: string;
    avatarUrl?: string;
    externalId?: string;
    metadata?: any;
}

export interface IUserDocument extends IUser, Document {
    comparePassword: (userPass: string, dbPass: string) => boolean;
}

export interface IUserModel extends Model<IUserDocument> {
    getUserByEmail: (email: string) => Promise<IUserDocument | null>;
    getUserById: (id: string) => Promise<IUserDocument | null>;
    getAllUsers: () => Promise<IUserDocument[]>;
    addUser: (newUser: IUser) => Promise<IUserDocument>;
}

export type TUserStatus = undefined | 'online' | 'offline' | 'in-meeting';