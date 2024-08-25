import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; 
import ipinfo from 'ipinfo';
import qrcode from 'qrcode';

import { requireLogin } from '../middleware/requireLogin.js';
import prankMiddleware from '../middleware/prank.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, '../config.json');
function getConfig() {
    try {
        const configData = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(configData);
    } catch (error) {
        console.error('Error reading config file:', error);
        return {};
    }
}

function getCountry(ip) {
    return new Promise((resolve, reject) => {
        ipinfo(ip, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.country); // 'US', 'IN', etc.
            }
        });
    });
}


const config = getConfig();

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

router.get('/', requireLogin, (req, res)=>{
    res.render('index', { 
        error: req.flash('error'), 
        success: req.flash('success') 
    })
})


router.get('/api/:redirectString', prankMiddleware, async (req, res) => {
    try {
        const redString = req.params.redirectString;
        const link = await Link.findOne({ redirectString: redString });

        if (!link) {
            return res.status(404).send("Not Found");
        }
        
        if (link && link.active) { 
            link.visits.push({ count: 1, date: new Date() });
            await link.save();
            res.redirect(link.url);
        } else {
            res.status(404).send('Link not found or inactive.');
        }

        const ip = "8.8.8.8"; 
        let country;

        const now = new Date();
        if (link.expirationDate && now > link.expirationDate) {
            return res.status(410).send("This link has expired.");
        }

        try {
            country = await getCountry(ip); 
            if (!country) {
                console.error('country info undegined');
                return res.status(500).send('failed to get country info');
            } 
        } catch (err) {
            console.error('error while trying to get country:', err);
            return res.status(500).send('failed to get country info');
        }
        link.totalVisits += 1;

        let countryVisit = link.visits.find(v => v.country === country);

        if (countryVisit) {
            countryVisit.count += 1;
            console.log('updated countryVisit:', countryVisit);
        } else {
            link.visits.push({ country, count: 1 });
            console.log('new countryVisit:', { country, count: 1 });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let todayVisit = link.visits.find(visit => {
            if (!visit.date) {
                return false;
            }
            const visitDate = new Date(visit.date);
            visitDate.setHours(0, 0, 0, 0);
            return visitDate.getTime() === today.getTime();
        });

        if (todayVisit) {
            todayVisit.count += 1;
            console.log('updated todayVisit:', todayVisit);
        } else {
            link.visits.push({ date: today, count: 1 });
            console.log('new todayVisit:', { date: today, count: 1 });
        }

        await link.save();

        res.redirect(link.url);

    } catch (err) {
        console.error('error in /api/:redirectString route:', err);
        res.status(500).send("server Error");
    }
});

router.post('/search', async (req, res) => {
    try {
      const searchQuery = req.body.searchQuery;

      const links = await Link.find({
        name: { $regex: searchQuery, $options: 'i' }
      });
  
      res.render('search', { links });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
});
  

router.post('/', requireLogin, isValidUrl, async (req, res) => {
    try {
        const randString = random5digitString(5);
        const url = req.body.url;
        const expiration = req.body.expiration;
        let customKeyword = req.body.customKeyword;

        if (customKeyword) {
            const existingLink = await Link.findOne({ redirectString: customKeyword });
            if (existingLink) {
                return res.render('error', { error: 'Custom keyword is already takes please enter something else.' });
            }
        } else {
            customKeyword = random5digitString(5);
        }

        let expirationDate = null;
        if (expiration !== "never") {
            const expirationDays = parseInt(expiration);
            expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + expirationDays);
        }

        const link = new Link({
            url: url,
            redirectString: randString,
            expirationDate: expirationDate,
            name: req.body.name
        });

        await link.save().then((err) => {
            if (err) {
                console.log(err);
            }
            if (debug) {
                console.log(`Short URL created successfully.`);
            }
        });

        const shortUrl = `${config.domain}/${link.redirectString}`;

        qrcode.toDataURL(shortUrl, function (err, qrCodeUrl) {
            if (err) {
                console.log(err);
                return res.render('error', { error: 'failed to generate QR code.' });
            }

            res.render('success', { shortUrl, qrCodeUrl });
        });

    } catch (err) {
        console.log(err);
    }
});

router.post('/pin/:id', requireLogin, async (req, res) => {
    const { id } = req.params;
    const { pinned } = req.body; 
    
    try {
        await Link.findByIdAndUpdate(id, { pinned: pinned });
        res.redirect('/dashboard'); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


router.delete('/delete/:id', requireLogin, async (req, res) => {
    try {
        const linkId = req.params.id;
        
        const link = await Link.findOne({ _id: linkId, owner: req.user._id });
        
        if (!link) {
            return res.status(404).send('Link not found or you do not have permission to delete it.');
        }

        await Link.deleteOne({ _id: linkId });

        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/toggle-active/:id', requireLogin, async (req, res) => {
    try {
        const link = await Link.findById(req.params.id);
        link.active = !link.active;
        await link.save();
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


export default router;