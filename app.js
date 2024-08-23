import 'dotenv/config';
import express from 'express';
import ejs from 'ejs';
import mongoose from 'mongoose';
import session from 'express-session';
import flash from 'express-flash';

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
app.use((req, res) => {
    res.status(404).render('404', { url: req.originalUrl });
});
app.use((req, res) => {
    res.status(500).render('500', { url: req.originalUrl });
});

app.listen(port, ()=>{
    console.log(`App started on PORT ${port}`)
})