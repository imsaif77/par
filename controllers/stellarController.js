const bitcoin = require('bitgo-utxo-lib')
const config = require('../config')
const bitcoinlib = require('bitcoinjs-lib')
const bip39 = require('bip39')
const bip32 = require('bip32')
const axios = require('axios')
const bigi    = require("bigi");
const securityutils = require('../common/securityUtils')
var StellarSdk = require('stellar-sdk');
var StellarHDWallet = require('stellar-hd-wallet');

// console.log(StellarHDWallet.generateMnemonic());

const BJSON = require('buffer-json')
var eccrypto = require("eccrypto");




// Mnemonic Decryption for user mnemonics
// const memprivkey =  process.env.mempriv;
// const memenckey =  process.env.memenc;
// const pribuf =  BJSON.parse(memprivkey); 
// const encbuf =  BJSON.parse(memenckey);
// const mnemonicsDecrypted = [];
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



xlmtestnet = {
    bip32: {public: 0, private: 0},
    messagePrefix: '',
    pubKeyHash: 0,
    scriptHash: 0,
    wif: 0,
};
xlmmainnet = {
    bip32: {public: 0, private: 0},
    messagePrefix: '',
    pubKeyHash: 0,
    scriptHash: 0,
    wif: 0,
};

// Stellar Mainnet Wallet Generate
exports.xlmwalletdetails = async (req, res, next) => {
    try {
        const memdecrypt = process.env.memenc;
        const mnemonics = memdecrypt.toString();
        const fromAccountNo = req.body.fromAccountNo;
        const toAccountNo = req.body.toAccountNo;        
        
        const wallet = StellarHDWallet.fromMnemonic(mnemonics);
        const addresses=[];
        for(let i=fromAccountNo;i<toAccountNo;i++){
            const publicAddress = wallet.getPublicKey(i);
            const privateKey = wallet.getSecret(i);
            let addressDetails={
                "addressNo" : parseInt(i),
                "publicAddress" : publicAddress,
                "privateKey" : privateKey
            };
            addresses.push(addressDetails);
        }

        

        res.status(200).json({
            status: true,
            message : 'XLM Address And Private Key of public Mnemonics',
            data: {
                addresses
            }
        });

    } catch (err) {
        next(err);
    }
};


// Stellar Mainnet Storage Wallet Generate
exports.xlmwalletdetailsstorage = async (req, res, next) => {
    try { 
        const fromAccountNo = req.body.fromAccountNo;
        const toAccountNo = req.body.toAccountNo;        
        const memdecrypt = process.env.memencstorage;
        const mnemonics = memdecrypt.toString();

        const wallet = StellarHDWallet.fromMnemonic(mnemonics);
        const addresses=[];
        for(let i=fromAccountNo;i<toAccountNo;i++){
            const publicAddress = wallet.getPublicKey(i);
            const privateKey = wallet.getSecret(i);
            let addressDetails={
                "addressNo" : parseInt(i),
                "publicAddress" : publicAddress,
                "privateKey" : privateKey
            };
            addresses.push(addressDetails);
        }

        

        res.status(200).json({
            status: true,
            message : 'XLM Address And Private Key of public Mnemonics',
            data: {
                addresses
            }
        });
    } catch (err) {
        next(err);
    }
};




// Batch Stellar Mainnet Wallet Generation
exports.displaywallets = async (req, res, next) => {
    try {
        const memdecrypt = process.env.memenc;
        const mnemonics = memdecrypt.toString();
        const accounts = req.body.accounts;
        const totalaccounts = req.body.totalaccounts;
        var i=0;
        const accdet = [];
        var accountdetails;
        for (i=0;i<totalaccounts;i++)
        {
            const seed = await bip39.mnemonicToSeed(mnemonics)
            const node = bitcoin.HDNode.fromSeedBuffer(seed)
            const child = node.derivePath("m/44'/0'/"+accounts+"'/0/"+i+"")
            const publicAddress = child.getAddress({
                network: bitcoin.networks.testnet
            });
            const privateKey = child.keyPair.toWIF();
            accountdetails = {
                "addressNo" : i,
                "publicAddress" : publicAddress,
                "privateKey" : privateKey
            }
            
            accdet.push(accountdetails);
        }
        
        const details = accdet;         
        res.status(200).json({
            status: true,
            message : 'Batch Bitcoin Mainnet Address And Private Keys of entered Mnemonics',
            data: {
                details
            }
        });

    } catch (err) {
        next(err);
    }
};

// Batch Bitcoin Testnet Wallet generation
exports.displaywalletstestnet = async (req, res, next) => {
    try {
        const memdecrypt = process.env.memenc;
        const mnemonics = memdecrypt.toString();
        const accounts = req.body.accounts;
        const totalaccounts = req.body.totalaccounts;
        var i=0;
        const accdet = [];
        var accountdetails;
        for (i=0;i<totalaccounts;i++)
        {
            const seed = await bip39.mnemonicToSeed(mnemonics)
            const node = bitcoin.HDNode.fromSeedBuffer(seed,xlmtestnet)
            const child = node.derivePath("m/44'/1'/"+accounts+"'/0/"+i+"")
            const publicAddress = child.getAddress({
                network: bitcoin.networks.testnet
            });
            const privateKey = child.keyPair.toWIF({ network: xlmtestnet });
            accountdetails = {
                "accountNo" : i,
                "publicAddress" : publicAddress,
                "privateKey" : privateKey
            }
            
            accdet.push(accountdetails);
        }
        
        const details = accdet;         
        res.status(200).json({
            status: true,
            message : 'Batch Bitcoin Testnet Address And Private Keys of entered Mnemonics',
            data: {
                details
            }
        });

    } catch (err) {
        next(err);
    }
};



// Batch Stellar Mainnet Wallet Generation
exports.displaywallets = async (req, res, next) => {
    try {
        const memdecrypt = process.env.memenc;
        const mnemonics = memdecrypt.toString();
        const accounts = req.body.accounts;
        const totalaccounts = req.body.totalaccounts;
        var i=0;
        const accdet = [];
        var accountdetails;
        for (i=0;i<totalaccounts;i++)
        {
            const seed = await bip39.mnemonicToSeed(mnemonics)
            const node = bitcoin.HDNode.fromSeedBuffer(seed)
            const child = node.derivePath("m/44'/0'/"+accounts+"'/0/"+i+"")
            const publicAddress = child.getAddress({
                network: bitcoin.networks.testnet
            });
            const privateKey = child.keyPair.toWIF();
            accountdetails = {
                "accountNo" : accounts,
                "addressNo" : i,
                "publicAddress" : publicAddress,
            }
            
            accdet.push(accountdetails);
        }
        
        const details = accdet;         
        res.status(200).json({
            status: true,
            message : 'Batch Bitcoin Mainnet Address And Private Keys of entered Mnemonics',
            data: {
                details
            }
        });

    } catch (err) {
        next(err);
    }
};

// Batch Bitcoin Testnet Wallet generation
exports.displaywalletstestnet = async (req, res, next) => {
    try {
        const memdecrypt = process.env.memenc;
        const mnemonics = memdecrypt.toString();
        const accounts = req.body.accounts;
        const totalaccounts = req.body.totalaccounts;
        var i=0;
        const accdet = [];
        var accountdetails;
        for (i=0;i<totalaccounts;i++)
        {
            const seed = await bip39.mnemonicToSeed(mnemonics)
            const node = bitcoin.HDNode.fromSeedBuffer(seed,xlmtestnet)
            const child = node.derivePath("m/44'/1'/"+accounts+"'/0/"+i+"")
            const publicAddress = child.getAddress({
                network: bitcoin.networks.testnet
            });
            const privateKey = child.keyPair.toWIF({ network: xlmtestnet });
            accountdetails = {
                "accountNo" : accounts,
                "addressNo" : i,
                "publicAddress" : publicAddress,
            }
            
            accdet.push(accountdetails);
        }
        
        const details = accdet;         
        res.status(200).json({
            status: true,
            message : 'Batch Bitcoin Testnet Address And Private Keys of entered Mnemonics',
            data: {
                details
            }
        });

    } catch (err) {
        next(err);
    }
};

// Batch Stellar Mainnet Wallet Generation : Storage Address
exports.displaystoragewallets = async (req, res, next) => {
    try {
        const memdecrypt = process.env.memencstorage;
        const mnemonics = memdecrypt.toString();
        const accounts = req.body.accounts;
        const totalaccounts = req.body.totalaccounts;
        var i=0;
        const accdet = [];
        var accountdetails;
        for (i=0;i<totalaccounts;i++)
        {
            const seed = await bip39.mnemonicToSeed(mnemonics)
            const node = bitcoin.HDNode.fromSeedBuffer(seed)
            const child = node.derivePath("m/44'/0'/"+accounts+"'/0/"+i+"")
            const publicAddress = child.getAddress({
                network: bitcoin.networks.testnet
            });
            const privateKey = child.keyPair.toWIF();
            accountdetails = {
                "accountNo" : accounts,
                "addressNo" : i,
                "publicAddress" : publicAddress,
            }
            
            accdet.push(accountdetails);
        }
        
        const details = accdet;         
        res.status(200).json({
            status: true,
            message : 'Batch Bitcoin Mainnet Address And Private Keys of entered Storage Mnemonics',
            data: {
                details
            }
        });

    } catch (err) {
        next(err);
    }
};

// Batch Bitcoin Testnet Wallet generation : Storage Address
exports.displaystoragewalletstestnet = async (req, res, next) => {
    try {
        const memdecrypt = process.env.memencstorage;
        const mnemonics = memdecrypt.toString();
        const accounts = req.body.accounts;
        const totalaccounts = req.body.totalaccounts;
        var i=0;
        const accdet = [];
        var accountdetails;
        for (i=0;i<totalaccounts;i++)
        {
            const seed = await bip39.mnemonicToSeed(mnemonics)
            const node = bitcoin.HDNode.fromSeedBuffer(seed,xlmtestnet)
            const child = node.derivePath("m/44'/1'/"+accounts+"'/0/"+i+"")
            const publicAddress = child.getAddress({
                network: bitcoin.networks.testnet
            });
            const privateKey = child.keyPair.toWIF({ network: xlmtestnet });
            accountdetails = {
                "accountNo" : accounts,
                "addressNo" : i,
                "publicAddress" : publicAddress,
            }
            
            accdet.push(accountdetails);
        }
        
        const details = accdet;         
        res.status(200).json({
            status: true,
            message : 'Batch Bitcoin Testnet Address And Private Keys of entered Storage Mnemonics',
            data: {
                details
            }
        });

    } catch (err) {
        next(err);
    }
};

// xlm Balance Mainnet
exports.xlmbalance = async (req, res, next) => {
    try {
        const address = req.body.address;

        
        await axios.get('https://blockstream.info/api/address/'+address).then((response) => {
            const totalConfirmedRecievedCount = response.data.chain_stats.funded_txo_count
            const totalConfirmedRecieved = response.data.chain_stats.funded_txo_sum/10**8
            const totalConfirmedSpentCount = response.data.chain_stats.spent_txo_count
            const totalConfirmedSent = response.data.chain_stats.spent_txo_sum/10**8
            const ConfirmedTXcount = response.data.chain_stats.tx_count
            const unspentTXcount = totalConfirmedRecievedCount-totalConfirmedSpentCount
            const totalBalance = (totalConfirmedRecieved - totalConfirmedSent).toFixed(8)

            const totalUnconfirmedRecievedCount = response.data.mempool_stats.funded_txo_count
            const totalUnconfirmedRecieved = response.data.mempool_stats.funded_txo_sum/10**8
            const totalUnconfirmedSpentCount = response.data.mempool_stats.spent_txo_count
            const totalUnconfirmedSent = response.data.mempool_stats.spent_txo_sum/10**8
            const UnconfirmedTXcount = response.data.mempool_stats.tx_count
            

            res.status(200).json({
                status: true,
                message : 'Bitcoin Address Balance Details',
                data: {
                    address,
                    totalConfirmedRecievedCount,
                    totalConfirmedRecieved,
                    totalConfirmedSpentCount,
                    totalConfirmedSent,
                    ConfirmedTXcount,
                    totalUnconfirmedRecievedCount,
                    totalUnconfirmedRecieved,
                    totalUnconfirmedSpentCount,
                    totalUnconfirmedSent,
                    UnconfirmedTXcount,
                    unspentTXcount,
                    totalBalance
                }
            });
        });        
        

    } catch (err) {
        next(err);
    }
};

// xlm Balance Testnet
exports.xlmbalancetestnet = async (req, res, next) => {
    try {
        const address = req.body.address;

        await axios.get('https://blockstream.info/testnet/api/address/'+address).then((response) => {
            const totalConfirmedRecievedCount = response.data.chain_stats.funded_txo_count
            const totalConfirmedRecieved = response.data.chain_stats.funded_txo_sum/10**8
            const totalConfirmedSpentCount = response.data.chain_stats.spent_txo_count
            const totalConfirmedSent = response.data.chain_stats.spent_txo_sum/10**8
            const ConfirmedTXcount = response.data.chain_stats.tx_count
            const unspentTXcount = totalConfirmedRecievedCount-totalConfirmedSpentCount
            const totalBalance = (totalConfirmedRecieved - totalConfirmedSent).toFixed(8)

            const totalUnconfirmedRecievedCount = response.data.mempool_stats.funded_txo_count
            const totalUnconfirmedRecieved = response.data.mempool_stats.funded_txo_sum/10**8
            const totalUnconfirmedSpentCount = response.data.mempool_stats.spent_txo_count
            const totalUnconfirmedSent = response.data.mempool_stats.spent_txo_sum/10**8
            const UnconfirmedTXcount = response.data.mempool_stats.tx_count
            

            res.status(200).json({
                status: true,
                message : 'Bitcoin Address Balance Details',
                data: {
                    address,
                    totalConfirmedRecievedCount,
                    totalConfirmedRecieved,
                    totalConfirmedSpentCount,
                    totalConfirmedSent,
                    ConfirmedTXcount,
                    totalUnconfirmedRecievedCount,
                    totalUnconfirmedRecieved,
                    totalUnconfirmedSpentCount,
                    totalUnconfirmedSent,
                    UnconfirmedTXcount,
                    unspentTXcount,
                    totalBalance
                }
            });
        });        
        

    } catch (err) {
        next(err);
    }
};

// Full Amount Transfer - Testnet
exports.xlmtransfertestnet = async (req, res, next) => {
    try {
        const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        const source = StellarSdk.Keypair.fromSecret('SA3W53XXG64ITFFIYQSBIJDG26LMXYRIMEVMNQMFAQJOYCZACCYBA34L')

        const account = await server.loadAccount(source.publicKey());

        /*
            Right now, we have one function that fetches the base fee.
            In the future, we'll have functions that are smarter about suggesting fees,
            e.g.: `fetchCheapFee`, `fetchAverageFee`, `fetchPriorityFee`, etc.
        */
        const fee = await server.fetchBaseFee();

        const transaction = new StellarSdk.TransactionBuilder(account, { fee, networkPassphrase: StellarSdk.Networks.TESTNET })
            .addOperation(
                // this operation funds the new account with XLM
                StellarSdk.Operation.payment({
                    destination: "GASOCNHNNLYFNMDJYQ3XFMI7BYHIOCFW3GJEOWRPEGK2TDPGTG2E5EDW",
                    asset: StellarSdk.Asset.native(),
                    amount: "2"
                })
            )
            .setTimeout(30)
            .build();

        // sign the transaction
        transaction.sign(StellarSdk.Keypair.fromSecret(source.secret()));

        try {
            const transactionResult = await server.submitTransaction(transaction);
            console.log(transactionResult);
        } catch (err) {
            console.error(err);
        }
    
    } catch (err) {
        next(err);
    }
};


// Transfer xlm : Mainnet
exports.xlmtransfermainnet = async (req, res, next) => {
    try {

        const memdecrypt = process.env.memenc;
        const mnemonics = memdecrypt.toString();
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
        const privateKey = bitcoin.ECPair.fromWIF(privateKeyEncode,xlmmainnet)

        const fromAdd = privateKey.getAddress();  
        
        // For Manual Fee Setting
        const satoshi = 10000;

        var VinNo = 0;
        var VoutNo = 0;

        console.log("my public key:", fromAdd);
        const txhash = [];
        const tx = new bitcoin.TransactionBuilder(xlmmainnet);

        await axios.get('https://blockstream.info/api/address/'+fromAdd+'/utxo').then((response) => {
            console.log(Object.keys(response.data).length);
            var finalxlmAmount = 0;
            for (i = Object.keys(response.data).length - 1 ; i >= 0; i--) { 

                console.log(response);
                finalxlmAmount = finalxlmAmount + response.data[i].value;

                if (finalxlmAmount!=0)
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

            
            console.log("Money to be Sent",finalxlmAmount - satoshi);
            console.log("Balance in Wallet",finalxlmAmount);
  
            if(finalxlmAmount==0)
            {
                res.status(401).json({
                    status: false,
                    message : 'Balance is 0 in Bitcoin Mainnet Wallet',
                    data: {
                        Amount : finalxlmAmount
                    }
                });
            }
            else if(finalxlmAmount-satoshi < 0)
            {
                res.status(401).json({
                    status: false,
                    message : 'Cannot pay Bitcoin Fee',
                    data: {
                        Amount : finalxlmAmount,
                        fee : satoshi
                    }
                });
            }
            else{
                // From Body input
                tx.addOutput(toAdd,finalxlmAmount - satoshi);
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
                    message : 'Bitcoin Mainnet Transfered From: '+fromAdd+' to: '+toAdd,
                    data: {
                        TransactionId : finalTXresponse
                    }
                });
            });
    
    } catch (err) {
        next(err);
    }
};





exports.generatexlmtestaddress = async (req, res, next) => {
    try {
        await axios.post('http://api.blockcypher.com/v1/xlm/test3/addrs').then((response) => {
        txlmprivate = response.data.private;
        txlmpublic = response.data.public;
        txlmaddress = response.data.address;
        txlmwif = response.data.wif;
        res.status(200).json({
            status: true,
            message : 'Bitcoin Testnet Address Generated',
            data: {
                private : txlmprivate,
                public : txlmpublic,
                address : txlmaddress,
                wif : txlmwif
            }
        });
        
    });
       
       

    } catch (err) {
        next(err);
    }
};


// Bitcoin Fee Calculator
exports.xlmfee = async (req, res, next) => {
    try {
        const satperbt = [];
        const AverageFee = [];

        const Vin = req.body.vin;
        const Vout = req.body.vout;

        var FeeEstimate = 0;
        const vbytes = Vin * 146 + Vout * 33 + 10;

        await axios.get('https://btc.com/service/fees/distribution').then((response) => {
            const satperbytes = response.data.fees_recommended.one_block_fee;
            satperbt.push(satperbytes);
        });

        await axios.get('https://blockstream.info/api/fee-estimates').then((response) => {
            for (i = Object.keys(response.data).length - 3 ; i > 0; i--) { 
                FeeEstimate = FeeEstimate + response.data[i];
            }
            AverageFee.push(FeeEstimate/25);
        });
        

        var feefortx = parseInt(vbytes * satperbt.toString());
        var avgfee =  parseInt(vbytes * AverageFee.toString());

        res.status(200).json({
            status: true,
            message : 'Bitcoin Fees According to Network',
            data: {
                FastTx : feefortx,
                AvgTx : avgfee,
                SatoshiPerBytes  :  satperbt.toString(),
                AverageFee : AverageFee.toString()
            }
        });

    } catch (err) {
        next(err);
    }
};




// Bitcoin Account Details
exports.xlmaccountdetails = async (req, res, next) => {
    try {
        
        const userAddress = req.body.userAddress;
        
        await axios.get('https://chain.api.btc.com/v3/address/'+userAddress).then((response) => {
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
                message : 'Bitcoin user Detail',
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


// Bitcoin Account Transaction Details
exports.xlmaccounttxdetails = async (req, res, next) => {
    try {
        
        const userAddress = req.body.userAddress;
        const pageNo = req.body.pageNo;

        await axios.get('https://chain.api.btc.com/v3/address/'+userAddress+'/tx?page='+pageNo).then((response) => {
            const transactions = response.data.data;
            
            res.status(200).json({
                status: true,
                message : 'Bitcoin user Transaction Details',
                data: {
                    transactions
                }
            });
        });

    } catch (err) {
        next(err);
    }
};


// Bitcoin Account Unspent Transaction Details
exports.xlmaccountunspenttxdetails = async (req, res, next) => {
    try {
        
        const userAddress = req.body.userAddress;
        const pageNo = req.body.pageNo;

        await axios.get('https://chain.api.btc.com/v3/address/'+userAddress+'/unspent?page='+pageNo).then((response) => {
            const UnspentTransactions = response.data.data;
            
            res.status(200).json({
                status: true,
                message : 'Bitcoin user Unspent Transaction Details',
                data: {
                    UnspentTransactions
                }
            });
        });

    } catch (err) {
        next(err);
    }
};


// Bitcoin Transaction Hash Checking : Mainnet
exports.xlmtxhashcheck = async (req, res, next) => {
    try {
        
        const txHash = req.body.txHash;
        

        await axios.get('https://blockstream.info/api/tx/'+txHash+'/status').then((response) => {
            const TransactionStatus = response.data;
            
            res.status(200).json({
                status: true,
                message : 'Bitcoin user Transaction Confirmation Status',
                data: {
                    TransactionStatus
                }
            });
        });

    } catch (err) {
        next(err);
    }
};


// Bitcoin Transaction Hash Checking : Testnet
exports.xlmtxhashchecktestnet = async (req, res, next) => {
    try {
        
        const txHash = req.body.txHash;
        

        await axios.get('https://blockstream.info/testnet/api/tx/'+txHash+'/status').then((response) => {
            const TransactionStatus = response.data;
            
            res.status(200).json({
                status: true,
                message : 'Bitcoin user Transaction Confirmation Status',
                data: {
                    TransactionStatus
                }
            });
        });

    } catch (err) {
        next(err);
    }
};


// Bitcoin Transaction Hash Checking : Mainnet
exports.xlmtxhashdetails = async (req, res, next) => {
    try {
        
        const txHash = req.body.txHash;
        

        await axios.get('https://blockstream.info/api/tx/'+txHash).then((response) => {
            const TransactionDetails = response.data;
            // const confirmations = response.data.data.confirmations;
            
            res.status(200).json({
                status: true,
                message : 'Bitcoin user Transaction Complete Details',
                // confirmations : confirmations,
                data: {
                    TransactionDetails
                }
            });
        });

    } catch (err) {
        next(err);
    }
};


// Bitcoin Transaction Hash Checking : Testnet
exports.xlmtxhashdetailstestnet = async (req, res, next) => {
    try {
        
        const txHash = req.body.txHash;
        

        await axios.get('https://blockstream.info/testnet/api/tx/'+txHash).then((response) => {
            const TransactionDetails = response.data;
            // const confirmations = response.data.data.confirmations;
            
            res.status(200).json({
                status: true,
                message : 'Bitcoin user Transaction Complete Details',
                // confirmations : confirmations,
                data: {
                    TransactionDetails
                }
            });
        });

    } catch (err) {
        next(err);
    }
};


// Batch Sending of Bitcoins
// Send particular Amount in Bitcoin Testnet:
// Transfer xlm : Testnet
exports.withdrawxlmtestnet = async (req, res, next) => {
    try {

        const toAdds = req.body.toAddress;
        const amounts = req.body.amounts;
        const feeType = req.body.feeType;

        const memdecrypt = process.env.memencstorage;
        const mnemonics = memdecrypt.toString();
        const accounts = req.body.storageaccounts;
        const addressnumber = req.body.storageaddressnumber;
        const seed = await bip39.mnemonicToSeed(mnemonics)
        const node = bitcoin.HDNode.fromSeedBuffer(seed,xlmtestnet)
        const child = node.derivePath("m/44'/1'/"+accounts+"'/0/"+addressnumber+"")
        const fromAdd = child.getAddress({
            network: bitcoin.networks.testnet
          });

        const privateKeyEncode = child.keyPair.toWIF();
        // From Body Input
        const privateKey = bitcoin.ECPair.fromWIF(privateKeyEncode,xlmtestnet)
        
        var satoshi = 10000;
        var totalAmountToSend =0;

        // To Addresss Splits
        var toAddArray = toAdds.split(/\s*,\s*/);
        var toAmountArray = amounts.split(/\s*,\s*/);
        for(var i = 0; i < toAmountArray.length; i++) { 
            totalAmountToSend = totalAmountToSend + parseFloat(toAmountArray[i]);
        }

        console.log("total to be sent ",totalAmountToSend)
        var VinNo = 0;
        var VoutNo = toAddArray.length + 1;
        var VinFinal = [];
        console.log("my public key:", fromAdd);
        const txhash = [];
        const tx = new bitcoin.TransactionBuilder(xlmtestnet);

        const satperbt = [];
        const AverageFee = [];

        
        

        var FeeEstimate = 0;

        await axios.get('https://btc.com/service/fees/distribution').then((response) => {
            const satperbytes = response.data.fees_recommended.one_block_fee;
            satperbt.push(satperbytes);
        });

        await axios.get('https://blockstream.info/testnet/api/fee-estimates').then((response) => {
            for (i = Object.keys(response.data).length - 3 ; i > 0; i--) { 
                FeeEstimate = FeeEstimate + response.data[i];
            }
            AverageFee.push(FeeEstimate/25);
        });
        

        


        await axios.get('https://blockstream.info/testnet/api/address/'+fromAdd+'/utxo').then((response) => {
            // console.log(Object.keys(response.data).length);
            var finalxlmAmount = 0;
            for (i = Object.keys(response.data).length - 1 ; i >= 0; i--) { 

                // console.log(response);
                finalxlmAmount = finalxlmAmount + response.data[i].value;

                if (finalxlmAmount!=0)
                {
                    tx.addInput(response.data[i].txid, response.data[i].vout);
                    VinNo ++;
                }
            }


           
            // To Compute Transaction Fee
            const Vin = VinNo;
            const Vout = VoutNo;
            const vbytes = Vin * 146 + Vout * 33 + 10;

            if(feeType == 0)
            {
                var feefortx = parseInt(vbytes * satperbt.toString());
                 satoshi = feefortx;
            }
            else if(feeType == 1)
            {
                var avgfee =  parseInt(vbytes * AverageFee.toString());
                 satoshi = avgfee;
            }

            console.log("vin: "+Vin+" vout: "+Vout)
            console.log("fee is :",satoshi);

            console.log("Money to be Sent",totalAmountToSend + satoshi);
            console.log("Balance in Wallet",finalxlmAmount);


            if(finalxlmAmount==0)
            {
                res.status(401).json({
                    status: false,
                    message : 'Balance is 0 in Bitcoin Mainnet Wallet',
                    data: {
                        Amount : finalxlmAmount
                    }
                });
            }
            else if(finalxlmAmount-satoshi < 0)
            {
                res.status(401).json({
                    status: false,
                    message : 'Cannot pay Bitcoin Fee',
                    data: {
                        Amount : finalxlmAmount,
                        fee : satoshi
                    }
                });
            }
            else{
                if(finalxlmAmount > totalAmountToSend - satoshi)
                {
                    // From Body input
                    for(var i = 0; i < toAmountArray.length; i++) { 
                        tx.addOutput(toAddArray[i].toString(),parseInt(toAmountArray[i]));
                        console.log(toAddArray[i].toString())
                    }
                    tx.addOutput(fromAdd,finalxlmAmount - totalAmountToSend - satoshi);
                    console.log(fromAdd)
                    // console.log(VinNo);
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
                            Amount : finalxlmAmount,
                            fee : satoshi,
                            AmountToSend : amount
                        }
                    });
                }
            }
        });

        // console.log(txhash.toString());
        const finalTX = txhash.toString();
        
        await axios.post('https://blockstream.info/testnet/api/tx',finalTX)
        .then((response) => {
            
                // console.log(response)
                const finalTXresponse = response.data;
                res.status(200).json({
                    status: true,
                    message : 'Bitcoin Testnet Transfered',
                    data: {
                       TransactionId : finalTXresponse
                    }
                });
            });
    
    } catch (err) {
        next(err);
    }
};






// Batch Sending of Bitcoins
// Send particular Amount in Bitcoin Mainnet:
// Transfer xlm : Mainnet
exports.withdrawxlm = async (req, res, next) => {
    try {

        const toAdds = req.body.toAddress;
        const amounts = req.body.amounts;
        const feeType = req.body.feeType;

        const memdecrypt = process.env.memencstorage;
        const mnemonics = memdecrypt.toString();
        const accounts = req.body.storageaccounts;
        const addressnumber = req.body.storageaddressnumber;
        const seed = await bip39.mnemonicToSeed(mnemonics)
        const node = bitcoin.HDNode.fromSeedBuffer(seed)
        const child = node.derivePath("m/44'/0'/"+accounts+"'/0/"+addressnumber+"")
        const fromAdd = child.getAddress();
        
        const privateKeyEncode = child.keyPair.toWIF();
        // From Body Input
        const privateKey = bitcoin.ECPair.fromWIF(privateKeyEncode)
        
        var satoshi = 10000;
        var totalAmountToSend =0;

        // To Addresss Splits
        var toAddArray = toAdds.split(/\s*,\s*/);
        var toAmountArray = amounts.split(/\s*,\s*/);
        for(var i = 0; i < toAmountArray.length; i++) { 
            totalAmountToSend = totalAmountToSend + parseFloat(toAmountArray[i]);
        }

        console.log("total to be sent ",totalAmountToSend)
        var VinNo = 0;
        var VoutNo = toAddArray.length + 1;
        var VinFinal = [];
        console.log("my public key:", fromAdd);
        const txhash = [];
        const tx = new bitcoin.TransactionBuilder(xlmmainnet);

        const satperbt = [];
        const AverageFee = [];

        
        

        var FeeEstimate = 0;

        await axios.get('https://btc.com/service/fees/distribution').then((response) => {
            const satperbytes = response.data.fees_recommended.one_block_fee;
            satperbt.push(satperbytes);
        });

        await axios.get('https://blockstream.info/api/fee-estimates').then((response) => {
            for (i = Object.keys(response.data).length - 3 ; i > 0; i--) { 
                FeeEstimate = FeeEstimate + response.data[i];
            }
            AverageFee.push(FeeEstimate/25);
        });
        

        


        await axios.get('https://blockstream.info/api/address/'+fromAdd+'/utxo').then((response) => {
            // console.log(Object.keys(response.data).length);
            var finalxlmAmount = 0;
            for (i = Object.keys(response.data).length - 1 ; i >= 0; i--) { 

                // console.log(response);
                finalxlmAmount = finalxlmAmount + response.data[i].value;

                if (finalxlmAmount!=0)
                {
                    tx.addInput(response.data[i].txid, response.data[i].vout);
                    VinNo ++;
                }
            }


           
            // To Compute Transaction Fee
            const Vin = VinNo;
            const Vout = VoutNo;
            const vbytes = Vin * 146 + Vout * 33 + 10;

            if(feeType == 0)
            {
                var feefortx = parseInt(vbytes * satperbt.toString());
                 satoshi = feefortx;
            }
            else if(feeType == 1)
            {
                var avgfee =  parseInt(vbytes * AverageFee.toString());
                 satoshi = avgfee;
            }

            console.log("vin: "+Vin+" vout: "+Vout)
            console.log("fee is :",satoshi);

            console.log("Money to be Sent",totalAmountToSend + satoshi);
            console.log("Balance in Wallet",finalxlmAmount);


            if(finalxlmAmount==0)
            {
                res.status(401).json({
                    status: false,
                    message : 'Balance is 0 in Bitcoin Mainnet Wallet',
                    data: {
                        Amount : finalxlmAmount
                    }
                });
            }
            else if(finalxlmAmount-satoshi < 0)
            {
                res.status(401).json({
                    status: false,
                    message : 'Cannot pay Bitcoin Fee',
                    data: {
                        Amount : finalxlmAmount,
                        fee : satoshi
                    }
                });
            }
            else{
                if(finalxlmAmount > totalAmountToSend - satoshi)
                {
                    // From Body input
                    for(var i = 0; i < toAmountArray.length; i++) { 
                        tx.addOutput(toAddArray[i].toString(),parseInt(toAmountArray[i]));
                        console.log(toAddArray[i].toString())
                    }
                    tx.addOutput(fromAdd,finalxlmAmount - totalAmountToSend - satoshi);
                    console.log(fromAdd)
                    // console.log(VinNo);
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
                            Amount : finalxlmAmount,
                            fee : satoshi,
                            AmountToSend : amount
                        }
                    });
                }
            }
        });

        // console.log(txhash.toString());
        const finalTX = txhash.toString();
        
        await axios.post('https://blockstream.info/api/tx',finalTX)
        .then((response) => {
            
                // console.log(response)
                const finalTXresponse = response.data;
                res.status(200).json({
                    status: true,
                    message : 'Bitcoin Mainnet Transfered',
                    data: {
                       TransactionId : finalTXresponse
                    }
                });
            });
    
    } catch (err) {
        next(err);
    }
};



// Bitcoin Transaction Details of Address : Mainnet
exports.xlmtxdetails = async (req, res, next) => {
    try {
        
        const userAddress = req.body.userAddress;
        

        await axios.get('https://blockstream.info/api/address/'+userAddress+'/txs').then((response) => {
            const TransactionDetails = response.data;
            // const confirmations = response.data.data.confirmations;
            
            res.status(200).json({
                status: true,
                message : 'Bitcoin user Transaction Complete Details',
                // confirmations : confirmations,
                data: {
                    TransactionDetails
                }
            });
        });

    } catch (err) {
        next(err);
    }
};

// Bitcoin Transaction Details of Address : Testnet
exports.xlmtxdetailstestnet = async (req, res, next) => {
    try {
        
        const userAddress = req.body.userAddress;
        

        await axios.get('https://blockstream.info/testnet/api/address/'+userAddress+'/txs').then((response) => {
            const TransactionDetails = response.data;
            // const confirmations = response.data.data.confirmations;
            
            res.status(200).json({
                status: true,
                message : 'Bitcoin user Transaction Complete Details',
                // confirmations : confirmations,
                data: {
                    TransactionDetails
                }
            });
        });

    } catch (err) {
        next(err);
    }
};