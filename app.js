import express from 'express';


const app = express();


app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))




const port = 3000

app.get('/', (req, res)=>{
    res.send("hello world")
})


app.listen(port, ()=>{
    console.log(`App started on PORT ${port}`)
})