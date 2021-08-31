const express = require('express');

const SpotCtrl = require('../controllers/spot-ctrl');
const FileCtrl = require('../controllers/file-ctrl');

const router = express.Router();

router.post('/spot', SpotCtrl.createSpot);
router.put('/spot/:id', SpotCtrl.updateSpot);
router.delete('/spot/:id', SpotCtrl.deleteSpot);
router.get('/spot/:id', SpotCtrl.getSpotById);
router.get('/spots', SpotCtrl.getSpots);

router.post('/files', FileCtrl.uploadFile);

module.exports = router;