// Prerequisites
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}

// external imports
import http from 'http';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import bodyParser from 'body-parser';
import passport from 'passport';

// own modules imports
import enableSSLForProduction from './modules/ssl-for-production';
import connectToMongo from './modules/mongo-connect';
import setupAuth from './modules/auth';
import WebSockets  from './modules/sockets';

import AuthRoutes from './routes/auth';
import GroupsRoutes from './routes/groups';
import UsersRoutes from './routes/users';

// constants
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

const CLIENT_DIST_DIRECTORY = '../client/dist/client';
const CLIENT_INDEX_PATH = path.join(__dirname, CLIENT_DIST_DIRECTORY, 'index.html');

// Connect to database
connectToMongo(MONGO_URL);

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

// Setup all authentication passports
setupAuth();

// Setup websockets
WebSockets.init(server, passport);




// API
app.use("/api/auth", AuthRoutes);
app.use("/api/groups", GroupsRoutes);
app.use("/api/users", UsersRoutes);




// serve static files
app.use(express.static(path.join(__dirname, CLIENT_DIST_DIRECTORY)));

// Handle Angular routing
app.get('*', (req: any, res: any) => { res.sendFile(CLIENT_INDEX_PATH); });

// start listening
server.listen(PORT, () => console.log(`Backend listening on port ${PORT}!`));
