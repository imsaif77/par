const express = require('express');
const router = express.Router();
const dogecoinController = require('../controllers/dogecoinController');

// Mainnet
router.get('/mainnet/dogewalletdetails', dogecoinController.dogewalletdetails);
router.get('/mainnet/dogebalance', dogecoinController.dogebalance);
router.post('/mainnet/fulldogetransfer',dogecoinController.dogetransfermainnet);

// router.post('/generatedogetestaddress',dogecoinController.generatedogetestaddress);
router.post('/dogefee',dogecoinController.dogefee);
router.post('/dogeaccountdetails',dogecoinController.dogeaccountdetails);
router.post('/dogeaccounttxdetails',dogecoinController.dogeaccounttxdetails);
router.post('/dogeaccountunspenttxdetails',dogecoinController.dogeaccountunspenttxdetails);
router.post('/dogetxhashcheck',dogecoinController.dogetxhashcheck);
router.post('/dogetxhashdetails',dogecoinController.dogetxhashdetails);
router.post('/withdrawdoge',dogecoinController.withdrawdoge);


// Testnets
router.get('/testnet/dogewalletdetails', dogecoinController.dogewalletdetailstestnet);
router.get('/testnet/dogebalance', dogecoinController.dogebalancetestnet);
router.post('/testnet/fulldogetransfer', dogecoinController.dogetransfertestnet);




module.exports = router;