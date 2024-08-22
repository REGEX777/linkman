import mongoose from "mongoose";

const link = new mongoose.Schema({
    url: String,
    redirectString: String
})

const Link = mongoose.model('Link', link)

export default Link;