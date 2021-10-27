const Bet = require('../models/bet-model');

createBet = (req, res) => {

    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a bet',
        })
    }

    const bet = new Bet(body);

    if (!bet) {
        return res.status(400).json({ success: false, error: err });
    }

    bet
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: bet._id,
                message: 'Bet successfully added!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Unable to add bet!',
            })
        })
}

deleteBet = async (req, res) => {
    await Bet.findOneAndDelete({ _id: req.params.id }, (err, bet) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!bet) {
            return res
                .status(404)
                .json({ success: false, error: `Bet not found` })
        }

        return res.status(200).json({ success: true, data: bet })
    }).catch(err => console.log(err))
}

getBetById = async (req, res) => {
    await Bet.findOne({ _id: req.params.id }, (err, bet) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!bet) {
            return res
                .status(404)
                .json({ success: false, error: `Bet not found` })
        }
        return res.status(200).json({ success: true, data: bet })
    }).catch(err => console.log(err))
}

getBets = async (req, res) => {
    await Bet.find({}, (err, bets) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!bets.length) {
            return res
                .status(404)
                .json({ success: false, error: `Bet not found` })
        }
        return res.status(200).json({ success: true, data: bets })
    }).catch(err => console.log(err))
}

module.exports = {
    createBet,
    updateBet,
    deleteBet,
    getBets,
    getBetById,
}