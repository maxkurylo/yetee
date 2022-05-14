// Prerequisites
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}
if (!process.env.SECRET) {
    throw 'App secret is missing! Add SECRET environment variable'
}

// external imports
import http from 'http';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import bodyParser from 'body-parser';
import passport from 'passport';
import { connect } from 'mongoose';

// own modules imports
import enableSSLForProduction from './ssl-for-production';
import WebSockets  from './sockets';
import JwtAuth from './passports/jwt';
import LinkedInAuth from './passports/linkedin';
import GoogleAuth from './passports/google';
import FacebookAuth from './passports/facebook';
import AuthRoutes from './routes/auth';
import EverythingRoutes from './routes/everything';

// constants
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.DB_URL || '';

const CLIENT_DIST_DIRECTORY = '../client/dist/client';
const CLIENT_INDEX_PATH = path.join(__dirname, CLIENT_DIST_DIRECTORY, 'index.html');

const ENABLE_LINKEDIN_LOGIN = process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET;
const ENABLE_GOOGLE_LOGIN = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
const ENABLE_FACEBOOK_LOGIN = process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET;


// Mongo
connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(`MongoDB connected to ${MONGO_URL}`))
    .catch(err => { throw err });


// Passport stuff
passport.serializeUser((user: Express.User, done: any) => { done(null, user); });
passport.deserializeUser((obj: Express.User, done: any) => { done(null, obj); });


// app creation
const app = express();
const server = http.createServer(app);

// app configuration
enableSSLForProduction(app);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.enable('trust proxy');


// add websockets
WebSockets.init(server, passport);


// AUTH
JwtAuth(passport);

if (ENABLE_LINKEDIN_LOGIN) {
    LinkedInAuth(passport);
}
if (ENABLE_GOOGLE_LOGIN) {
    GoogleAuth(passport);
}
if (ENABLE_FACEBOOK_LOGIN) {
    FacebookAuth(passport);
}


// API
app.use("/api/auth", AuthRoutes);
app.use("/api/everything", EverythingRoutes);


// serve static files
app.use(express.static(path.join(__dirname, CLIENT_DIST_DIRECTORY)));


// Handle Angular routing
app.get('*', (req: any, res: any) => { res.sendFile(CLIENT_INDEX_PATH); });

// start listening
server.listen(PORT, () => console.log(`Backend listening on port ${PORT}!`));
