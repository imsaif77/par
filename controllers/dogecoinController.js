const bitcoin = require('bitgo-utxo-lib')
const config = require('../config')
const bitcoinlib = require('bitcoinjs-lib')
const bip39 = require('bip39')
const bip32 = require('bip32')
const axios = require('axios')
const bigi    = require("bigi");
const securityutils = require('../common/securityUtils')
var bitcore = require('bitcore-lib-doge');

const BJSON = require('buffer-json')
var eccrypto = require("eccrypto");
const networks = require('bitcore-lib-doge/lib/networks')



const { mnemonics } = config

// const memprivkey =  process.env.mempriv;
// const memenckey =  process.env.memenc;
// const pribuf =  BJSON.parse(memprivkey); 
// const encbuf =  BJSON.parse(memenckey);
// const mnemonicsDecrypted = [];

// eccrypto.decrypt(pribuf, encbuf).then(function(plaintext) {
//     decryptedText = plaintext.toString();
//     mnemonicsDecrypted.push(decryptedText);   
// });

// const memdecrypt = process.env.memenc;
// const mnemonics = memdecrypt.toString();
// console.log(mnemonics)    
dogecointestnet = {
    messagePrefix: '\x19Dogecoin Signed Message:\n',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394
    },
    pubKeyHash: 0x71,
    scriptHash: 0xc4,
    wif: 0xf1
  };

  dogecoin = {
    messagePrefix: '\x19Dogecoin Signed Message:\n',
    bip32: {
      public: 0x02facafd,
      private: 0x02fac398
    },
    pubKeyHash: 0x1e,
    scriptHash: 0x16,
    wif: 0x9e
  };


// Bitoin Mainnet Wallet Generate
exports.dogewalletdetails = async (req, res, next) => {
    try {
        
        const accounts = req.body.accounts;
        const addressnumber = req.body.addressnumber;
        const seed = await bip39.mnemonicToSeed(mnemonics)
        const node = bitcoin.HDNode.fromSeedBuffer(seed,dogecoin)
        const child = node.derivePath("m/44'/3'/"+accounts+"'/0/"+addressnumber+"")
        const publicAddress = child.getAddress();
        const privateKey = child.keyPair.toWIF({ network: dogecoin });
        res.status(200).json({
            status: true,
            message : 'Dogecoin Address And Private Key of entered Mnemonics',
            data: {
                publicAddress,
                privateKey
            }
        });

    } catch (err) {
        next(err);
    }
};


// Dogecoin Testnet Wallet details
exports.dogewalletdetailstestnet = async (req, res, next) => {
    try {
        
        const accounts = req.body.accounts;
        const addressnumber = req.body.addressnumber;
        const seed = await bip39.mnemonicToSeed(mnemonics)
        
        const node = bitcoin.HDNode.fromSeedBuffer(seed,dogecointestnet)
        const child = node.derivePath("m/44'/1'/"+accounts+"'/0/"+addressnumber+"")
        const publicAddress = child.getAddress({
            network: bitcoin.networks.testnet
          });
        const privateKey = child.keyPair.toWIF({ network: dogecointestnet });

          
        
        res.status(200).json({
            status: true,
            message : 'Dogecoin Testnet Address And Private Key of entered Mnemonics',
            data: {
                publicAddress,
                privateKey
            }
        });

    } catch (err) {
        next(err);
    }
};

// DOGE Balance Mainnet
exports.dogebalance = async (req, res, next) => {
    try {
        const address = req.body.address;

        await axios.get('https://sochain.com/api/v2/get_address_balance/DOGE/'+address).then((response) => {
            const network = response.data.data.network
            const address = response.data.data.address
            const confirmed_balance = response.data.data.confirmed_balance
            const unconfirmed_balance = response.data.data.unconfirmed_balance
            

            res.status(200).json({
                status: true,
                message : 'Dogecoin Address Balance Details',
                data: {
                    network,
                    address,
                    confirmed_balance,
                    unconfirmed_balance
                }
            });
        });        
        

    } catch (err) {
        next(err);
    }
};

// DOGE Balance Testnet
exports.dogebalancetestnet = async (req, res, next) => {
    try {
        const address = req.body.address;

        await axios.get('https://sochain.com/api/v2/get_address_balance/DOGETEST/'+address).then((response) => {
            const network = response.data.data.network
            const address = response.data.data.address
            const confirmed_balance = response.data.data.confirmed_balance
            const unconfirmed_balance = response.data.data.unconfirmed_balance

            res.status(200).json({
                status: true,
                message : 'Dogecoin Testnet Address Balance Details',
                data: {
                    network,
                    address,
                    confirmed_balance,
                    unconfirmed_balance
                }
            });
        });        
        

    } catch (err) {
        next(err);
    }
};

// Full Amount Transfer - Testnet
exports.dogetransfertestnet = async (req, res, next) => {
    try {
        
        const accounts = req.body.accounts;
        const addressnumber = req.body.addressnumber;
        const toAdd = req.body.toAddress;
        // const toAdd = toAddress.toString(); 
        const seed = await bip39.mnemonicToSeed(mnemonics)
        const node = bitcoin.HDNode.fromSeedBuffer(seed,dogecointestnet)
        const child = node.derivePath("m/44'/3'/"+accounts+"'/0/"+addressnumber+"")
        const publicAddress = child.getAddress();
        const privateKeyEncode = child.keyPair.toWIF();
        // From Body Input
        const privateKey = bitcoin.ECPair.fromWIF(privateKeyEncode,dogecointestnet)

        var keySign = new bitcore.PrivateKey(privateKey,networks.testnet)

        // Testing Accoount 1
        // const privateKey = bitcoin.ECPair.fromWIF("92J3Ke6DmQXJYQoALH3eK68w2HBcjY9iD52UEJU7rKToWGTRsot", dogecointestnet);        
        
        // Testing Account 2
        // const privateKey = bitcoin.ECPair.fromWIF("cVzSmQ4mffMqmFLZGc6MFG5NQ2RHoNa1cFAmZPf3qYgLKmhPrZKS", dogecointestnet);        

        const fromAdd = privateKey.getAddress();  
        
        // Testing Account 1
        // const toAdd = 'n1BvxYnabtfDW1tyJbLtuKDRVWErkhu55j'; 
        // Testing Accout 2
        // const toAdd = 'mo1Q7hmsTgJE9Wj81wDzoZhrcmbcCm7HFs';

        // For Manual Fee Setting
        const satoshi = 10000;

        var VinNo = 0;
        var VoutNo = 0;

        console.log("my public key:", fromAdd);
        const txhash = [];
        const tx = new bitcoin.TransactionBuilder(dogecointestnet);

        await axios.get('https://blockstream.info/testnet/api/address/'+fromAdd+'/utxo').then((response) => {
            console.log(Object.keys(response.data).length);
            var finalTestDOGEAmount = 0;
        for (i = Object.keys(response.data).length - 1 ; i >= 0; i--) { 

            console.log(response);
            finalTestDOGEAmount = finalTestDOGEAmount + response.data[i].value;

            if (finalTestDOGEAmount!=0)
            {
                tx.addInput(response.data[i].txid, response.data[i].vout);
                VinNo ++;
                
            }

        }

        // To Compute Transaction Fee
        // const number_of_input = VinNo;
        // const number_of_output = 1;
        // const satoshi = feeutil.p2pkh_tx_calc_fee(number_of_input, number_of_output)
        // console.log("P2PKH fee %d satoshi", satoshi)

        
        console.log("Money to be Sent",finalTestDOGEAmount - satoshi);
        console.log("Balance in Wallet",finalTestDOGEAmount);
        // cVzSmQ4mffMqmFLZGc6MFG5NQ2RHoNa1cFAmZPf3qYgLKmhPrZKS
        // tx.addOutput("n1BvxYnabtfDW1tyJbLtuKDRVWErkhu55j", finalTestDOGEAmount - satoshi);
        // 92J3Ke6DmQXJYQoALH3eK68w2HBcjY9iD52UEJU7rKToWGTRsot
        // tx.addOutput("mo1Q7hmsTgJE9Wj81wDzoZhrcmbcCm7HFs",finalTestDOGEAmount - satoshi);

        if(finalTestDOGEAmount==0)
        {
            res.status(401).json({
                status: false,
                message : 'Balance is 0 in Dogecoin Testnet Wallet',
                data: {
                    Amount : finalTestDOGEAmount
                }
            });
        }
        else if(finalTestDOGEAmount-satoshi < 0)
        {
            res.status(401).json({
                status: false,
                message : 'Cannot pay Dogecoin Fee',
                data: {
                    Amount : finalTestDOGEAmount,
                    fee : satoshi
                }
            });
        }
        else{
            // From Body input
            tx.addOutput(toAdd,finalTestDOGEAmount - satoshi);
            VoutNo ++;
            console.log(VoutNo)
            console.log(VinNo);
            for(var j=0; j<VinNo; j++)
            {
                tx.sign(j, privateKey);
            }
            
            txhash.push(tx.build().toHex());
            console.log(tx.build().toHex());
        }
    });

        console.log(txhash.toString());
        const finalTX = txhash.toString();
      
        await axios.post('https://blockstream.info/testnet/api/tx',finalTX)
        .then((response) => {
            
                console.log(response)
                const finalTXresponse = response.data;
                res.status(200).json({
                    status: true,
                    message : 'Dogecoin Testnet Transfered',
                    data: {
                       TransactionId : finalTXresponse
                    }
                });
            });
    
    } catch (err) {
        next(err);
    }
};


// Transfer DOGE : Mainnet
exports.dogetransfermainnet = async (req, res, next) => {
    try {

        
        const accounts = req.body.accounts;
        const addressnumber = req.body.addressnumber;
        const toAdd = req.body.toAddress;
        // const toAdd = toAddress.toString(); 
        const seed = await bip39.mnemonicToSeed(mnemonics)
        const node = bitcoin.HDNode.fromSeedBuffer(seed)
        const child = node.derivePath("m/44'/0'/"+accounts+"'/0/"+addressnumber+"")
        const publicAddress = child.getAddress();
        const privateKeyEncode = child.keyPair.toWIF();
        // From Body Input
        const privateKey = bitcoin.ECPair.fromWIF(privateKeyEncode,dogemainnet)

        const fromAdd = privateKey.getAddress();  
        
        // For Manual Fee Setting
        const satoshi = 10000;

        var VinNo = 0;
        var VoutNo = 0;

        console.log("my public key:", fromAdd);
        const txhash = [];
        const tx = new bitcoin.TransactionBuilder(dogemainnet);

        await axios.get('https://blockstream.info/api/address/'+fromAdd+'/utxo').then((response) => {
            console.log(Object.keys(response.data).length);
            var finalDOGEAmount = 0;
            for (i = Object.keys(response.data).length - 1 ; i >= 0; i--) { 

                console.log(response);
                finalDOGEAmount = finalDOGEAmount + response.data[i].value;

                if (finalDOGEAmount!=0)
                {
                    tx.addInput(response.data[i].txid, response.data[i].vout);
                    VinNo ++;
                    
                }

            }

            // To Compute Transaction Fee
            // const number_of_input = VinNo;
            // const number_of_output = 1;
            // const satoshi = feeutil.p2pkh_tx_calc_fee(number_of_input, number_of_output)
            // console.log("P2PKH fee %d satoshi", satoshi)

            
            console.log("Money to be Sent",finalDOGEAmount - satoshi);
            console.log("Balance in Wallet",finalDOGEAmount);
            // cVzSmQ4mffMqmFLZGc6MFG5NQ2RHoNa1cFAmZPf3qYgLKmhPrZKS
            // tx.addOutput("n1BvxYnabtfDW1tyJbLtuKDRVWErkhu55j", finalDOGEAmount - satoshi);
            // 92J3Ke6DmQXJYQoALH3eK68w2HBcjY9iD52UEJU7rKToWGTRsot
            // tx.addOutput("mo1Q7hmsTgJE9Wj81wDzoZhrcmbcCm7HFs",finalDOGEAmount - satoshi);

            if(finalDOGEAmount==0)
            {
                res.status(401).json({
                    status: false,
                    message : 'Balance is 0 in Dogecoin Mainnet Wallet',
                    data: {
                        Amount : finalDOGEAmount
                    }
                });
            }
            else if(finalDOGEAmount-satoshi < 0)
            {
                res.status(401).json({
                    status: false,
                    message : 'Cannot pay Dogecoin Fee',
                    data: {
                        Amount : finalDOGEAmount,
                        fee : satoshi
                    }
                });
            }
            else{
                // From Body input
                tx.addOutput(toAdd,finalDOGEAmount - satoshi);
                VoutNo ++;
                
                console.log(VinNo);
                for(var j=0; j<VinNo; j++)
                {
                    tx.sign(j, privateKey);
                }
                
                txhash.push(tx.build().toHex());
                console.log(tx.build().toHex());
            }
        });

        console.log(txhash.toString());
        const finalTX = txhash.toString();
        
        await axios.post('https://blockstream.info/api/tx',finalTX)
        .then((response) => {
            
                console.log(response)
                const finalTXresponse = response.data;
                res.status(200).json({
                    status: true,
                    message : 'Dogecoin Mainnet Transfered From: '+fromAdd+' to: '+toAdd,
                    data: {
                        TransactionId : finalTXresponse
                    }
                });
            });
    
    } catch (err) {
        next(err);
    }
};





// Dogecoin Fee Calculator
exports.dogefee = async (req, res, next) => {
    try {
        const satperbt = [];
        const AverageFee = [];

        const Vin = req.body.vin;
        const Vout = req.body.vout;

        var FeeEstimate = 0;
        const vbytes = Vin * 146 + Vout * 33 + 10;

        await axios.get('https://doge.com/service/fees/distribution').then((response) => {
            const satperbytes = response.data.fees_recommended.one_block_fee;
            satperbt.push(satperbytes);
        });

        await axios.get('https://blockstream.info/api/fee-estimates').then((response) => {
            for (i = Object.keys(response.data).length - 3 ; i > 0; i--) { 
                FeeEstimate = FeeEstimate + response.data[i];
            }
            AverageFee.push(FeeEstimate/25);
        });
        

        feefortx = vbytes * satperbt.toString()

        res.status(200).json({
            status: true,
            message : 'Dogecoin Fees According to Network',
            data: {
                FastTx : feefortx,
                SatoshiPerBytes  :  satperbt.toString(),
                AverageFee : AverageFee.toString()
            }
        });

    } catch (err) {
        next(err);
    }
};




// Dogecoin Account Details
exports.dogeaccountdetails = async (req, res, next) => {
    try {
        
        const userAddress = req.body.userAddress;
        
        await axios.get('https://chain.api.doge.com/v3/address/'+userAddress).then((response) => {
            const address = response.data.data.address;
            const received = response.data.data.received;
            const sent = response.data.data.sent;
            const balance = response.data.data.balance;
            const tx_count = response.data.data.tx_count;
            const unconfirmed_tx_count = response.data.data.unconfirmed_tx_count;
            const unconfirmed_received = response.data.data.unconfirmed_received;
            const unconfirmed_sent = response.data.data.unconfirmed_sent;
            const unspent_tx_count = response.data.data.unspent_tx_count;
            const first_tx = response.data.data.first_tx;
            const last_tx = response.data.data.last_tx;

            res.status(200).json({
                status: true,
                message : 'Dogecoin user Detail',
                data: {
                    address,
                    received,
                    sent,
                    balance,
                    tx_count,
                    unconfirmed_tx_count,
                    unconfirmed_received,
                    unconfirmed_sent,
                    unspent_tx_count,
                    first_tx,
                    last_tx
                }
            });
        });

    } catch (err) {
        next(err);
    }
};


// Dogecoin Account Transaction Details
exports.dogeaccounttxdetails = async (req, res, next) => {
    try {
        
        const userAddress = req.body.userAddress;
        const pageNo = req.body.pageNo;

        await axios.get('https://chain.api.doge.com/v3/address/'+userAddress+'/tx?page='+pageNo).then((response) => {
            const transactions = response.data.data;
            
            res.status(200).json({
                status: true,
                message : 'Dogecoin user Transaction Details',
                data: {
                    transactions
                }
            });
        });

    } catch (err) {
        next(err);
    }
};


// Dogecoin Account Unspent Transaction Details
exports.dogeaccountunspenttxdetails = async (req, res, next) => {
    try {
        
        const userAddress = req.body.userAddress;
        const pageNo = req.body.pageNo;

        await axios.get('https://chain.api.doge.com/v3/address/'+userAddress+'/unspent?page='+pageNo).then((response) => {
            const UnspentTransactions = response.data.data;
            
            res.status(200).json({
                status: true,
                message : 'Dogecoin user Unspent Transaction Details',
                data: {
                    UnspentTransactions
                }
            });
        });

    } catch (err) {
        next(err);
    }
};


// Dogecoin Transaction Hash Checking
exports.dogetxhashcheck = async (req, res, next) => {
    try {
        
        const txHash = req.body.txHash;
        

        await axios.get('https://blockstream.info/api/tx/'+txHash+'/status').then((response) => {
            const TransactionStatus = response.data;
            
            res.status(200).json({
                status: true,
                message : 'Dogecoin user Transaction Confirmation Status',
                data: {
                    TransactionStatus
                }
            });
        });

    } catch (err) {
        next(err);
    }
};


// Dogecoin Transaction Hash Checking
exports.dogetxhashdetails = async (req, res, next) => {
    try {
        
        const txHash = req.body.txHash;
        

        await axios.get('https://chain.api.doge.com/v3/tx/'+txHash).then((response) => {
            const TransactionDetails = response.data.data;
            const confirmations = response.data.data.confirmations;
            
            res.status(200).json({
                status: true,
                message : 'Dogecoin user Transaction Complete Details',
                confirmations : confirmations,
                data: {
                    TransactionDetails
                }
            });
        });

    } catch (err) {
        next(err);
    }
};






// Send particular Amount in Dogecoin Mainnet:
// Transfer DOGE : Mainnet
exports.withdrawdoge = async (req, res, next) => {
    try {

        
        const accounts = req.body.accounts;
        const addressnumber = req.body.addressnumber;
        const toAdd = req.body.toAddress;
        // const toAdd = toAddress.toString(); 
        const seed = await bip39.mnemonicToSeed(mnemonics)
        const node = bitcoin.HDNode.fromSeedBuffer(seed)
        const child = node.derivePath("m/44'/0'/"+accounts+"'/0/"+addressnumber+"")
        const publicAddress = child.getAddress();
        const privateKeyEncode = child.keyPair.toWIF();
        // From Body Input
        const privateKey = bitcoin.ECPair.fromWIF(privateKeyEncode,dogemainnet)
     
        const amount = req.body.amount;

        // const toAdd = toAddress.toString(); 
        // const seed = await bip39.mnemonicToSeed(mnemonics)
        // const node = bitcoin.HDNode.fromSeedBuffer(seed)
        // const child = node.derivePath("m/44'/0'/"+accounts+"'/0/"+addressnumber+"")
        // const publicAddress = child.getAddress();
        // const privateKeyEncode = child.keyPair.toWIF();
        // From Body Input

        const fromAdd = privateKey.getAddress();  
        
        // For Manual Fee Setting
        const satoshi = 10000;

        var VinNo = 0;
        var VoutNo = 0;

        console.log("my public key:", fromAdd);
        const txhash = [];
        const tx = new bitcoin.TransactionBuilder(dogemainnet);

        await axios.get('https://blockstream.info/api/address/'+fromAdd+'/utxo').then((response) => {
            console.log(Object.keys(response.data).length);
            var finalDOGEAmount = 0;
            for (i = Object.keys(response.data).length - 1 ; i >= 0; i--) { 

                console.log(response);
                finalDOGEAmount = finalDOGEAmount + response.data[i].value;

                if (finalDOGEAmount!=0)
                {
                    tx.addInput(response.data[i].txid, response.data[i].vout);
                    VinNo ++;
                    
                }

            }

            // To Compute Transaction Fee
            // const number_of_input = VinNo;
            // const number_of_output = 1;
            // const satoshi = feeutil.p2pkh_tx_calc_fee(number_of_input, number_of_output)
            // console.log("P2PKH fee %d satoshi", satoshi)

            
            console.log("Money to be Sent",finalDOGEAmount - satoshi);
            console.log("Balance in Wallet",finalDOGEAmount);
            // cVzSmQ4mffMqmFLZGc6MFG5NQ2RHoNa1cFAmZPf3qYgLKmhPrZKS
            // tx.addOutput("n1BvxYnabtfDW1tyJbLtuKDRVWErkhu55j", finalDOGEAmount - satoshi);
            // 92J3Ke6DmQXJYQoALH3eK68w2HBcjY9iD52UEJU7rKToWGTRsot
            // tx.addOutput("mo1Q7hmsTgJE9Wj81wDzoZhrcmbcCm7HFs",finalDOGEAmount - satoshi);

            if(finalDOGEAmount==0)
            {
                res.status(401).json({
                    status: false,
                    message : 'Balance is 0 in Dogecoin Mainnet Wallet',
                    data: {
                        Amount : finalDOGEAmount
                    }
                });
            }
            else if(finalDOGEAmount-satoshi < 0)
            {
                res.status(401).json({
                    status: false,
                    message : 'Cannot pay Dogecoin Fee',
                    data: {
                        Amount : finalDOGEAmount,
                        fee : satoshi
                    }
                });
            }
            else{
                if(amount - satoshi >finalDOGEAmount - satoshi)
                {
                    // From Body input
                    tx.addOutput(toAdd,amount);
                    VoutNo ++;
                    tx.addOutput(fromAdd,finalDOGEAmount - amount - satoshi);
                    VoutNo ++;

                    console.log(VinNo);
                    for(var j=0; j<VinNo; j++)
                    {
                        tx.sign(j, privateKey);
                    }
                    
                    txhash.push(tx.build().toHex());
                    console.log(tx.build().toHex());
                } 
                else{
                    res.status(401).json({
                        status: false,
                        message : 'Amount or Fee not available in account to transfer',
                        data: {
                            Amount : finalDOGEAmount,
                            fee : satoshi,
                            AmountToSend : amount
                        }
                    });
                }
            }
        });

        console.log(txhash.toString());
        const finalTX = txhash.toString();
        
        await axios.post('https://blockstream.info/api/tx',finalTX)
        .then((response) => {
            
                console.log(response)
                const finalTXresponse = response.data;
                res.status(200).json({
                    status: true,
                    message : 'Dogecoin Mainnet Transfered From: '+fromAdd+' to: '+toAdd,
                    data: {
                        TransactionId : finalTXresponse
                    }
                });
            });
    
    } catch (err) {
        next(err);
    }
};
