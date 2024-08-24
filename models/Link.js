import mongoose from "mongoose";



const visitSchema = new mongoose.Schema({
    country: { type: String },
    date: Date,
    count: {
        type: Number,
        default: 1
    },
    totalVisits: {
        type: Number,
        default: 1
    }
});


const link = new mongoose.Schema({
    url: String,
    name: String,
    redirectString: { type: String, required: true, unique: true },
    visits: [visitSchema],
    expirationDate: { type: Date, required: false },
    pinned: { type: Boolean, default: false },
})

const Link = mongoose.model('Link', link)

export default Link;