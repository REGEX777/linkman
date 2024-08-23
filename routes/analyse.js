import express from 'express';
import Link from '../models/Link.js'; 

const router = express.Router();

router.get('/:redirectString', async (req, res) => {
    try {
        const { redirectString } = req.params;
        console.log('received redirectString:', redirectString);
        
        const link = await Link.findOne({ redirectString }).exec();
        
        if (!link) {
            console.log('Link not found');
            return res.status(404).send('Link not found');
        }

        const visits = link.visits;

        const dailyVisits = visits.reduce((acc, visit) => {
            const visitDate = new Date(visit.date).toDateString();

            if (!acc[visitDate]) {
                acc[visitDate] = 0;
            }
            acc[visitDate] += visit.count;

            return acc;
        }, {});
        
        
        res.render('analyse', { 
            linkUrl: `https://domain.com/${redirectString}`, 
            dailyVisits: JSON.stringify(dailyVisits)
        });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).send('Server Error');
    }
});

export default router;
