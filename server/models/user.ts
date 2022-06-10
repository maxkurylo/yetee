import {Schema, model} from 'mongoose';
import bcrypt from 'bcryptjs';
import {IUser, IUserDocument, IUserModel} from "../typings/user";


const UserSchema = new Schema<IUserModel>({
    email:      { type: String, required: true,  unique: true },
    name:       { type: String, required: true },
    isActive:   { type: Boolean, required: true, default: false },
    password:   { type: String, required: false },
    avatarUrl:  { type: String, required: false },
    externalId: { type: String, required: false },
    metadata:   { type: Schema.Types.Mixed, required: false },
});


const User = model<IUserDocument, IUserModel>('User', UserSchema);

// TODO:
//  - delete user
//  - edit user

function hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
}

export function getUserByEmail(email: string, projection: any = {}): Promise<IUserDocument | null> {
    return User.findOne({ email }, projection).exec();
}

export function getUserById(id: string, projection: any = {}): Promise<IUserDocument | null> {
    return User.findById(id, projection).exec();
}

export function getUserByExternalId(externalId: string, projection: any = {}): Promise<IUserDocument | null> {
    return User.findOne({ externalId }, projection).exec();
}

export function getAllUsers(projection: any = {}): Promise<IUserDocument[] | null> {
    return User.find({}, projection).exec();
}

export function comparePassword(userPass: string, dbPass: string): Promise<boolean> {
    return bcrypt.compare(userPass, dbPass);
}

export function addUser(user: IUser): Promise<IUserDocument> {
    const newUser = new User(user);
    if (newUser.password) {
        newUser.password = hashPassword(newUser.password);
    }
    return newUser.save();
}