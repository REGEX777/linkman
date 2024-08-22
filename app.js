import express from 'express';
import ejs from 'ejs';


const app = express();


app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))




const port = 3000

app.get('/', (req, res)=>{
    res.render('index')
})


app.listen(port, ()=>{
    console.log(`App started on PORT ${port}`)
})