import {Schema, model, UpdateWriteOpResult} from 'mongoose';
import bcrypt from 'bcryptjs';
import {IUserDocument, IUserModel} from "../typings/user";


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

// TODO:
//  - delete user
//  - edit user

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

UserSchema.statics.addUser = function(newUser: IUserDocument): Promise<IUserDocument> {
    if (newUser.password) {
        newUser.password = hashPassword(newUser.password);
    }
    return newUser.save();
};


UserSchema.methods.comparePassword = function(userPass: string, dbPass: string): boolean {
    return bcrypt.compareSync(userPass, dbPass);
};


function hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
}


export default User;