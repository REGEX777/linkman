import express from 'express';

// model import

import Link from '../models/Link.js'

const router = express.Router();


router.get('/', async (req, res)=>{
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

        const links = await Link.find({ owner: req.user._id }).sort(sortCriteria);

        res.render('dashboard', {links: links})
    }catch(err){
        console.log(err);
        
    }
});


export default router;
