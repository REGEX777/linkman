import express from 'express';
import Link from '../models/Link.js'; 

const router = express.Router();

router.get('/:redirectString', async (req, res) => {
    try {
        const redString = req.params.redirectString
        const link = await Link.findOne({ redirectString: redString }); 
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
            linkUrl: `https://domain.com/${link.redirectString}`, 
            dailyVisits: JSON.stringify(dailyVisits)
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

export default router;
