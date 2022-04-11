const express = require('express');
const router = express.Router();
const bitcoinController = require('../controllers/bitcoinController');

// Mainnet
router.post('/mainnet/btcwalletdetails', bitcoinController.btcwalletdetails);
router.post('/mainnet/btcbalance', bitcoinController.btcbalance);
router.post('/mainnet/fullbtctransfer',bitcoinController.btctransfermainnet);
router.post('/mainnet/displaywallets',bitcoinController.displaywallets);
router.post('/mainnet/withdrawbtcbatch', bitcoinController.withdrawbtc);
router.post('/mainnet/btctxhashdetails',bitcoinController.btctxhashdetails);
router.post('/mainnet/btctxhashcheck',bitcoinController.btctxhashcheck);
router.post('/mainnet/displaywalletsstorage',bitcoinController.displaystoragewallets);
router.post('/mainnet/btcwalletdetailsstorage', bitcoinController.btcwalletdetailsstorage);
router.post('/mainnet/btctxdetails', bitcoinController.btctxdetails);



// Testnets
router.post('/testnet/btcwalletdetails', bitcoinController.btcwalletdetailstestnet);
router.post('/testnet/btcbalance', bitcoinController.btcbalancetestnet);
router.post('/testnet/fullbtctransfer', bitcoinController.btctransfertestnet);
router.post('/testnet/withdrawbtcbatch', bitcoinController.withdrawbtctestnet);
router.post('/testnet/displaywallets',bitcoinController.displaywalletstestnet);
router.post('/testnet/btctxhashdetails',bitcoinController.btctxhashdetailstestnet);
router.post('/testnet/btctxhashcheck',bitcoinController.btctxhashchecktestnet);
router.post('/testnet/displaywalletsstorage',bitcoinController.displaystoragewalletstestnet);
router.post('/testnet/btcwalletdetailsstorage', bitcoinController.btcwalletdetailsstoragetestnet);
router.post('/testnet/btctxdetails', bitcoinController.btctxdetailstestnet);



router.post('/generatebtctestaddress',bitcoinController.generatebtctestaddress);
router.post('/btcfee',bitcoinController.btcfee);
router.post('/btcaccountdetails',bitcoinController.btcaccountdetails);
router.post('/btcaccounttxdetails',bitcoinController.btcaccounttxdetails);
router.post('/btcaccountunspenttxdetails',bitcoinController.btcaccountunspenttxdetails);
// router.post('/withdrawbtc',bitcoinController.withdrawbtc);




module.exports = router;