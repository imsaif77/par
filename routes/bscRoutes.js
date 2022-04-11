const express = require('express');
const router = express.Router();
const bscController = require('../controllers/bscController');

// Mainnet API
router.post('/mainnet/bnbbalcheck', bscController.bnbbalcheck);
router.post('/mainnet/transfer',bscController.transfer);
router.post('/mainnet/transactionreciept',bscController.transactionreciept);
router.post('/mainnet/usertxdetails',bscController.usertxdetails);
router.post('/mainnet/beptokenbalcheck', bscController.beptokenbalcheck);
router.post('/mainnet/transfertouser', bscController.transfertouser);
router.post('/mainnet/transfertokentostorage', bscController.transfertokentostorage);
router.post('/mainnet/transfertokentouser', bscController.transfertokentouser);
router.post('/mainnet/transferfeetouser', bscController.transferfeetousermainnet);


// Testnet API
router.post('/testnet/bnbbalcheck', bscController.bnbbalchecktestnet);
router.post('/testnet/transfer',bscController.transfertestnet);
router.post('/testnet/transactionreciept',bscController.transactionreciepttestnet);
router.post('/testnet/usertxdetails',bscController.usertxdetailstestnet);
router.post('/testnet/beptokenbalcheck', bscController.beptokenbalchecktestnet);
router.post('/testnet/transfertouser', bscController.transfertousertestnet);
router.post('/testnet/transfertokentostorage', bscController.transfertokentostoragetestnet);
router.post('/testnet/transfertokentouser', bscController.transfertokentousertestnet);
router.post('/testnet/transferfeetouser', bscController.transferfeetousertestnet);


router.post('/displaywallets', bscController.generatebscwalletdetails);
router.post('/displaywalletsstorage', bscController.generatebscwalletdetailsstorage);

router.post('/bscwalletdetails', bscController.bscwalletdetails);
router.post('/bscwalletdetailsstorage',bscController.bscwalletdetailsstorage);
router.post('/bscwalletdetailsfee',bscController.generatebscfeewallet);



module.exports = router;