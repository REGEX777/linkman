import express from 'express';
import ejs from 'ejs';


const app = express();
const port = 3000


app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))


// Route imports
import index from './routes/index.js';
import dashboard from './routes/dashboard.js'
import analyse from './routes/analyse.js'

// routes implement
app.use('/', index);
app.use('/dashboard', dashboard)
app.use('/analyse', analyse)


app.listen(port, ()=>{
    console.log(`App started on PORT ${port}`)
})