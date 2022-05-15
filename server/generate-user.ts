import User from './models/user';
import randomstring from 'randomstring';
import { IUser, IUserDocument } from "./typings/user";



export default function (userData: IUser = {}): IUserDocument {
    const { name, email, password, avatarUrl, google_id, facebook_id, linkedin_id } = userData;

    const login = randomstring.generate({ length: 10 });
    const emailVerificationToken = randomstring.generate({ length: 64 });

    return new User({
        name,
        email,
        password,
        login,
        avatarUrl,
        emailVerificationToken,
        emailIsVerified: !!(google_id || facebook_id || linkedin_id),
        google_id,
        facebook_id,
        linkedin_id
    });
}
