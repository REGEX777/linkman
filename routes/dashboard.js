import express from 'express';
import { requireLogin } from '../middleware/requireLogin.js';

// model import

import Link from '../models/Link.js'

const router = express.Router();


router.get('/', requireLogin, async (req, res)=>{
    try{
        let sortCriteria = {};
        // switch case for sorting
        switch (req.query.sort) {
            case 'new':
                sortCriteria = { createdAt: -1 }; 
                break;
            case 'old':
                sortCriteria = { createdAt: 1 }; 
                break;
            case 'most-visits':
                sortCriteria = { visits: -1 }; 
                break;
            case 'least-visits':
                sortCriteria = { visits: 1 }; 
                break;
            default:
                sortCriteria = { createdAt: -1 }; 
                break;
        }

        const links = await Link.find({}).sort(sortCriteria);
        res.render('dashboard', {links: links, title: "Dashboard"})
    }catch(err){
        console.log(err);
    }
});


export default router;
