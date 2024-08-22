import express from 'express';
import crypto from 'crypto';

const debug = true;

function random5digitString(length){
    return crypto.randomBytes(length)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, length)
}

// Middlware import
import isValidUrl from '../middleware/urlCheck.js';

// model import
import Link from '../models/Link.js'

const router = express.Router();

router.get('/', (req, res)=>{
    res.render('index', { 
        error: req.flash('error'), 
        success: req.flash('success') 
    })
})

router.post('/', isValidUrl ,async (req, res)=>{
    try{
        const randString = random5digitString(5);
        const url = req.body.url;

        const link = new Link({
            url: url,
            redirectString: randString
        })

        await link.save().then((err)=>{
            if(err){
                console.log(err)
            }
            if(debug){
                console.log(`Short URL created succesfully.`)
            }
        })
        res.send("Suxes")
    }catch (err){
        console.log(err)
    }
})

export default router;