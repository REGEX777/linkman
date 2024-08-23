import mongoose from "mongoose";



const visitSchema = new mongoose.Schema({
    country: { type: String },
    date: Date,
    count: {
        type: Number,
        default: 1
    }
});


const link = new mongoose.Schema({
    url: String,
    redirectString: String,
    visits: [visitSchema]
})

const Link = mongoose.model('Link', link)

export default Link;