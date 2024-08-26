export function storeOriginalUrl(req, res, next) {
    if (!req.isAuthenticated()) {
        res.cookie('redUrl', req.url);
    }
    next();
}
