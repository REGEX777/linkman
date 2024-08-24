import express from 'express';


import { requireLogin } from '../middleware/requireLogin.js';
// model import

import Link from '../models/Link.js'

const router = express.Router();


router.get('/', requireLogin, async (req, res)=>{
    try{    
        const links = await Link.find({})
        console.log(links);
        res.render('dashboard', {links: links})
    }catch(err){
        console.log(err);
        
    }
});


export default router;
