import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; 
import ipinfo from 'ipinfo';

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

router.get('/', (req, res)=>{
    res.render('index', { 
        error: req.flash('error'), 
        success: req.flash('success') 
    })
})


router.get('/api/:redirectString', async (req, res)=>{
    try{
        const redString = req.params.redirectString;
        const link = await Link.findOne({redirectString: redString});

        if(!link){
            res.status(404).send("Not Found")
        }
        const ip = req.ip; 
        const country = await getCountry(ip); 

        const visit = link.visits.find(v => v.country === country);

        if (visit) {
            visit.count += 1; 
        } else {
            link.visits.push({ country }); 
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayVisit = link.visits.find(visit=>{
            const visitDate = new Date(visit.date);
            visitDate.setHours(0,0,0,0)
            return visitDate.getTime() === today.getTime();
        })

        if (todayVisit) {
            todayVisit.count += 1;
        } else {
            link.visits.push({ date: today, count: 1 });
        }

        await link.save();

        res.redirect(link.url);

    }catch(err){
        console.error(err);
        res.status(500).send("Server Error");
    }
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
        const shortUrl = `${config.domain}${link.redirectString}`;
        res.render('success', {shortUrl})
    }catch (err){
        console.log(err)
    }
})

export default router;