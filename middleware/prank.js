const PRANK_URLS = [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // never gonna give u up
    "https://www.nyan.cat/", // nyan Cat
    "https://pointerpointer.com/",
    "https://corndog.io/" // corndog 
];

function prankMiddleware(req, res, next) {
    const randomChance = Math.random();
    if (randomChance < 0.01) { // 1% chancethat user will be redirected to the prank urls hehe
        const randomPrankUrl = PRANK_URLS[Math.floor(Math.random() * PRANK_URLS.length)];
        return res.redirect(randomPrankUrl);
    }
    next();
}


export default prankMiddleware;