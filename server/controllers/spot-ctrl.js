const Spot = require('../models/spot-model');

createSpot = (req, res) => {

    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a spot',
        })
    }

    const spot = new Spot(body);

    if (!spot) {
        return res.status(400).json({ success: false, error: err });
    }

    spot
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: spot._id,
                message: 'Spot successfully added!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Unable to add spot!',
            })
        })
}

updateSpot = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Spot.findOne({ _id: req.params.id }, (err, spot) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Spot not found!',
            })
        }
        spot.name = body.name;
        spot.location = body.location;
        spot.desc = body.desc;
        spot.type = body.type;
        spot.photo = body.photo;
        spot
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: spot._id,
                    message: 'Spot updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Spot not updated!',
                })
            })
    })
}

deleteSpot = async (req, res) => {
    await Spot.findOneAndDelete({ _id: req.params.id }, (err, spot) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!spot) {
            return res
                .status(404)
                .json({ success: false, error: `Spot not found` })
        }

        return res.status(200).json({ success: true, data: spot })
    }).catch(err => console.log(err))
}

getSpotById = async (req, res) => {
    await Spot.findOne({ _id: req.params.id }, (err, spot) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!spot) {
            return res
                .status(404)
                .json({ success: false, error: `Spot not found` })
        }
        return res.status(200).json({ success: true, data: spot })
    }).catch(err => console.log(err))
}

getSpots = async (req, res) => {
    await Spot.find({}, (err, spots) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!spots.length) {
            return res
                .status(404)
                .json({ success: false, error: `Spot not found` })
        }
        return res.status(200).json({ success: true, data: spots })
    }).catch(err => console.log(err))
}

module.exports = {
    createSpot,
    updateSpot,
    deleteSpot,
    getSpots,
    getSpotById,
}