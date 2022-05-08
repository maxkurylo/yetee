if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");
const passport = require('passport');
const path = require("path");
const cors = require('cors');
const bodyParser = require('body-parser');
mongoose.plugin(require('meanie-mongoose-to-json'));
const http = require('http');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.DB_URL;

const auth = require("./routes/auth");
const everything = require("./routes/everything");

const app = express();
const server = http.createServer(app);


const Sockets = require('./sockets');
Sockets.init(server, passport);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


app.use(passport.initialize());
app.use(passport.session());

require('./passports/jwt')(passport);
// require('./passports/facebook')(passport);
require('./passports/google')(passport);
require('./passports/linkedin')(passport);


app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(console.log(`MongoDB connected ${MONGO_URI}`))
    .catch(err => console.error('Error on connecting to MongoDB', err));


// Routes
app.use("/api/auth", auth);
app.use("/api/everything", everything);

server.listen(PORT, () => console.log(`Backend listening on port ${PORT}!`));
