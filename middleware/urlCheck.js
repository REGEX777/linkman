import isUrl from 'is-url';

function isValidUrl(req, res, next){
    const url = req.body.url;
    if(isUrl(url)){
        next()
    } else {
        req.flash('error', 'Invalid URL');
        res.redirect('/')
    }
}

export default isValidUrl;