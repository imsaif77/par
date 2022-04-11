const express = require('express');
const router = express.Router();
const altcoinsController = require('../controllers/altcoinsController');

router.get('/altcoinswalletdetails', altcoinsController.altcoinswalletdetails);
router.post('/ltcbalance', altcoinsController.ltcbalance);

module.exports = router;