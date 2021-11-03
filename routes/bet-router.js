const express = require('express');

const BetCtrl = require('../controllers/bet-ctrl');
const FileCtrl = require('../controllers/file-ctrl');

const router = express.Router();

router.post('/bet', BetCtrl.createBet);
router.put('/bet/:id', BetCtrl.updateBet);
router.delete('/bet/:id', BetCtrl.deleteBet);
router.get('/bet/:id', BetCtrl.getBetById);
router.get('/bets', BetCtrl.getBets);
router.get('/bets/active', BetCtrl.getActiveBets);
router.get('/bets/week', BetCtrl.getWeekBets);
router.get('/bets/:id', BetCtrl.getBetsByUserId);

router.post('/files', FileCtrl.uploadFile);

module.exports = router;