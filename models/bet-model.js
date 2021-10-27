const mongoose = require('mongoose')
const Schema = mongoose.Schema

const betSchema = new Schema(
    {
        userId: { type: String },
        user_email: { type: String },
        name: { type: String },
        location: { type: String },
        lat: { type: Number },
        lng: { type: Number },
        desc: { type: String },
        type: { type: String },
        
    },
    { timestamps: true }
);

module.exports = mongoose.model('bets', betSchema);