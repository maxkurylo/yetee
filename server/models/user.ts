import {Schema, model, Document, Model, UpdateWriteOpResult} from 'mongoose';
import bcrypt from 'bcryptjs';

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
    comparePassword: (userPass: string, dbPass: string) => Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {
    getUserByEmail: (email: string) => Promise<IUserDocument>;
    getUserByLogin: (login: string) => Promise<IUserDocument>;
    getUserById: (id: string) => Promise<IUserDocument>;
    getAllUsers: () => Promise<IUserDocument[]>;
    addUser: (newUser: IUserDocument) => Promise<IUserDocument>;
}

export type TUserStatus = undefined | 'online' | 'offline' | 'in-meeting';

const UserSchema = new Schema<IUserModel>({
    login: { type: String,  required: true,  unique: true },
    name: { type: String, required: true },
    emailIsVerified: { type: Boolean, default: false },
    password: String,
    avatarUrl: String,
    emailVerificationToken: String,
    email: String, // used for local strategy
    facebook_id:  String,
    google_id: String,
    linkedin_id: String,
    status: String, // online | offline | in-meeting | undefined
});


const User = model<IUserDocument, IUserModel>('User', UserSchema);


UserSchema.statics.getUserByEmail = async function(email: string): Promise<IUserDocument | null> {
    return await this.findOne({ email }).exec();
};

UserSchema.statics.getUserByLogin = async function(login: string): Promise<IUserDocument | null> {
    return await this.findOne({ login }).exec();
};

UserSchema.statics.getUserById = async function(id: string): Promise<IUserDocument | null> {
    return await this.findById(id).exec();
};

UserSchema.statics.getAllUsers = async function(): Promise<IUserDocument[]> {
    return await this.find({}).exec();
};

UserSchema.statics.addUser = async function(newUser: IUserDocument): Promise<IUserDocument> {
    if (newUser.password) {
        newUser.password = await hashPassword(newUser.password);
    }
    return await newUser.save();
};

UserSchema.methods.verifyEmail = function(token: string): Promise<UpdateWriteOpResult> {
    const query = { emailVerificationToken: token };
    const update = { emailIsVerified: true };
    return this.updateOne(query, update).exec();
};

UserSchema.methods.comparePassword = function(userPass: string, dbPass: string): Promise<boolean> {
    return bcrypt.compare(userPass, dbPass);
};

export default User;


function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}