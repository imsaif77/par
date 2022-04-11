const express = require('express');
const router = express.Router();
const walletController = require('../controllers/tronController');


// Testnet
router.post('/testnet/trxBalance', walletController.trxBalanceTestnet);
router.post('/testnet/sendTrx', walletController.sendTrxTestnet);
router.post('/testnet/unconfirmedTXhashReciept', walletController.unconfirmedtransactionreciepttestnet);
router.post('/testnet/confirmedTXhashReciept', walletController.confirmedtransactionreciepttestnet);
router.post('/testnet/sendBulkTransaction', walletController.sendTRXtoMultiUsersTestnet);
router.post('/testnet/sendBulkTransactionAdmin', walletController.sendTRXtoMultiUsersTestnetAdmin);
router.post('/testnet/tokenbalance', walletController.tokenbalancetestnet);
router.post('/testnet/sendtokentostorage', walletController.sendtokentostoragetestnet);
router.post('/testnet/sendtokentouser', walletController.sendtokentousertestnet);
router.post('/testnet/sendtrxtouser', walletController.sendTrxTestnettouser);
router.post('/testnet/sendtrxtouserfee', walletController.sendTrxFeeTestnettouser);



// Mainnet
router.post('/mainnet/displayWallets', walletController.displayWallets);
router.post('/mainnet/displayWalletsStorage', walletController.displayWalletsStorage);
router.post('/mainnet/displayWalletsFee', walletController.displayWalletsFee);

router.post('/mainnet/trxBalance', walletController.trxBalanceMainnet);
router.post('/mainnet/sendTrx', walletController.sendTrxMainnet);
router.post('/mainnet/unconfirmedTXhashReciept', walletController.unconfirmedtransactionrecieptmainnet);
router.post('/mainnet/confirmedTXhashReciept', walletController.confirmedtransactionrecieptmainnet);
router.post('/mainnet/sendBulkTransaction', walletController.sendTRXtoMultiUsers);
router.post('/mainnet/sendBulkTransactionAdmin', walletController.sendTRXtoMultiUsersAdmin);
router.post('/mainnet/displayWalletsStorage', walletController.displayWalletsStorage);
router.post('/mainnet/tokenbalance', walletController.tokenbalance);
router.post('/mainnet/sendtokentostorage', walletController.sendtokentostorage);
router.post('/mainnet/sendtokentouser', walletController.sendtokentouser);
router.post('/mainnet/sendtrxtouser', walletController.sendTrxMainnettouser);
router.post('/mainnet/sendtrxtouserfee', walletController.sendTrxFeeMainnettouser);


module.exports = router;