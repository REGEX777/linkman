import express from 'express';

const router = express.Router();


router.get('/search', (req, res) => {
    res.render('search', {
        links: [],
        title: "Search Results"
    });
});

router.post('/search', async (req, res) => {
    try {
        const searchQuery = req.body.searchQuery;

        const links = await Link.find({
            name: {
                $regex: searchQuery,
                $options: 'i'
            }
        });

        res.render('search', {
            links
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


export default router;