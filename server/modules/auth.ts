import JwtAuth from '../passports/jwt';
import LinkedInAuth from '../passports/linkedin';
import GoogleAuth from '../passports/google';
import FacebookAuth from '../passports/facebook';
import { hostname } from "os";

const JWT_SECRET = process.env.JWT_SECRET;
const APP_URL = hostname();

console.log('HOSTNAME:', APP_URL);

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_CALLBACK_URL = `${APP_URL}/api/auth/linkedin/callback`;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = `${APP_URL}/api/auth/google/callback`;


const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
const FACEBOOK_CALLBACK_URL = `${APP_URL}/api/auth/facebook/callback`;


export default function() {
    if (!JWT_SECRET) {
        throw 'App secret is missing! Add JWT_SECRET environment variable'
    }

    JwtAuth(JWT_SECRET);

    if (LINKEDIN_CLIENT_ID && LINKEDIN_CLIENT_SECRET) {
        LinkedInAuth(LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_CALLBACK_URL);
    }
    if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
        GoogleAuth(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL);
    }
    if (FACEBOOK_CLIENT_ID && FACEBOOK_CLIENT_SECRET) {
        FacebookAuth(FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, FACEBOOK_CALLBACK_URL);
    }
}
