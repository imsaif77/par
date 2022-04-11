const config = require('../config')
const TronWeb = require('tronweb');
const BJSON = require('buffer-json')
var eccrypto = require("eccrypto");
const bip39 = require('bip39');
const bip32 =require('bip32');
const bitcoin = require('bitgo-utxo-lib')



// Configure Tron Blockchain
const HttpProvider = TronWeb.providers.HttpProvider; // Optional provider, can just use a url for the nodes instead

// Mnemonic Decryption for user mnemonics
// const memprivkey =  process.env.mempriv;
// const memenckey =  process.env.memenc;
// const pribuf =  BJSON.parse(memprivkey); 
// const encbuf =  BJSON.parse(memenckey);
// const mnemonicsDecrypted = new Array();
// eccrypto.decrypt(pribuf, encbuf).then(function(plaintext) {
//     decryptedText = plaintext.toString();
   
//     mnemonicsDecrypted.push(decryptedText);   
// });


// Mnemonic Decryption for Storage mnemonics
// const memprivkeystorage =  process.env.memprivstorage;
// const memenckeystorage =  process.env.memencstorage;
// const pribufstorage =  BJSON.parse(memprivkeystorage); 
// const encbufstorage =  BJSON.parse(memenckeystorage);
// const mnemonicsDecryptedstorage = [];
// eccrypto.decrypt(pribufstorage, encbufstorage).then(function(plaintext) {
//     decryptedTextstorage = plaintext.toString();
//     mnemonicsDecryptedstorage.push(decryptedTextstorage);   
// });


function toFixed(x) {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split('e-')[1]);
      if (e) {
          x *= Math.pow(10,e-1);
          x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
          e -= 20;
          x /= Math.pow(10,e);
          x += (new Array(e+1)).join('0');
      }
    }
    return x;
}


// Display Wallets using Account Number 
exports.displayWallets = async (req, res, next) => {
    try {
        const accountBatch = req.body.batchNo;
        const fromAccountNo = req.body.fromAccountNo;
        const toAccountNo = req.body.toAccountNo;
      
        const seed = await bip39.mnemonicToSeed((process.env.memenc).toString());
        const node = await bip32.fromSeed(seed);
        const addresses=[];
        for(let i=fromAccountNo;i<toAccountNo;i++){
            const walletPath = {
                "standard": "m/44'/195'/"+accountBatch+"'/0/"+i+"",
            };
            const child = await node.derivePath(walletPath.standard);
            const privateKey = await child.privateKey.toString('hex');
            const address = await TronWeb.address.fromPrivateKey(privateKey);
            let addressDetails={
                "addressNo" : parseInt(i),
                "publicAddress" : address,
            };
            addresses.push(addressDetails);
        }
     
        const details = addresses;
        res.status(200).json({
            status: true,
            message : 'Account Details',
            data: {
                details
            }
        });

    } catch (err) {
        next(err);
    }
};


// Display Wallets using Account Number Storage
exports.displayWalletsStorage = async (req, res, next) => {
    try {
        const accountBatch = req.body.batchNo;
        const fromAccountNo = req.body.fromAccountNo;
        const toAccountNo = req.body.toAccountNo;
      
        const seed = await bip39.mnemonicToSeed((process.env.memencstorage).toString());
        const node = await bip32.fromSeed(seed);
        const addresses=[];
        for(let i=fromAccountNo;i<toAccountNo;i++){
            const walletPath = {
                "standard": "m/44'/195'/"+accountBatch+"'/0/"+i+"",
            };
            const child = await node.derivePath(walletPath.standard);
            const privateKey = await child.privateKey.toString('hex');
            const address = await TronWeb.address.fromPrivateKey(privateKey);
            let addressDetails={
                "addressNo" : parseInt(i),
                "publicAddress" : address,
            };
            addresses.push(addressDetails);
        }
     
        const details = addresses;
        res.status(200).json({
            status: true,
            message : 'Account Details',
            data: {
                details
            }
        });

    } catch (err) {
        next(err);
    }
};

// Display Wallets using Account Number Storage
exports.displayWalletsFee = async (req, res, next) => {
    try {
        const accountBatch = req.body.batchNo;
        const fromAccountNo = req.body.fromAccountNo;
        const toAccountNo = req.body.toAccountNo;
        const mnemonicsDetail = process.env.feestorage;

        const seed = await bip39.mnemonicToSeed(mnemonicsDetail.toString());
        const node = await bip32.fromSeed(seed);
        const addresses=[];
        for(let i=fromAccountNo;i<toAccountNo;i++){
            const walletPath = {
                "standard": "m/44'/195'/"+accountBatch+"'/0/"+i+"",
            };
            const child = await node.derivePath(walletPath.standard);
            const privateKey = await child.privateKey.toString('hex');
            const address = await TronWeb.address.fromPrivateKey(privateKey);
            let addressDetails={
                "addressNo" : parseInt(i),
                "publicAddress" : address,
            };
            addresses.push(addressDetails);
        }
     
        const details = addresses;
        res.status(200).json({
            status: true,
            message : 'Account Details',
            data: {
                details
            }
        });

    } catch (err) {
        next(err);
    }
};



// Send TRX Testnet
exports.sendTrxTestnet = async (req, res, next) => {
    try {
        const fromBatchNo = req.body.accounts;
        const fromAccountNo = req.body.addressnumber;
        const toAccountAddress = req.body.toAddress;

        const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
        const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
        const eventServer = new HttpProvider("https://api.shasta.trongrid.io");
        

        const seed = await bip39.mnemonicToSeed((process.env.memenc).toString());
        const node = await bip32.fromSeed(seed);
        const walletPath = {
            "standard": "m/44'/195'/"+fromBatchNo+"'/0/"+fromAccountNo+"",
        };
        const child = await node.derivePath(walletPath.standard);
        const privateKey = await child.privateKey.toString('hex');

        const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
        const address = await TronWeb.address.fromPrivateKey(privateKey);
        const balance = tronWeb.fromSun(await tronWeb.trx.getBalance(address));
        const hash = await tronWeb.trx.sendTransaction(toAccountAddress, tronWeb.toSun(balance));
       
        res.status(200).json({
            status: true,
            message : 'TRX Sent Sucessfully',
            data: {
                hash
            }
        });

    } catch (err) {
        next(err);
    }
};


// Send TRX Mainnet
exports.sendTrxMainnet = async (req, res, next) => {
    try {
        const fromBatchNo = req.body.accounts;
        const fromAccountNo = req.body.addressnumber;
        const toAccountAddress = req.body.toAddress;

        const fullNode = new HttpProvider("https://api.trongrid.io");
        const solidityNode = new HttpProvider("https://api.trongrid.io");
        const eventServer = new HttpProvider("https://api.trongrid.io");
        


        const seed = await bip39.mnemonicToSeed((process.env.memenc).toString());
        const node = await bip32.fromSeed(seed);
        const walletPath = {
            "standard": "m/44'/195'/"+fromBatchNo+"'/0/"+fromAccountNo+"",
        };
        const child = await node.derivePath(walletPath.standard);
        const privateKey = await child.privateKey.toString('hex');

        const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
        const address = await TronWeb.address.fromPrivateKey(privateKey);
        const balance = tronWeb.fromSun(await tronWeb.trx.getBalance(address));
        const hash = await tronWeb.trx.sendTransaction(toAccountAddress, tronWeb.toSun(balance));
       
        res.status(200).json({
            status: true,
            message : 'TRX Sent Sucessfully',
            data: {
                hash
            }
        });

    } catch (err) {
        next(err);
    }
};



// Send TRX Testnet to user
exports.sendTrxTestnettouser = async (req, res, next) => {
    try {
        const fromBatchNo = req.body.accounts;
        const fromAccountNo = req.body.addressnumber;
        const toAccountAddress = req.body.toAddress;
        const amounts = req.body.amounts;


        const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
        const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
        const eventServer = new HttpProvider("https://api.shasta.trongrid.io");
        

        const seed = await bip39.mnemonicToSeed((process.env.memencstorage).toString());
        const node = await bip32.fromSeed(seed);
        const walletPath = {
            "standard": "m/44'/195'/"+fromBatchNo+"'/0/"+fromAccountNo+"",
        };
        const child = await node.derivePath(walletPath.standard);
        const privateKey = await child.privateKey.toString('hex');

        const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
        const address = await TronWeb.address.fromPrivateKey(privateKey);
        const balance = tronWeb.fromSun(await tronWeb.trx.getBalance(address));
        const hash = await tronWeb.trx.sendTransaction(toAccountAddress, tronWeb.toSun(amounts));
       
        res.status(200).json({
            status: true,
            message : 'TRX Sent Sucessfully',
            data: {
                hash
            }
        });

    } catch (err) {
        next(err);
    }
};


// Send TRX Mainnet
exports.sendTrxMainnettouser = async (req, res, next) => {
    try {
        const fromBatchNo = req.body.accounts;
        const fromAccountNo = req.body.addressnumber;
        const toAccountAddress = req.body.toAddress;
        const amounts = req.body.amounts;

        const fullNode = new HttpProvider("https://api.trongrid.io");
        const solidityNode = new HttpProvider("https://api.trongrid.io");
        const eventServer = new HttpProvider("https://api.trongrid.io");
        


        const seed = await bip39.mnemonicToSeed((process.env.memencstorage).toString());
        const node = await bip32.fromSeed(seed);
        const walletPath = {
            "standard": "m/44'/195'/"+fromBatchNo+"'/0/"+fromAccountNo+"",
        };
        const child = await node.derivePath(walletPath.standard);
        const privateKey = await child.privateKey.toString('hex');

        const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
        const address = await TronWeb.address.fromPrivateKey(privateKey);
        const balance = tronWeb.fromSun(await tronWeb.trx.getBalance(address));
        const hash = await tronWeb.trx.sendTransaction(toAccountAddress, tronWeb.toSun(amounts));
       
        res.status(200).json({
            status: true,
            message : 'TRX Sent Sucessfully',
            data: {
                hash
            }
        });

    } catch (err) {
        next(err);
    }
};



// Send TRX Fee Testnet to user
exports.sendTrxFeeTestnettouser = async (req, res, next) => {
    try {
        const fromBatchNo = req.body.accounts;
        const fromAccountNo = req.body.addressnumber;
        const toAccountAddress = req.body.toAddress;
        const amounts = req.body.amounts;


        const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
        const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
        const eventServer = new HttpProvider("https://api.shasta.trongrid.io");
        
        const mnemonicsDetail = process.env.feestorage;
        const seed = await bip39.mnemonicToSeed(mnemonicsDetail.toString());
        const node = await bip32.fromSeed(seed);
        const walletPath = {
            "standard": "m/44'/195'/"+fromBatchNo+"'/0/"+fromAccountNo+"",
        };
        const child = await node.derivePath(walletPath.standard);
        const privateKey = await child.privateKey.toString('hex');

        const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
        const address = await TronWeb.address.fromPrivateKey(privateKey);
        const balance = tronWeb.fromSun(await tronWeb.trx.getBalance(address));
        const hash = await tronWeb.trx.sendTransaction(toAccountAddress, tronWeb.toSun(amounts));
       
        res.status(200).json({
            status: true,
            message : 'TRX Sent Sucessfully',
            data: {
                hash
            }
        });

    } catch (err) {
        next(err);
    }
};


// Send TRX Fee Mainnet to user
exports.sendTrxFeeMainnettouser = async (req, res, next) => {
    try {
        const fromBatchNo = req.body.accounts;
        const fromAccountNo = req.body.addressnumber;
        const toAccountAddress = req.body.toAddress;
        const amounts = req.body.amounts;


        const fullNode = new HttpProvider("https://api.trongrid.io");
        const solidityNode = new HttpProvider("https://api.trongrid.io");
        const eventServer = new HttpProvider("https://api.trongrid.io");
        
        const mnemonicsDetail = process.env.feestorage;
        const seed = await bip39.mnemonicToSeed(mnemonicsDetail.toString());
        const node = await bip32.fromSeed(seed);
        const walletPath = {
            "standard": "m/44'/195'/"+fromBatchNo+"'/0/"+fromAccountNo+"",
        };
        const child = await node.derivePath(walletPath.standard);
        const privateKey = await child.privateKey.toString('hex');

        const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
        const address = await TronWeb.address.fromPrivateKey(privateKey);
        const balance = tronWeb.fromSun(await tronWeb.trx.getBalance(address));
        const hash = await tronWeb.trx.sendTransaction(toAccountAddress, tronWeb.toSun(amounts));
       
        res.status(200).json({
            status: true,
            message : 'TRX Sent Sucessfully',
            data: {
                hash
            }
        });

    } catch (err) {
        next(err);
    }
};

// Balance Check Testnet
exports.trxBalanceTestnet = async (req, res, next) => {
    try {
        const userAddress = req.body.address;


        const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
        const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
        const eventServer = new HttpProvider("https://api.shasta.trongrid.io");
        const tronWeb = new TronWeb(fullNode,solidityNode,eventServer);

        const balance = tronWeb.fromSun(await tronWeb.trx.getBalance(userAddress));
        res.status(200).json({
            status: true,
            message : 'TRX Balance of user',
            data: {
                address : userAddress,
                balance
            }
        });

    } catch (err) {
        next(err);
    }
};

// Balance Check Mainnet
exports.trxBalanceMainnet = async (req, res, next) => {
    try {
        const userAddress = req.body.address;


        const fullNode = new HttpProvider("https://api.trongrid.io");
        const solidityNode = new HttpProvider("https://api.trongrid.io");
        const eventServer = new HttpProvider("https://api.trongrid.io");
        const tronWeb = new TronWeb(fullNode,solidityNode,eventServer);

        const balance = tronWeb.fromSun(await tronWeb.trx.getBalance(userAddress));
       
        res.status(200).json({
            status: true,
            message : 'TRX Balance of user',
            data: {
                address : userAddress,
                balance
            }
        });

    } catch (err) {
        next(err);
    }
};




// Get Unconfirmed Transaction Reciept Testnet
exports.unconfirmedtransactionreciepttestnet = async (req, res, next) => {
    try {
        
        const transactionHash = req.body.transactionHash;

        const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
        const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
        const eventServer = new HttpProvider("https://api.shasta.trongrid.io");
        const tronWeb = new TronWeb(fullNode,solidityNode,eventServer);

        let receipt = await tronWeb.trx.getUnconfirmedTransactionInfo(transactionHash)
        res.status(200).json({
            status: true,
            message : 'Transaction Reciept of Unconfirmed Transaction',
            data: {
                receipt : receipt
            }
        });

    } catch (err) {
        next(err);
    }
};

// Get Unconfirmed Transaction Reciept Mainnet
exports.unconfirmedtransactionrecieptmainnet = async (req, res, next) => {
    try {
        
        const transactionHash = req.body.transactionHash;

        const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
        const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
        const eventServer = new HttpProvider("https://api.shasta.trongrid.io");
        const tronWeb = new TronWeb(fullNode,solidityNode,eventServer);

        let receipt = await tronWeb.trx.getUnconfirmedTransactionInfo(transactionHash)
        res.status(200).json({
            status: true,
            message : 'Transaction Reciept of Unconfirmed Transaction',
            data: {
                receipt : receipt
            }
        });

    } catch (err) {
        next(err);
    }
};

// Get Confirmed Transaction Reciept Testnet
exports.confirmedtransactionreciepttestnet = async (req, res, next) => {
    try {
        
        const transactionHash = req.body.transactionHash;


        const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
        const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
        const eventServer = new HttpProvider("https://api.shasta.trongrid.io");
        const tronWeb = new TronWeb(fullNode,solidityNode,eventServer);


        let receipt = await tronWeb.trx.getConfirmedTransaction(transactionHash)
        res.status(200).json({
            status: true,
            message : 'Transaction Reciept of Unconfirmed Transaction',
            data: {
                receipt : receipt
            }
        });

    } catch (err) {
        next(err);
    }
};

// Get Confirmed Transaction Reciept Mainnet
exports.confirmedtransactionrecieptmainnet = async (req, res, next) => {
    try {
        
        const transactionHash = req.body.transactionHash;


        const fullNode = new HttpProvider("https://api.trongrid.io");
        const solidityNode = new HttpProvider("https://api.trongrid.io");
        const eventServer = new HttpProvider("https://api.trongrid.io");
        const tronWeb = new TronWeb(fullNode,solidityNode,eventServer);


        let receipt = await tronWeb.trx.getConfirmedTransaction(transactionHash)
        res.status(200).json({
            status: true,
            message : 'Transaction Reciept of Unconfirmed Transaction',
            data: {
                receipt : receipt
            }
        });

    } catch (err) {
        next(err);
    }
};



exports.sendTRXtoMultiUsers = async (req, res, next) => {
    try {

        const userAddress = req.body.userAddress;
        const userAmounts = req.body.amounts;
        const privateKey = req.body.privateKey;
        console.log(privateKey);

        const globalmainAdd = process.env.TRON_CONTRACT_ADDRESS;
        const globalmainAbi = [ { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "fromAddress", "type": "address" }, { "indexed": false, "internalType": "address", "name": "contractAddress", "type": "address" }, { "indexed": true, "internalType": "address", "name": "toAddress", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "amountTransfered", "type": "event" }, { "constant": false, "inputs": [ { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "address payable[]", "name": "receivers", "type": "address[]" } ], "name": "transferEth", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" } ];

        const fullNode = new HttpProvider("https://api.trongrid.io");
        const solidityNode = new HttpProvider("https://api.trongrid.io");
        const eventServer = new HttpProvider("https://api.trongrid.io");

        var ValueMul = parseFloat(1000000);
        var amounts_str = userAmounts;
        var mainAmount = 0.0;
        var amounts = amounts_str.split(",");

        for (var i =0;i<amounts.length;i++) {
            mainAmount += parseFloat(amounts[i]); 
            amounts[i] = amounts[i]*ValueMul;
            
        }
        var addrs_str = userAddress;
        var addrs = addrs_str.split(",");
        
        // const seed = process.env.memPub;
        // const account = await utils.getAccountAtIndex(seed, fromAccountNo);
        // const privateKey = account.privateKey;
        // const pubKey = account.address;
        

        const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
        const dzappyContract = await tronWeb.contract().at(globalmainAdd);
        const amountsArray = amounts;
        const totalAmont = mainAmount;
        const receiversArray = addrs;
        const pubKey = tronWeb.address.fromPrivateKey(privateKey);
        const balance = tronWeb.fromSun(await tronWeb.trx.getBalance(pubKey));

        if(balance>0){
            const hash = await dzappyContract.transferTrx(amountsArray,receiversArray).send({
                callValue:tronWeb.toSun(totalAmont),
            });
           
            res.status(200).json({
                status: true,
                message : 'Transaction sent Sucessfully',
                data: {
                    hash
                }
            });
        }
        else{
            res.status(200).json({
                status: true,
                message : 'Not Enough Balance',
            });
        }
        

  
 
    } catch (err) {
        next(err);
    }
};


exports.sendTRXtoMultiUsersTestnet = async (req, res, next) => {
    try {

        const userAddress = req.body.userAddress;
        const userAmounts = req.body.amounts;
        const privateKey = req.body.privateKey;
        

        const globalmainAdd = process.env.TRON_CONTRACT_ADDRESS;
        const globalmainAbi = [ { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "fromAddress", "type": "address" }, { "indexed": false, "internalType": "address", "name": "contractAddress", "type": "address" }, { "indexed": true, "internalType": "address", "name": "toAddress", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "amountTransfered", "type": "event" }, { "constant": false, "inputs": [ { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "address payable[]", "name": "receivers", "type": "address[]" } ], "name": "transferEth", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" } ];

        const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
        const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
        const eventServer = new HttpProvider("https://api.shasta.trongrid.io");

        var ValueMul = parseFloat(1000000);
        var amounts_str = userAmounts;
        var mainAmount = 0.0;
        var amounts = amounts_str.split(",");

        for (var i =0;i<amounts.length;i++) {
            mainAmount += parseFloat(amounts[i]); 
            amounts[i] = amounts[i]*ValueMul;
            
        }
        var addrs_str = userAddress;
        var addrs = addrs_str.split(",");
        
        // const seed = process.env.memPub;
        // const account = await utils.getAccountAtIndex(seed, fromAccountNo);
        // const privateKey = account.privateKey;
        // const pubKey = account.address;
        

        const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
        const dzappyContract = await tronWeb.contract().at(globalmainAdd);
        const amountsArray = amounts;
        const totalAmont = mainAmount;
        const receiversArray = addrs;
        const pubKey = tronWeb.address.fromPrivateKey(privateKey);
        const balance = tronWeb.fromSun(await tronWeb.trx.getBalance(pubKey));

        if(balance>0){
            const hash = await dzappyContract.transferTrx(amountsArray,receiversArray).send({
                callValue:tronWeb.toSun(totalAmont),
            });
           
            res.status(200).json({
                status: true,
                message : 'Transaction sent Sucessfully',
                data: {
                    hash
                }
            });
        }
        else{
            res.status(200).json({
                status: true,
                message : 'Not Enough Balance',
            });
        }
        

  
 
    } catch (err) {
        next(err);
    }
};





exports.sendTRXtoMultiUsersAdmin = async (req, res, next) => {
    try {

        const userAddress = req.body.userAddress;
        const userAmounts = req.body.amounts;
        const privateKey = process.env.AD_PRIVATE_KEY;
        console.log(privateKey);

        const globalmainAdd = process.env.TRON_CONTRACT_ADDRESS;
        const globalmainAbi = [ { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "fromAddress", "type": "address" }, { "indexed": false, "internalType": "address", "name": "contractAddress", "type": "address" }, { "indexed": true, "internalType": "address", "name": "toAddress", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "amountTransfered", "type": "event" }, { "constant": false, "inputs": [ { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "address payable[]", "name": "receivers", "type": "address[]" } ], "name": "transferEth", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" } ];

        const fullNode = new HttpProvider("https://api.trongrid.io");
        const solidityNode = new HttpProvider("https://api.trongrid.io");
        const eventServer = new HttpProvider("https://api.trongrid.io");

        var ValueMul = parseFloat(1000000);
        var amounts_str = userAmounts;
        var mainAmount = 0.0;
        var amounts = amounts_str.split(",");

        for (var i =0;i<amounts.length;i++) {
            mainAmount += parseFloat(amounts[i]); 
            amounts[i] = amounts[i]*ValueMul;
            
        }
        var addrs_str = userAddress;
        var addrs = addrs_str.split(",");
        
        // const seed = process.env.memPub;
        // const account = await utils.getAccountAtIndex(seed, fromAccountNo);
        // const privateKey = account.privateKey;
        // const pubKey = account.address;
        

        const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
        const dzappyContract = await tronWeb.contract().at(globalmainAdd);
        const amountsArray = amounts;
        const totalAmont = mainAmount;
        const receiversArray = addrs;
        const pubKey = tronWeb.address.fromPrivateKey(privateKey);
        const balance = tronWeb.fromSun(await tronWeb.trx.getBalance(pubKey));

        if(balance>0){
            const hash = await dzappyContract.transferTrx(amountsArray,receiversArray).send({
                callValue:tronWeb.toSun(totalAmont),
            });
           
            res.status(200).json({
                status: true,
                message : 'Transaction sent Sucessfully',
                data: {
                    hash
                }
            });
        }
        else{
            res.status(200).json({
                status: true,
                message : 'Not Enough Balance',
            });
        }
        

  
 
    } catch (err) {
        next(err);
    }
};


exports.sendTRXtoMultiUsersTestnetAdmin = async (req, res, next) => {
    try {

        const userAddress = req.body.userAddress;
        const userAmounts = req.body.amounts;
        const privateKey = process.env.AD_PRIVATE_KEY;
        

        const globalmainAdd = process.env.TRON_CONTRACT_ADDRESS;
        const globalmainAbi = [ { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "fromAddress", "type": "address" }, { "indexed": false, "internalType": "address", "name": "contractAddress", "type": "address" }, { "indexed": true, "internalType": "address", "name": "toAddress", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "amountTransfered", "type": "event" }, { "constant": false, "inputs": [ { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "address payable[]", "name": "receivers", "type": "address[]" } ], "name": "transferEth", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" } ];

        const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
        const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
        const eventServer = new HttpProvider("https://api.shasta.trongrid.io");

        var ValueMul = parseFloat(1000000);
        var amounts_str = userAmounts;
        var mainAmount = 0.0;
        var amounts = amounts_str.split(",");

        for (var i =0;i<amounts.length;i++) {
            mainAmount += parseFloat(amounts[i]); 
            amounts[i] = amounts[i]*ValueMul;
            
        }
        var addrs_str = userAddress;
        var addrs = addrs_str.split(",");
        
        // const seed = process.env.memPub;
        // const account = await utils.getAccountAtIndex(seed, fromAccountNo);
        // const privateKey = account.privateKey;
        // const pubKey = account.address;
        

        const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
        const dzappyContract = await tronWeb.contract().at(globalmainAdd);
        const amountsArray = amounts;
        const totalAmont = mainAmount;
        const receiversArray = addrs;
        const pubKey = tronWeb.address.fromPrivateKey(privateKey);
        const balance = tronWeb.fromSun(await tronWeb.trx.getBalance(pubKey));

        if(balance>0){
            const hash = await dzappyContract.transferTrx(amountsArray,receiversArray).send({
                callValue:tronWeb.toSun(totalAmont),
            });
           
            res.status(200).json({
                status: true,
                message : 'Transaction sent Sucessfully',
                data: {
                    hash
                }
            });
        }
        else{
            res.status(200).json({
                status: true,
                message : 'Not Enough Balance',
            });
        }
        

  
 
    } catch (err) {
        next(err);
    }
};



// Check Token Balance 
exports.tokenbalance = async (req, res, next) => {
    try {

        const toAdd = req.body.address;   
        const tokenAdd = req.body.tokenaddress;


        
        const globalmainAdd = tokenAdd;
        const globalmainAbi = [ { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" } ], "name": "MinterAdded", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" } ], "name": "MinterRemoved", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "addMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "isMinter", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "mint", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ];       

        const fullNode = new HttpProvider("https://api.trongrid.io");
        const solidityNode = new HttpProvider("https://api.trongrid.io");
        const eventServer = new HttpProvider("https://api.trongrid.io");


        const tronWeb = new TronWeb(fullNode,solidityNode,eventServer);
        tronWeb.setAddress(tokenAdd);


        

        const dzappyContract = await tronWeb.contract().at(globalmainAdd);
        const name = (await dzappyContract.name().call());
        const symbol = (await dzappyContract.symbol().call());
        const decimal = (await dzappyContract.decimals().call());
        
        var balance = ((await dzappyContract.balanceOf(toAdd).call()))/10**decimal;
        if((balance).toString().search("e")>0){
            balance = (toFixed(String(balance)));
        }else{
            balance= String((balance));
        }
        res.status(200).json({
            status: true,
            message : 'Balance Fetched Sucessfully',
            data: {
                name,
                symbol,
                decimal,
                balance
            }
        });
        

  
 
    } catch (err) {
        next(err);
    }
};



// Check Token Balance 
exports.tokenbalancetestnet = async (req, res, next) => {
    try {

        const toAdd = req.body.address;   
        const tokenAdd = req.body.tokenaddress;


        
        const globalmainAdd = tokenAdd;
        const globalmainAbi = [ { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" } ], "name": "MinterAdded", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" } ], "name": "MinterRemoved", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "addMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "isMinter", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "mint", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ];       

        const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
        const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
        const eventServer = new HttpProvider("https://api.shasta.trongrid.io");


        const tronWeb = new TronWeb(fullNode,solidityNode,eventServer);
        tronWeb.setAddress(tokenAdd);

        const dzappyContract = await tronWeb.contract().at(globalmainAdd);
        const name = (await dzappyContract.name().call());
        const symbol = (await dzappyContract.symbol().call());
        const decimal = tronWeb.toDecimal(await dzappyContract.decimals().call());
        var balance = ((await dzappyContract.balanceOf(toAdd).call()))/10**decimal;
        if((balance).toString().search("e")>0){
            balance = (toFixed(String(balance)));
        }else{
            balance= String((balance));
        }
        console.log(balance);

        res.status(200).json({
            status: true,
            message : 'Balance Fetched Sucessfully',
            data: {
                name,
                symbol,
                decimal,
                balance
            }
        });
        

  
 
    } catch (err) {
        next(err);
    }
};


// Send token to storage account
exports.sendtokentostorage = async (req, res, next) => {
    try {

        
        const toAdd = req.body.toAddress;
        const accounts = req.body.accounts;
        const addressnumber = req.body.addressnumber;
        const tokenAdd = req.body.tokenAdd;

        const seed = await bip39.mnemonicToSeed((process.env.memenc).toString());
        const node = await bip32.fromSeed(seed);

        const walletPath = {
            "standard": "m/44'/195'/"+accounts+"'/0/"+addressnumber+"",
        };
        const child = await node.derivePath(walletPath.standard);
        const privateKey = await child.privateKey.toString('hex');
        const address = await TronWeb.address.fromPrivateKey(privateKey);

        const globalmainAdd = tokenAdd;
        const globalmainAbi = [ { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" } ], "name": "MinterAdded", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" } ], "name": "MinterRemoved", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "addMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "isMinter", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "mint", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ];       

        const fullNode = new HttpProvider("https://api.trongrid.io");
        const solidityNode = new HttpProvider("https://api.trongrid.io");
        const eventServer = new HttpProvider("https://api.trongrid.io");

    

        const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
        const dzappyContract = await tronWeb.contract().at(globalmainAdd);
        const decimal = (await dzappyContract.decimals().call());

        const pubKey = tronWeb.address.fromPrivateKey(privateKey);
        const balance = tronWeb.fromSun(await dzappyContract.balanceOf(pubKey).call());
        const userAmounts = ((await dzappyContract.balanceOf(pubKey).call()));

        if(balance>0){
            const hash = await dzappyContract.transfer(toAdd,(userAmounts)).send();
           
            res.status(200).json({
                status: true,
                message : 'Transaction sent Sucessfully',
                data: {
                    hash
                }
            });
        }
        else{
            res.status(200).json({
                status: true,
                message : 'Not Enough Balance',
            });
        }
        

  
 
    } catch (err) {
        next(err);
    }
};


// Send token to storage account Testnet
exports.sendtokentostoragetestnet = async (req, res, next) => {
    try {

        const toAdd = req.body.toAddress;
        const accounts = req.body.accounts;
        const addressnumber = req.body.addressnumber;
        const tokenAdd = req.body.tokenAdd;

        const seed = await bip39.mnemonicToSeed((process.env.memenc).toString());
        const node = await bip32.fromSeed(seed);

        const walletPath = {
            "standard": "m/44'/195'/"+accounts+"'/0/"+addressnumber+"",
        };
        const child = await node.derivePath(walletPath.standard);
        const privateKey = await child.privateKey.toString('hex');
        const address = await TronWeb.address.fromPrivateKey(privateKey);

        const globalmainAdd = tokenAdd;
        const globalmainAbi = [ { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" } ], "name": "MinterAdded", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" } ], "name": "MinterRemoved", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "addMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "isMinter", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "mint", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ];       

        const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
        const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
        const eventServer = new HttpProvider("https://api.shasta.trongrid.io");

    

        const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
        const dzappyContract = await tronWeb.contract().at(globalmainAdd);
        const decimal = (await dzappyContract.decimals().call());

        const pubKey = tronWeb.address.fromPrivateKey(privateKey);
        const balance = tronWeb.fromSun(await dzappyContract.balanceOf(pubKey).call());
        const userAmounts = ((await dzappyContract.balanceOf(pubKey).call()));
        console.log(userAmounts);
        if(balance>0){
            const hash = await dzappyContract.transfer(toAdd,(userAmounts)).send();
           
            res.status(200).json({
                status: true,
                message : 'Transaction sent Sucessfully',
                data: {
                    hash
                }
            });
        }
        else{
            res.status(200).json({
                status: true,
                message : 'Not Enough Balance',
            });
        }
        

  
 
    } catch (err) {
        next(err);
    }
};




// Send token to user account Testnet
exports.sendtokentousertestnet = async (req, res, next) => {
    try {

        var userAmounts = req.body.amounts;
        const toAdd = req.body.userAddress;
        const accounts = req.body.accounts;
        const addressnumber = req.body.addressnumber;
        const tokenAdd = req.body.tokenAdd;

        const seed = await bip39.mnemonicToSeed((process.env.memencstorage).toString());
        const node = await bip32.fromSeed(seed);

        const walletPath = {
            "standard": "m/44'/195'/"+accounts+"'/0/"+addressnumber+"",
        };
        const child = await node.derivePath(walletPath.standard);
        const privateKey = await child.privateKey.toString('hex');
        const address = await TronWeb.address.fromPrivateKey(privateKey);

        const globalmainAdd = tokenAdd;
        const globalmainAbi = [ { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" } ], "name": "MinterAdded", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" } ], "name": "MinterRemoved", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "addMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "isMinter", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "mint", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ];       

        const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
        const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
        const eventServer = new HttpProvider("https://api.shasta.trongrid.io");

    

        const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
        const dzappyContract = await tronWeb.contract().at(globalmainAdd);
        const decimal = (await dzappyContract.decimals().call());

        const pubKey = tronWeb.address.fromPrivateKey(privateKey);
        const balance = tronWeb.fromSun(await dzappyContract.balanceOf(pubKey).call());
        if((userAmounts*10**decimal).toString().search("e")>0){
            userAmounts = (toFixed(String(userAmounts*10**decimal)));
        }else{
            userAmounts= String((userAmounts*10**decimal));
        }
        if(balance>0){
            const hash = await dzappyContract.transfer(toAdd,(userAmounts)).send();
           
            res.status(200).json({
                status: true,
                message : 'Transaction sent Sucessfully',
                data: {
                    hash
                }
            });
        }
        else{
            res.status(200).json({
                status: true,
                message : 'Not Enough Balance',
            });
        }
        

  
 
    } catch (err) {
        next(err);
    }
};



// Send token to user account
exports.sendtokentouser = async (req, res, next) => {
    try {

        var userAmounts = req.body.amounts;
        const toAdd = req.body.userAddress;
        const accounts = req.body.accounts;
        const addressnumber = req.body.addressnumber;
        const tokenAdd = req.body.tokenAdd;

        const seed = await bip39.mnemonicToSeed((process.env.memencstorage).toString());
        const node = await bip32.fromSeed(seed);

        const walletPath = {
            "standard": "m/44'/195'/"+accounts+"'/0/"+addressnumber+"",
        };
        const child = await node.derivePath(walletPath.standard);
        const privateKey = await child.privateKey.toString('hex');
        const address = await TronWeb.address.fromPrivateKey(privateKey);

        const globalmainAdd = tokenAdd;
        const globalmainAbi = [ { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" } ], "name": "MinterAdded", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" } ], "name": "MinterRemoved", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "addMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "isMinter", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "mint", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ];       

        const fullNode = new HttpProvider("https://api.trongrid.io");
        const solidityNode = new HttpProvider("https://api.trongrid.io");
        const eventServer = new HttpProvider("https://api.trongrid.io");

    

        const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
        const dzappyContract = await tronWeb.contract().at(globalmainAdd);
        const decimal = (await dzappyContract.decimals().call());

        const pubKey = tronWeb.address.fromPrivateKey(privateKey);
        const balance = tronWeb.fromSun(await dzappyContract.balanceOf(pubKey).call());

        if((userAmounts*10**decimal).toString().search("e")>0){
            userAmounts = (toFixed(String(userAmounts*10**decimal)));
        }else{
            userAmounts= String((userAmounts*10**decimal));
        }

        if(balance>0){
            const hash = await dzappyContract.transfer(toAdd,userAmounts).send();
           
            res.status(200).json({
                status: true,
                message : 'Transaction sent Sucessfully',
                data: {
                    hash
                }
            });
        }
        else{
            res.status(200).json({
                status: true,
                message : 'Not Enough Balance',
            });
        }
        

  
 
    } catch (err) {
        next(err);
    }
};