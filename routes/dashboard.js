import express from 'express';
import { requireLogin } from '../middleware/requireLogin.js';
import { storeOriginalUrl } from '../middleware/storeOriginalUrl.js';

// model import

import Link from '../models/Link.js'

const router = express.Router();


router.get('/', storeOriginalUrl, requireLogin, async (req, res) => {
    try {
        let sortCriteria = {};
        switch (req.query.sort) {
            case 'new':
                sortCriteria = { createdAt: -1 };
                break;
            case 'old':
                sortCriteria = { createdAt: 1 };
                break;
            case 'most-visits':
                sortCriteria = { 'visits.count': -1 };
                break;
            case 'least-visits':
                sortCriteria = { 'visits.count': 1 };
                break;
            default:
                sortCriteria = { createdAt: -1 };
                break;
        }

        const links = await Link.find({}).sort(sortCriteria);
        const totalLinks = await Link.countDocuments(); 

        res.render('dashboard', { links: links, title: "Dashboard", totalLinks: totalLinks });
    } catch (err) {
        console.log(err);
    }
});


export default router;
