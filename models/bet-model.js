const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const betSchema = new Schema(
    {
        userId: { type: String },
        userEmail: { type: String },
        game: { type: Array },
        betAmount: { type: Number },
        winAmount: { type: Number },
        status: { type: Boolean, default: false },
        result: { type: String, default: "in progress" }
    },
    { timestamps: true }
);

module.exports = mongoose.model('bets', betSchema);