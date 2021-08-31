const mongoose = require('mongoose')
const Schema = mongoose.Schema

const spotSchema = new Schema(
    {
        user: { type: String },
        name: { type: String },
        location: { type: String },
        lat: { type: Number },
        lng: { type: Number },
        desc: { type: String },
        type: { type: String },
        photo: { type: String },
        
    },
    { timestamps: true }
);

module.exports = mongoose.model('spots', spotSchema);