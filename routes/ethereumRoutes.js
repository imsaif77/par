const express = require('express');
const router = express.Router();
const ethereumController = require('../controllers/ethereumController');

// Mainnet API
router.post('/mainnet/ethbalcheck', ethereumController.ethbalcheck);
router.post('/mainnet/transferethereum',ethereumController.transferethereum);
router.post('/mainnet/transactionreciept',ethereumController.transactionreciept);
router.post('/mainnet/usertxdetails',ethereumController.usertxdetails);
router.post('/mainnet/transfertouser',ethereumController.transferETHmultiuserWeb3Mainnet);
// router.post('/mainnet/transfertouser',ethereumController.transferETHmultiuserMainnet);
router.post('/mainnet/erctokenbalcheck', ethereumController.erctokenbalcheck);
router.post('/mainnet/transferethereumtouser', ethereumController.transferethereumtouser);
router.post('/mainnet/transfertokentostorage', ethereumController.transfertokentostorage);
router.post('/mainnet/transfertokentouser', ethereumController.transfertokentouser);
router.post('/mainnet/transferethereumfeetouser', ethereumController.transferethereumfeetousermainnet);


// Testnet API
router.post('/testnet/ethbalcheck', ethereumController.ethbalchecktestnet);
router.post('/testnet/transferethereum',ethereumController.transferethereumtestnet);
router.post('/testnet/transactionreciept',ethereumController.transactionreciepttestnet);
router.post('/testnet/usertxdetails',ethereumController.usertxdetailstestnet);
router.post('/testnet/transfertouser',ethereumController.transferETHmultiuserWeb3);
// router.post('/testnet/transfertouserCheck',ethereumController.transferETHmultiuser);
router.post('/testnet/erctokenbalcheck', ethereumController.erctokenbalchecktestnet);
router.post('/testnet/transferethereumtouser', ethereumController.transferethereumtousertestnet);
router.post('/testnet/transfertokentostorage', ethereumController.transfertokentostoragetestnet);
router.post('/testnet/transfertokentouser', ethereumController.transfertokentousertestnet);
router.post('/testnet/transferethereumfeetouser', ethereumController.transferethereumfeetousertestnet);


router.post('/displaywallets', ethereumController.generateethwalletdetails);
router.post('/displaywalletsstorage', ethereumController.generateethwalletdetailsstorage);

router.post('/ethwalletdetails', ethereumController.ethwalletdetails);
router.post('/ethwalletdetailsstorage',ethereumController.ethwalletdetailsstorage);
router.post('/ethwalletdetailsfee',ethereumController.generateethfeewallet);



module.exports = router;