const express = require('express');
const router = express.Router();
const stellarController = require('../controllers/stellarController');

// Mainnet
router.post('/mainnet/xlmwalletdetails', stellarController.xlmwalletdetails);
router.post('/mainnet/xlmwalletdetailsstorage', stellarController.xlmwalletdetailsstorage);


// Testnets
router.post('/testnet/transfertestnet', stellarController.xlmtransfertestnet);




module.exports = router;