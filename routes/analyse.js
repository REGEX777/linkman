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

        // Aggregate daily visits
        const dailyVisits = visits.reduce((acc, visit) => {
            const visitDate = new Date(visit.date).toDateString();
            if (!acc[visitDate]) {
                acc[visitDate] = 0;
            }
            acc[visitDate] += visit.count;
            return acc;
        }, {});

        // Aggregate visits by country
        const countryVisits = visits.reduce((acc, visit) => {
            if (acc[visit.country]) {
                acc[visit.country] += visit.totalVisits;
            } else {
                acc[visit.country] = visit.totalVisits;
            }
            return acc;
        }, {});

        // Convert to an array of objects for easier sorting and chart data
        const sortedCountries = Object.entries(countryVisits)
            .map(([country, visits]) => ({ country, visits }))
            .sort((a, b) => b.visits - a.visits); // Sort by visits, descending
        
        // Separate country names and visit counts for chart
        const countryNames = sortedCountries.map(item => item.country);
        const countryVisitCounts = sortedCountries.map(item => item.visits);
        
        res.render('analyse', { 
            linkUrl: `https://domain.com/${redirectString}`, 
            dailyVisits: JSON.stringify(dailyVisits),
            countryNames: JSON.stringify(countryNames),
            countryVisitCounts: JSON.stringify(countryVisitCounts),
            sortedCountries: sortedCountries
        });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).send('Server Error');
    }
});

export default router;