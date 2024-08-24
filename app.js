import 'dotenv/config';
import express from 'express';
import ejs from 'ejs';
import mongoose from 'mongoose';
import session from 'express-session';
import flash from 'express-flash';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcryptjs';

import User from './models/User.js'

const app = express();
const port = 3000

// database connection 
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Succesfully connected to the database.")
}).catch(err=>{console.log(err)})

app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true

}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return done(null, false, { message: 'Invalid email or password.' });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});


// Route imports
import index from './routes/index.js';
import dashboard from './routes/dashboard.js'
import analyse from './routes/analyse.js'
import login from './routes/login.js'
import signup from './routes/signup.js'

// routes implement
app.use('/', index);
app.use('/dashboard', dashboard)
app.use('/analyse', analyse)
app.use('/signup', signup)
app.use('/login', login)
app.use((req, res) => {
    res.status(404).render('404', { url: req.originalUrl });
});
app.use((req, res) => {
    res.status(500).render('500', { url: req.originalUrl });
});
app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
}); 

app.listen(port, ()=>{
    console.log(`App started on PORT ${port}`)
})