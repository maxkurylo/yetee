import User, { IUser, IUserDocument } from './models/user';
import randomstring from 'randomstring';



export function generateUser(userData: IUser = {}): IUserDocument {
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
