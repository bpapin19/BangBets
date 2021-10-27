const express = require('express');

const BetCtrl = require('../controllers/bet-ctrl');
const FileCtrl = require('../controllers/file-ctrl');

const router = express.Router();

router.post('/bet', BetCtrl.createBet());
router.delete('/bet/:id', BetCtrl.deleteBet());
router.get('/bet/:id', BetCtrl.getBetById());
router.get('/bets', BetCtrl.getBets());

router.post('/files', FileCtrl.uploadFile());

module.exports = router;