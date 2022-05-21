import {Schema, model, UpdateWriteOpResult} from 'mongoose';
import bcrypt from 'bcryptjs';
import {IUser, IUserDocument, IUserModel} from "../typings/user";


const UserSchema = new Schema<IUserModel>({
    email:      { type: String, required: true,  unique: true },
    name:       { type: String, required: true },
    isActive:   { type: Boolean, required: true, default: false },
    password:   { type: String, required: false },
    avatar:     { type: String, required: false },
    externalId: { type: String, required: false },
    metadata:   { type: Schema.Types.Mixed, required: false },
});


const User = model<IUserDocument, IUserModel>('User', UserSchema);

// TODO:
//  - delete user
//  - edit user

UserSchema.statics.getUserByEmail = async function(email: string): Promise<IUserDocument | null> {
    return await this.findOne({ email }).exec();
};

UserSchema.statics.getUserById = async function(id: string): Promise<IUserDocument | null> {
    return await this.findById(id).exec();
};

UserSchema.statics.getAllUsers = async function(): Promise<IUserDocument[]> {
    return await this.find({}).exec();
};

UserSchema.statics.addUser = function(user: IUser): Promise<IUserDocument> {
    const newUser = new User(user);
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