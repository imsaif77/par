const ethers = require('ethers')
const config = require('../config')
const utils = require('ethers').utils
const BJSON = require('buffer-json')
var eccrypto = require("eccrypto");
const Web3 = require("web3");
var Tx = require('ethereumjs-tx').Transaction;
const axios = require('axios')
const bip39 = require('bip39');
const networks = require('bitgo-utxo-lib/src/networks');
// var BigInt = require("big-integer");
// var bignum = require('bignum');


// Environment Configuration from Exposed Env
const { ercAbi } = config
const { networkETH } = config

// Configure blockchain
const provider = new ethers.getDefaultProvider()
const providerTestnet = new ethers.getDefaultProvider(networkETH)


// Mnemonic Decryption for user mnemonics
// const memprivkey =  process.env.mempriv;
// const memenckey =  process.env.memenc;
// const pribuf =  BJSON.parse(memprivkey); 
// const encbuf =  BJSON.parse(memenckey);
// const mnemonicsDecrypted = [];
// eccrypto.decrypt(pribuf, encbuf).then(function(plaintext) {
//     decryptedText = plaintext.toString();
//     mnemonicsDecrypted.push(decryptedText);   
//     // console.log((process.env.memenc).toString())

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


// Ethereum Wallet Details
exports.ethwalletdetails = async (req, res, next) => {
    try {
        const mnemonicParse = (process.env.memenc).toString();
        const accounts = req.body.accounts;
        const addressnumber = req.body.addressnumber;
        const walletPath = {
            "standard": "m/44'/60'/"+accounts+"'/0/"+addressnumber+"",
        };
        const hdnode = ethers.utils.HDNode.fromMnemonic(mnemonicParse);
        const node = hdnode.derivePath(walletPath.standard);
        const wallet = new ethers.Wallet(node.privateKey);
        const publicAddress = wallet.address;
        const privateKey = node.privateKey;
    
        res.status(200).json({
            status: true,
            message : 'Ethereum Address And Private Key of public Mnemonics',
            data: {
                accounts,
                addressnumber,
                publicAddress,
            }
        });

    } catch (err) {
        next(err);
    }
};

// Ethereum Wallet Details
exports.generateethwalletdetails = async (req, res, next) => {
    try {
        const mnemonicParse = (process.env.memenc).toString();
        const accounts = req.body.batchNo;
        const fromAccountNo = req.body.fromAccountNo;
        const toAccountNo = req.body.toAccountNo;

        var i=0;
        const accdet = [];
        var accountdetails;
        for (i=fromAccountNo;i<toAccountNo;i++)
        {
            const walletPath = {
                "standard": "m/44'/60'/"+accounts+"'/0/"+i+"",
            };
            const hdnode = ethers.utils.HDNode.fromMnemonic(mnemonicParse);
            const node = hdnode.derivePath(walletPath.standard);
            const wallet = new ethers.Wallet(node.privateKey);
            const publicAddress = wallet.address;
            const privateKey = node.privateKey;

            accountdetails = {
                "addressNo" : i,
                "publicAddress" : publicAddress,
            }
            
            accdet.push(accountdetails);
        }
        const details = accdet;         
        res.status(200).json({
            status: true,
            message : 'Batch Ethereum Mainnet/Testnet Address And Private Keys of user Mnemonics',
            data: {
                details
            }
        });

    } catch (err) {
        next(err);
    }
};

// Ethereum Storage Wallet Details
exports.ethwalletdetailsstorage = async (req, res, next) => {
    try {
        const mnemonicParse = (process.env.memencstorage).toString();
        const accounts = req.body.accounts;
        const addressnumber = req.body.addressnumber;
        const walletPath = {
            "standard": "m/44'/60'/"+accounts+"'/0/"+addressnumber+"",
        };
        const hdnode = ethers.utils.HDNode.fromMnemonic(mnemonicParse);
        const node = hdnode.derivePath(walletPath.standard);
        const wallet = new ethers.Wallet(node.privateKey);
        const publicAddress = wallet.address;
        const privateKey = node.privateKey;
    
        res.status(200).json({
            status: true,
            message : 'Ethereum Address And Private Key of Storage Mnemonics',
            data: {
                accounts,
                addressnumber,
                publicAddress,
            }
        });

    } catch (err) {
        next(err);
    }
};

// Ethereum Wallet Details
exports.generateethwalletdetailsstorage = async (req, res, next) => {
    try {
        const mnemonicParse = (process.env.memencstorage).toString();
        const accounts = req.body.batchNo;
        const fromAccountNo = req.body.fromAccountNo;
        const toAccountNo = req.body.toAccountNo;
        var i=0;
        const accdet = [];
        var accountdetails;
        for (i=fromAccountNo;i<toAccountNo;i++)
        {
            const walletPath = {
                "standard": "m/44'/60'/"+accounts+"'/0/"+i+"",
            };
            const hdnode = ethers.utils.HDNode.fromMnemonic(mnemonicParse);
            const node = hdnode.derivePath(walletPath.standard);
            const wallet = new ethers.Wallet(node.privateKey);
            const publicAddress = wallet.address;
            const privateKey = node.privateKey;

            accountdetails = {
                "addressNo" : i,
                "publicAddress" : publicAddress,
            }
            
            accdet.push(accountdetails);
        }
        const details = accdet;         
        res.status(200).json({
            status: true,
            message : 'Batch Ethereum Mainnet/Testnet Address And Private Keys of Storage Mnemonics',
            data: {
                details
            }
        });

    } catch (err) {
        next(err);
    }
};



// Ethereum Wallet Details
exports.generateethfeewallet = async (req, res, next) => {
    try {
        const mnemonicsDetail = process.env.feestorage;
        const mnemonicParse = mnemonicsDetail.toString();
        const accounts = req.body.accounts;
        const totalaccounts = req.body.totalaccounts;
        var i=0;
        const accdet = [];
        var accountdetails;
        for (i=0;i<totalaccounts;i++)
        {
            const walletPath = {
                "standard": "m/44'/60'/"+accounts+"'/0/"+i+"",
            };
            const hdnode = ethers.utils.HDNode.fromMnemonic(mnemonicParse);
            const node = hdnode.derivePath(walletPath.standard);
            const wallet = new ethers.Wallet(node.privateKey);
            const publicAddress = wallet.address;
            const privateKey = node.privateKey;

            accountdetails = {
                "addressNo" : i,
                "publicAddress" : publicAddress,
            }
            
            accdet.push(accountdetails);
        }
        const details = accdet;         
        res.status(200).json({
            status: true,
            message : 'Batch Ethereum Mainnet/Testnet Address And Private Keys of fee Mnemonics',
            data: {
                details
            }
        });

    } catch (err) {
        next(err);
    }
};


// Ethereum Balance Check (This will be used for cron job scheduling)
exports.ethbalcheck = async (req, res, next) => {
    try {
        const address = req.body.address;
        const network = "Mainnet"
        await provider.getBalance(address).then((balance) => {
            const etherBalance = ethers.utils.formatEther(balance);
            res.status(200).json({
                status: true,
                message : 'The Balance for address: '+address+' is: '+etherBalance+' ETH',
                data: {
                    network,
                    address,
                    balance : etherBalance
                }
            });    
        });
    } catch (err) {
        next(err);
    }
};

// Ethereum Balance Check Testnet (This will be used for cron job scheduling)
exports.ethbalchecktestnet = async (req, res, next) => {
    try {
        const address = req.body.address;
        const network = "Ropsten Testnet"
        await providerTestnet.getBalance(address).then((balance) => {
            const etherBalance = ethers.utils.formatEther(balance);
            res.status(200).json({
                status: true,
                message : 'The Balance for address: '+address+' is: '+etherBalance+' ETH',
                data: {
                    network,
                    address,
                    balance : etherBalance
                }
            });    
        });
    } catch (err) {
        next(err);
    }
};


// This Function will Transfer Ethereum to Admin cold wallet
// Function yet to be written 






// ERC token balance checking function
exports.erctokenbalcheck = async (req, res, next) => {
    try {
        const tokenaddress = req.body.tokenaddress;
        const address = req.body.address;
        const tokenLoad = new ethers.Contract(tokenaddress,ercAbi,provider)
        const decimals = await tokenLoad.functions.decimals()
        const divDigit = 10**decimals
        const balanceOf = await tokenLoad.functions.balanceOf(address)
        const tokenBal = balanceOf.toString()/divDigit
        const symbol = await tokenLoad.functions.symbol()
        const name = await tokenLoad.functions.name()
        res.status(200).json({
            status: true,
            message : 'The '+name+' Balance for address: '+address+' is: '+tokenBal+' '+symbol,
            data: {
                networkETH,
                address,
                name,
                symbol,
                decimals,
                balance : tokenBal
            }
        });    
       
    } catch (err) {
        next(err);
    }
};


// ERC token balance checking function Testnet
exports.erctokenbalchecktestnet = async (req, res, next) => {
    try {
        const tokenaddress = req.body.tokenaddress;
        const address = req.body.address;
        const tokenLoad = new ethers.Contract(tokenaddress,ercAbi,providerTestnet)
        const decimals = await tokenLoad.functions.decimals()
        const divDigit = 10**decimals
        const balanceOf = await tokenLoad.functions.balanceOf(address)
        const tokenBal = balanceOf.toString()/divDigit
        const symbol = await tokenLoad.functions.symbol()
        const name = await tokenLoad.functions.name()
        res.status(200).json({
            status: true,
            message : 'The '+name+' Balance for address: '+address+' is: '+tokenBal+' '+symbol,
            data: {
                networkETH,
                address,
                name,
                symbol,
                decimals,
                balance : tokenBal
            }
        });    
       
    } catch (err) {
        next(err);
    }
};


// // Transfer Ethereum Balance to Cold Wallet
// exports.transferethereum = async (req, res, next) => {
//     try {

//         // Loading the Sending or from wallet details
//         const toWalletAddress = coldAddressEth;
//         const mnemonicParse = mnemonics;
//         const accounts = req.body.accounts;
//         const addressnumber = req.body.addressnumber;
//         const walletPath = {
//             "standard": "m/44'/60'/"+accounts+"'/0/"+addressnumber+"",
//         };
//         const hdnode = ethers.utils.HDNode.fromMnemonic(mnemonicParse);
//         const node = hdnode.derivePath(walletPath.standard);
//         const wallet1 = new ethers.Wallet(node.privateKey);
//         const fromWalletAddress = wallet1.address;
//         const privateKey = node.privateKey;
        
//         // Connect a wallet to Testnet
//         const wallet = new ethers.Wallet(privateKey, providerTestnet);

//         // Getting the balance in the generated wallet
//         const balanceEth = ethers.utils.formatEther(await wallet.getBalance());
//         const balance =  await wallet.getBalance();
//         console.log(balanceEth)
        
//         const gas = await providerTestnet.estimateGas({ to: coldAddressEth,value: ethers.utils.parseEther(balanceEth)})
//         // console.log(ethers.utils.formatUnits(gas,'wei').toString(10))
//         const gasl = 21000;
//         const gasp = await providerTestnet.getGasPrice();
//         // console.log(ethers.utils.formatUnits(await provider.getGasPrice(),'wei'))
//         // console.log(ethers.utils.formatEther(utils.bigNumberify("20000000000")))

//         let value = balance.sub(gasp.mul(gasl))
//         // Transfer Ethereum to Coldwallet Address
//         let tx = {
//             gasLimit: gasl,
//             gasPrice: gasp,
//             to: coldAddressEth,
//             value: value
//         };

//         const transferEth = await wallet.sendTransaction(tx);
  
//         const from = transferEth.from
//         const to = transferEth.to
//         const hash = transferEth.hash
//         const sentEth = ethers.utils.formatEther(transferEth.value)
//         const gasPriceTx = ethers.utils.formatEther(transferEth.gasPrice)
        
//         res.status(200).json({
//             status: true,
//             message : 'ETH Transfered to '+coldAddressEth+ ' Successfully',
//             data: {
//                 from,
//                 to,
//                 hash,
//                 sentEth,
//                 gasPriceTx
//             }
//         });
        
       
//     } catch (err) {
//         next(err);
//     }
// };

// Transfer Ethereum Balance to Cold Wallet
exports.transferethereumtestnet = async (req, res, next) => {
    try {

        // Loading the Sending or from wallet details
        const memdecrypt = process.env.memenc;
        const mnemonics = memdecrypt.toString();
        const accounts = req.body.accounts;
        const addressnumber = req.body.addressnumber;
        const toAdd = req.body.toAddress;
        const walletPath = {
            "standard": "m/44'/60'/"+accounts+"'/0/"+addressnumber+"",
        };
        const hdnode = ethers.utils.HDNode.fromMnemonic(mnemonics);
        const node = hdnode.derivePath(walletPath.standard);
        const wallet1 = new ethers.Wallet(node.privateKey);
        const fromWalletAddress = wallet1.address;
        const privateKey = node.privateKey;
        // console.log(fromWalletAddress)
        // Connect a wallet to Testnet
        const wallet = new ethers.Wallet(privateKey, providerTestnet);

        // Getting the balance in the generated wallet
        const balanceEth = ethers.utils.formatEther(await wallet.getBalance());
        const balance =  ethers.utils.formatUnits(await wallet.getBalance(),'wei');
        console.log(balance);
        
        // const gas = await providerTestnet.estimateGas({ to: coldAddressEth,value: ethers.utils.parseEther(balance)})
        // console.log(ethers.utils.formatUnits(gas,'wei').toString(10))
        const gasl = 21000;
        const gasp = ethers.utils.formatUnits(await providerTestnet.getGasPrice(),'wei');
        const gaspn = await providerTestnet.getGasPrice();
        console.log("gasprice",gasp)
        // console.log(ethers.utils.formatUnits(await provider.getGasPrice(),'wei'))
        // console.log(ethers.sutils.formatEther(utils.bigNumberify("20000000000")))

        let value = balance -(gasp * (gasl));
        console.log(value);
        console.log(ethers.utils.hexlify(ethers.utils.bigNumberify(value.toString())));
        // Transfer Ethereum to Coldwallet Address
        let tx = {
            gasLimit: gasl,
            gasPrice: gaspn,
            to: toAdd,
            value: ethers.utils.hexlify(ethers.utils.bigNumberify(value.toString()))
        };
        if(balance!=0)
        {
            const transferEth = await wallet.sendTransaction(tx);
    
            const from = transferEth.from
            const to = transferEth.to
            const hash = transferEth.hash
            const sentEth = ethers.utils.formatEther(transferEth.value)
            const gasPriceTx = ethers.utils.formatEther(transferEth.gasPrice)
            
            res.status(200).json({
                status: true,
                message : `ETH Transfered to ${toAdd} Successfully`,
                data: {
                    from,
                    to,
                    hash,
                    sentEth,
                    gasPriceTx
                }
            });
        }
        else{
            res.status(400).json({
                status: false,
                message : `ETH Balance is 0`,
                
            });
        }
        
       
    } catch (err) {
        next(err);
    }
};



// Transfer Ethereum Balance to Cold Wallet Mainnet
exports.transferethereum = async (req, res, next) => {
    try {

        // Loading the Sending or from wallet details
        const memdecrypt = process.env.memenc;
        const mnemonics = memdecrypt.toString();
        const accounts = req.body.accounts;
        const addressnumber = req.body.addressnumber;
        const toAdd = req.body.toAddress;
        const walletPath = {
            "standard": "m/44'/60'/"+accounts+"'/0/"+addressnumber+"",
        };
        const hdnode = ethers.utils.HDNode.fromMnemonic(mnemonics);
        const node = hdnode.derivePath(walletPath.standard);
        const wallet1 = new ethers.Wallet(node.privateKey);
        const fromWalletAddress = wallet1.address;
        const privateKey = node.privateKey;
        // console.log(fromWalletAddress)
        // Connect a wallet to Testnet
        const wallet = new ethers.Wallet(privateKey, provider);

        // Getting the balance in the generated wallet
        const balanceEth = ethers.utils.formatEther(await wallet.getBalance());
        const balance =  await wallet.getBalance();
        console.log(balanceEth)
        
        const gasl = 21000;
        const gasp = ethers.utils.formatUnits(await provider.getGasPrice(),'wei');
        const gaspn = await provider.getGasPrice();
        console.log("gasprice",gasp)
        // console.log(ethers.utils.formatUnits(await provider.getGasPrice(),'wei'))
        // console.log(ethers.sutils.formatEther(utils.bigNumberify("20000000000")))

        let value = balance -(gasp * (gasl));
        console.log(value);
        // Transfer Ethereum to Coldwallet Address
        let tx = {
            gasLimit: gasl,
            gasPrice: gaspn,
            to: toAdd,
            value: ethers.utils.hexlify(ethers.utils.bigNumberify(value.toString()))
        };
        if(balance!=0)
        {
            const transferEth = await wallet.sendTransaction(tx);
        
            const from = transferEth.from
            const to = transferEth.to
            const hash = transferEth.hash
            const sentEth = ethers.utils.formatEther(transferEth.value)
            const gasPriceTx = ethers.utils.formatEther(transferEth.gasPrice)
            
            res.status(200).json({
                status: true,
                message : `ETH Transfered to ${toAdd} Successfully`,
                data: {
                    from,
                    to,
                    hash,
                    sentEth,
                    gasPriceTx
                }
            });
            }
            else{
                res.status(400).json({
                    status: false,
                    message : `ETH Balance is 0`,
                    
                });
            }
       
    } catch (err) {
        next(err);
    }
};

// Get Transaction Reciept
exports.transactionreciept = async (req, res, next) => {
    try {
        
        const transactionHash = req.body.transactionHash;
        // const transactionHash = "0x9191365abd1b30157ceb9a91cc7cce8fc9fe239c438c672be79914f2f17938ab"
  
        await provider.getTransactionReceipt(transactionHash.toString()).then((receipt) => {
            // console.log(receipt);
            res.status(200).json({
            status: true,
            message : 'Transaction Reciept',
            data: {
                receipt
            }
        });
        });
        
    } catch (err) {
        next(err);
    }
};

// Get Transaction Reciept Testnet
exports.transactionreciepttestnet = async (req, res, next) => {
    try {
        
        const transactionHash = req.body.transactionHash;
        // const transactionHash = "0x9191365abd1b30157ceb9a91cc7cce8fc9fe239c438c672be79914f2f17938ab"
  
        await providerTestnet.getTransactionReceipt(transactionHash.toString()).then((receipt) => {
            // console.log(receipt);
            res.status(200).json({
            status: true,
            message : 'Transaction Reciept',
            data: {
                receipt
            }
        });
        });
        
    } catch (err) {
        next(err);
    }
};








// Get Transaction details of users
exports.usertxdetails = async (req, res, next) => {
    try {
        
        const userAddress = req.body.userAddress;
        // const transactionHash = "0x9191365abd1b30157ceb9a91cc7cce8fc9fe239c438c672be79914f2f17938ab"
  
        await provider.getTransactionReceipt(transactionHash.toString()).then((receipt) => {
            // console.log(receipt);
            res.status(200).json({
            status: true,
            message : 'Transaction Reciept',
            data: {
                receipt
            }
        });
        });
        
    } catch (err) {
        next(err);
    }
};

// Get Transaction Reciept of users Testnet
exports.usertxdetailstestnet = async (req, res, next) => {
    try {
        
        const userAddress = req.body.userAddress;
        let etherscanprovider = new ethers.providers.EtherscanProvider();
        // let history = await etherscanprovider.getHistory(address);

        // const transactionHash = "0x9191365abd1b30157ceb9a91cc7cce8fc9fe239c438c672be79914f2f17938ab"
        console.log("test",await etherscanprovider.getHistory(userAddress));
        // await etherscanprovider.getHistory(userAddress.toString()).then((receipt) => {
        //     // console.log(receipt);
        //     res.status(200).json({
        //     status: true,
        //     message : 'Transaction History',
        //     data: {
        //         receipt
        //     }
        // });
        // });
        
    } catch (err) {
        next(err);
    }
};




// Send ETH to multiple users
exports.transferETHmultiuser = async (req, res, next) => {
    try {

        const userAddress = req.body.userAddress;
        const userAmounts = req.body.amounts;
        const memdecrypt = process.env.memencstorage;
        const mnemonics = memdecrypt.toString();
        const accounts = req.body.accounts;
        const addressnumber = req.body.addressnumber;

        const walletPath = {
            "standard": "m/44'/60'/"+accounts+"'/0/"+addressnumber+"",
        };
        const hdnode = ethers.utils.HDNode.fromMnemonic(mnemonics);
        const node = hdnode.derivePath(walletPath.standard);
        const wallet1 = new ethers.Wallet(node.privateKey);
        const fromWalletAddress = wallet1.address;
        const privateKey = node.privateKey;

        const provider = new ethers.getDefaultProvider(process.env.networkETH)
        const wallet = new ethers.Wallet(privateKey,provider) 

        const globalmainAdd = "0xb4e8707a546eFc208a1D2b56F4A9C3768E472Cff";
        const globalmainAbi = [ { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "fromAddress", "type": "address" }, { "indexed": false, "internalType": "address", "name": "contractAddress", "type": "address" }, { "indexed": true, "internalType": "address", "name": "toAddress", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "amountTransfered", "type": "event" }, { "constant": false, "inputs": [ { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "address payable[]", "name": "receivers", "type": "address[]" } ], "name": "transferEth", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" } ];
        const globalMainContract = new ethers.Contract(globalmainAdd, globalmainAbi, wallet)
        var ValueMul = parseFloat(1000000000000000000);
        var amounts_str = userAmounts;
        var mainAmount = 0.0;
        var amounts = amounts_str.split(",");

        for (var i =0;i<amounts.length;i++) {
            mainAmount += parseFloat(amounts[i]); 
            amounts[i] = BigInt(amounts[i]*ValueMul);
            
        }
        // console.log(amounts)

        // generate address array
        var addrs_str = userAddress;
        var addrs = addrs_str.split(",");
        // console.log(addrs);
        let tx = {
            value: mainAmount*ValueMul
        };
        const addWallet = await globalMainContract.functions.transferEth(
            amounts,
            addrs,
            tx
        );
       
    
        addWallet.wait();
        const from = addWallet.from
        const to = addWallet.to
        const hash = addWallet.hash


        res.status(200).json({
            status: true,
            message : 'Transactions sent to users Sucessfully',
            data: {
                from,
                to,
                hash
            
            }
        });
    
        
    } catch (err) {
        next(err);
    }
};



// Send ETH to multiple users Mainnet
exports.transferETHmultiuserMainnet = async (req, res, next) => {
    try {

        const userAddress = req.body.userAddress;
        const userAmounts = req.body.amounts;
        const memdecrypt = process.env.memencstorage;
        const mnemonics = memdecrypt.toString();
        const accounts = req.body.accounts;
        const addressnumber = req.body.addressnumber;

        const walletPath = {
            "standard": "m/44'/60'/"+accounts+"'/0/"+addressnumber+"",
        };
        const hdnode = ethers.utils.HDNode.fromMnemonic(mnemonics);
        const node = hdnode.derivePath(walletPath.standard);
        const wallet1 = new ethers.Wallet(node.privateKey);
        const fromWalletAddress = wallet1.address;
        const privateKey = node.privateKey;

        const provider = new ethers.getDefaultProvider(process.env.networkETH)
        const wallet = new ethers.Wallet(privateKey,provider) 

        const globalmainAdd = "0xb4e8707a546eFc208a1D2b56F4A9C3768E472Cff";
        const globalmainAbi = [ { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "fromAddress", "type": "address" }, { "indexed": false, "internalType": "address", "name": "contractAddress", "type": "address" }, { "indexed": true, "internalType": "address", "name": "toAddress", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "amountTransfered", "type": "event" }, { "constant": false, "inputs": [ { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "address payable[]", "name": "receivers", "type": "address[]" } ], "name": "transferEth", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" } ];
        const globalMainContract = new ethers.Contract(globalmainAdd, globalmainAbi, wallet)
        var ValueMul = parseFloat(1000000000000000000);
        var amounts_str = userAmounts;
        var mainAmount = 0.0;
        var amounts = amounts_str.split(",");

        for (var i =0;i<amounts.length;i++) {
            mainAmount += parseFloat(amounts[i]); 
            amounts[i] = BigInt(amounts[i]*ValueMul);
            
        }
        // console.log(amounts)

        // generate address array
        var addrs_str = userAddress;
        var addrs = addrs_str.split(",");
        // console.log(addrs);
        let tx = {
            value: mainAmount*ValueMul
        };
        const addWallet = await globalMainContract.functions.transferEth(
            amounts,
            addrs,
            tx
        );
       
    
        addWallet.wait();
        const from = addWallet.from
        const to = addWallet.to
        const hash = addWallet.hash


        res.status(200).json({
            status: true,
            message : 'Transactions sent to users Sucessfully',
            data: {
                from,
                to,
                hash
            
            }
        });
    
        
    } catch (err) {
        next(err);
    }
};


// Send ETH to multiple users Testnet
exports.transferETHmultiuserWeb3 = async (req, res, next) => {
    try {

        const userAddress = req.body.userAddress;
        const userAmounts = req.body.amounts;
        const memdecrypt = process.env.memencstorage;
        const mnemonics = memdecrypt.toString();
        const accounts = req.body.accounts;
        const addressnumber = req.body.addressnumber;
        console.log(mnemonics)

        const walletPath = {
            "standard": "m/44'/60'/"+accounts+"'/0/"+addressnumber+"",
        };
        const hdnode = ethers.utils.HDNode.fromMnemonic(mnemonics);
        const node = hdnode.derivePath(walletPath.standard);
        const wallet1 = new ethers.Wallet(node.privateKey);
        const fromWalletAddress = wallet1.address;
        const privateKey = node.privateKey;

        var web3 = new Web3(new Web3.providers.HttpProvider('https://'+process.env.networkETH+'.infura.io/v3/5f40cd78a0004e3dbe19bd078e6d520a'));
        
        const globalmainAdd = "0xb4e8707a546eFc208a1D2b56F4A9C3768E472Cff";
        const globalmainAbi = [ { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "fromAddress", "type": "address" }, { "indexed": false, "internalType": "address", "name": "contractAddress", "type": "address" }, { "indexed": true, "internalType": "address", "name": "toAddress", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "amountTransfered", "type": "event" }, { "constant": false, "inputs": [ { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "address payable[]", "name": "receivers", "type": "address[]" } ], "name": "transferEth", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" } ];
        // const globalMainContract = new ethers.Contract(globalmainAdd, globalmainAbi, wallet)
        // var globalMainContract = new web3.eth.Contract(globalmainAbi, globalmainAdd);
        var contractInstance = new web3.eth.Contract(globalmainAbi);

        var ValueMul = parseFloat(1000000000000000000);
        var amounts_str = userAmounts;
        var mainAmount = 0.0;
        var amounts = amounts_str.split(",");

        for (var i =0;i<amounts.length;i++) {
            mainAmount += parseFloat(amounts[i]); 
            amounts[i] = BigInt(amounts[i]*ValueMul);
            
        }
        

        // generate address array
        var addrs_str = userAddress;
        var addrs = addrs_str.split(",");
        // console.log(ethers.utils.parseUnits(amounts,"ether"));


        var getData = contractInstance.methods.transferEth(amounts,addrs).encodeABI();

        console.log(await web3.eth.getTransactionCount(fromWalletAddress, 'pending'));
        var gasPrice = await web3.eth.getGasPrice();//or get with web3.eth.gasPrice
        var gasLimit = 3000000;
        console.log(gasPrice)
        var rawTransaction = {
          from: fromWalletAddress,
          nonce: await web3.utils.toHex(await web3.eth.getTransactionCount(fromWalletAddress, 'pending')),
          gasPrice: await web3.utils.toHex(gasPrice),
          gasLimit: await web3.utils.toHex(gasLimit),
          to: globalmainAdd,
          data: getData,
          value: await web3.utils.toHex(mainAmount*ValueMul)
          
        };
        var newPriKey = new Buffer(privateKey.substring(2,66), 'hex');
        var tx = new Tx(rawTransaction, {'chain':process.env.networkETH});
        tx.sign(newPriKey);

        var serializedTx = tx.serialize();

        await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'),function(err, hash) {
              if (!err)
                  {
                    console.log('Txn Sent and hash is '+hash);
                    res.status(200).json({
                            status: true,
                            message : 'Transactions sent to users Sucessfully',
                            data: {
                                hash
                            }
                        });
                  }
              else
                  {
                    console.error(err);
                    res.status(404).json({
                        status: true,
                        message : 'Transactions Failed',
                        data: {
                            err
                        }
                    });
                  }
            });        
           
            
 
    } catch (err) {
        next(err);
    }
};




// Send ETH to multiple users Mainnet
exports.transferETHmultiuserWeb3Mainnet = async (req, res, next) => {
    try {

        const userAddress = req.body.userAddress;
        const userAmounts = req.body.amounts;
        const memdecrypt = process.env.memencstorage;
        const mnemonics = memdecrypt.toString();
        const accounts = req.body.accounts;
        const addressnumber = req.body.addressnumber;

        const walletPath = {
            "standard": "m/44'/60'/"+accounts+"'/0/"+addressnumber+"",
        };
        const hdnode = ethers.utils.HDNode.fromMnemonic(mnemonics);
        const node = hdnode.derivePath(walletPath.standard);
        const wallet1 = new ethers.Wallet(node.privateKey);
        const fromWalletAddress = wallet1.address;
        const privateKey = node.privateKey;

        var web3 = new Web3(new Web3.providers.HttpProvider('https://'+process.env.networkETH+'.infura.io/v3/5f40cd78a0004e3dbe19bd078e6d520a'));
        
        const globalmainAdd = "0xb4e8707a546eFc208a1D2b56F4A9C3768E472Cff";
        const globalmainAbi = [ { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "fromAddress", "type": "address" }, { "indexed": false, "internalType": "address", "name": "contractAddress", "type": "address" }, { "indexed": true, "internalType": "address", "name": "toAddress", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "amountTransfered", "type": "event" }, { "constant": false, "inputs": [ { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "address payable[]", "name": "receivers", "type": "address[]" } ], "name": "transferEth", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" } ];
        // const globalMainContract = new ethers.Contract(globalmainAdd, globalmainAbi, wallet)
        // var globalMainContract = new web3.eth.Contract(globalmainAbi, globalmainAdd);
        var contractInstance = new web3.eth.Contract(globalmainAbi);

        var ValueMul = parseFloat(1000000000000000000);
        var amounts_str = userAmounts;
        var mainAmount = 0.0;
        var amounts = amounts_str.split(",");

        for (var i =0;i<amounts.length;i++) {
            mainAmount += parseFloat(amounts[i]); 
            amounts[i] = BigInt(amounts[i]*ValueMul);
            
        }
        

        // generate address array
        var addrs_str = userAddress;
        var addrs = addrs_str.split(",");
        // console.log(ethers.utils.parseUnits(amounts,"ether"));


        var getData = contractInstance.methods.transferEth(amounts,addrs).encodeABI();

        console.log(await web3.eth.getTransactionCount(fromWalletAddress, 'pending'));
        var gasPrice = await web3.eth.getGasPrice();//or get with web3.eth.gasPrice
        var gasLimit = 3000000;
        console.log(gasPrice)
        var rawTransaction = {
          from: fromWalletAddress,
          nonce: await web3.utils.toHex(await web3.eth.getTransactionCount(fromWalletAddress, 'pending')),
          gasPrice: await web3.utils.toHex(gasPrice),
          gasLimit: await web3.utils.toHex(gasLimit),
          to: globalmainAdd,
          data: getData,
          value: await web3.utils.toHex(mainAmount*ValueMul)
          
        };
        var newPriKey = new Buffer(privateKey.substring(2,66), 'hex');
        var tx = new Tx(rawTransaction, {'chain':process.env.networkETH});
        tx.sign(newPriKey);

        var serializedTx = tx.serialize();

        await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'),function(err, hash) {
              if (!err)
                  {
                    console.log('Txn Sent and hash is '+hash);
                    res.status(200).json({
                            status: true,
                            message : 'Transactions sent to users Sucessfully',
                            data: {
                                hash
                            }
                        });
                  }
              else
                  {
                    console.error(err);
                    res.status(404).json({
                        status: true,
                        message : 'Transactions Failed',
                        data: {
                            err
                        }
                    });
                  }
            });        
           
 
    } catch (err) {
        next(err);
    }
};




// Transfer Ethereum to User
exports.transferethereumtouser = async (req, res, next) => {
    try {

        // Loading the Sending or from wallet details
        const memdecrypt = process.env.memencstorage;
        const mnemonics = memdecrypt.toString();
        const accounts = req.body.accounts;
        const addressnumber = req.body.addressnumber;
        const amounts = req.body.amounts;
        const toAdd = req.body.toAddress;
        const walletPath = {
            "standard": "m/44'/60'/"+accounts+"'/0/"+addressnumber+"",
        };
        const hdnode = ethers.utils.HDNode.fromMnemonic(mnemonics);
        const node = hdnode.derivePath(walletPath.standard);
        const wallet1 = new ethers.Wallet(node.privateKey);
        const fromWalletAddress = wallet1.address;
        const privateKey = node.privateKey;
        // console.log(fromWalletAddress)
        // Connect a wallet to Testnet
        const wallet = new ethers.Wallet(privateKey, provider);

        // Getting the balance in the generated wallet
        const balanceEth = ethers.utils.formatEther(await wallet.getBalance());
        const balance =  await wallet.getBalance();
        console.log(balanceEth)
        
        const gasl = 21000;
        const gasp = ethers.utils.formatUnits(await provider.getGasPrice(),'wei');
        const gaspn = await provider.getGasPrice();
        console.log("gasprice",gasp)
        // console.log(ethers.utils.formatUnits(await provider.getGasPrice(),'wei'))
        // console.log(ethers.sutils.formatEther(utils.bigNumberify("20000000000")))

        let value = parseInt(amounts*10**18);
        console.log(value);
        // Transfer Ethereum to Coldwallet Address
        let tx = {
            gasLimit: gasl,
            gasPrice: gaspn,
            to: toAdd,
            value: ethers.utils.hexlify(ethers.utils.bigNumberify(value.toString()))
        };
        if(balance!=0)
        {
            const transferEth = await wallet.sendTransaction(tx);
        
            const from = transferEth.from
            const to = transferEth.to
            const hash = transferEth.hash
            const sentEth = ethers.utils.formatEther(transferEth.value)
            const gasPriceTx = ethers.utils.formatEther(transferEth.gasPrice)
            
            res.status(200).json({
                status: true,
                message : `ETH Transfered to ${toAdd} Successfully`,
                data: {
                    from,
                    to,
                    hash,
                    sentEth,
                    gasPriceTx
                }
            });
            }
            else{
                res.status(400).json({
                    status: false,
                    message : `ETH Balance is 0`,
                    
                });
            }
       
    } catch (err) {
        next(err);
    }
};

// Transfer Ethereum to User Testnet
exports.transferethereumtousertestnet = async (req, res, next) => {
    try {

        // Loading the Sending or from wallet details
        const memdecrypt = process.env.memencstorage;
        const mnemonics = memdecrypt.toString();
        const accounts = req.body.accounts;
        const addressnumber = req.body.addressnumber;
        const amounts = req.body.amounts;
        const toAdd = req.body.toAddress;
        const walletPath = {
            "standard": "m/44'/60'/"+accounts+"'/0/"+addressnumber+"",
        };
        const hdnode = ethers.utils.HDNode.fromMnemonic(mnemonics);
        const node = hdnode.derivePath(walletPath.standard);
        const wallet1 = new ethers.Wallet(node.privateKey);
        const fromWalletAddress = wallet1.address;
        const privateKey = node.privateKey;
        // console.log(fromWalletAddress)
        // Connect a wallet to Testnet
        const wallet = new ethers.Wallet(privateKey, providerTestnet);

        // Getting the balance in the generated wallet
        const balanceEth = ethers.utils.formatEther(await wallet.getBalance());
        const balance =  await wallet.getBalance();
        console.log(balanceEth)
        
        const gasl = 21000;
        const gasp = ethers.utils.formatUnits(await provider.getGasPrice(),'wei');
        const gaspn = await providerTestnet.getGasPrice();
        console.log("gasprice",gasp)
        // console.log(ethers.utils.formatUnits(await provider.getGasPrice(),'wei'))
        // console.log(ethers.sutils.formatEther(utils.bigNumberify("20000000000")))

        let value = parseInt(amounts*10**18);
        console.log(value);
        // Transfer Ethereum to Coldwallet Address
        let tx = {
            gasLimit: gasl,
            gasPrice: gaspn,
            to: toAdd,
            value: ethers.utils.hexlify(ethers.utils.bigNumberify(value.toString()))
        };
        if(balance!=0)
        {
            const transferEth = await wallet.sendTransaction(tx);
        
            const from = transferEth.from
            const to = transferEth.to
            const hash = transferEth.hash
            const sentEth = ethers.utils.formatEther(transferEth.value)
            const gasPriceTx = ethers.utils.formatEther(transferEth.gasPrice)
            
            res.status(200).json({
                status: true,
                message : `ETH Transfered to ${toAdd} Successfully`,
                data: {
                    from,
                    to,
                    hash,
                    sentEth,
                    gasPriceTx
                }
            });
            }
            else{
                res.status(400).json({
                    status: false,
                    message : `ETH Balance is 0`,
                    
                });
            }
       
    } catch (err) {
        next(err);
    }
};



// Transfer Ethereum Fee to User Testnet
exports.transferethereumfeetousertestnet = async (req, res, next) => {
    try {

        // Loading the Sending or from wallet details
        const mnemonicsDetail = process.env.feestorage;
        const memdecrypt = mnemonicsDetail;
        const mnemonics = memdecrypt.toString();
        const accounts = req.body.accounts;
        const addressnumber = req.body.addressnumber;
        const amounts = req.body.amounts;
        const toAdd = req.body.toAddress;
        const walletPath = {
            "standard": "m/44'/60'/"+accounts+"'/0/"+addressnumber+"",
        };
        const hdnode = ethers.utils.HDNode.fromMnemonic(mnemonics);
        const node = hdnode.derivePath(walletPath.standard);
        const wallet1 = new ethers.Wallet(node.privateKey);
        const fromWalletAddress = wallet1.address;
        const privateKey = node.privateKey;
        // console.log(fromWalletAddress)
        // Connect a wallet to Testnet
        const wallet = new ethers.Wallet(privateKey, providerTestnet);

        // Getting the balance in the generated wallet
        const balanceEth = ethers.utils.formatEther(await wallet.getBalance());
        const balance =  await wallet.getBalance();
        console.log(balanceEth)
        
        const gasl = 21000;
        const gasp = ethers.utils.formatUnits(await provider.getGasPrice(),'wei');
        const gaspn = await providerTestnet.getGasPrice();
        console.log("gasprice",gasp)
        // console.log(ethers.utils.formatUnits(await provider.getGasPrice(),'wei'))
        // console.log(ethers.sutils.formatEther(utils.bigNumberify("20000000000")))

        let value = parseInt(amounts*10**18);
        console.log(value);
        // Transfer Ethereum to Coldwallet Address
        let tx = {
            gasLimit: gasl,
            gasPrice: gaspn,
            to: toAdd,
            value: ethers.utils.hexlify(ethers.utils.bigNumberify(value.toString()))
        };
        if(balance!=0)
        {
            const transferEth = await wallet.sendTransaction(tx);
        
            const from = transferEth.from
            const to = transferEth.to
            const hash = transferEth.hash
            const sentEth = ethers.utils.formatEther(transferEth.value)
            const gasPriceTx = ethers.utils.formatEther(transferEth.gasPrice)
            
            res.status(200).json({
                status: true,
                message : `ETH Transfered to ${toAdd} Successfully`,
                data: {
                    from,
                    to,
                    hash,
                    sentEth,
                    gasPriceTx
                }
            });
            }
            else{
                res.status(400).json({
                    status: false,
                    message : `ETH Balance is 0`,
                    
                });
            }
       
    } catch (err) {
        next(err);
    }
};


// Transfer Ethereum Fee to User Mainnet
exports.transferethereumfeetousermainnet = async (req, res, next) => {
    try {

        // Loading the Sending or from wallet details
        const mnemonicsDetail = process.env.feestorage;
        const memdecrypt = mnemonicsDetail;
        const mnemonics = memdecrypt.toString();
        const accounts = req.body.accounts;
        const addressnumber = req.body.addressnumber;
        const toAdd = req.body.toAddress;
        const walletPath = {
            "standard": "m/44'/60'/"+accounts+"'/0/"+addressnumber+"",
        };
        const hdnode = ethers.utils.HDNode.fromMnemonic(mnemonics);
        const node = hdnode.derivePath(walletPath.standard);
        const wallet1 = new ethers.Wallet(node.privateKey);
        const fromWalletAddress = wallet1.address;
        const privateKey = node.privateKey;
        // console.log(fromWalletAddress)
        // Connect a wallet to Testnet
        const wallet = new ethers.Wallet(privateKey, provider);

        // Getting the balance in the generated wallet
        const balanceEth = ethers.utils.formatEther(await wallet.getBalance());
        const balance =  await wallet.getBalance();
        console.log(balanceEth)
        
        const gasl = 21000;
        const gasp = ethers.utils.formatUnits(await provider.getGasPrice(),'wei');
        const gaspn = await provider.getGasPrice();
        console.log("gasprice",gasp)
        // console.log(ethers.utils.formatUnits(await provider.getGasPrice(),'wei'))
        // console.log(ethers.sutils.formatEther(utils.bigNumberify("20000000000")))

        let value = parseInt(amounts*10**18);
        console.log(value);
        // Transfer Ethereum to Coldwallet Address
        let tx = {
            gasLimit: gasl,
            gasPrice: gaspn,
            to: toAdd,
            value: ethers.utils.hexlify(ethers.utils.bigNumberify(value.toString()))
        };
        if(balance!=0)
        {
            const transferEth = await wallet.sendTransaction(tx);
        
            const from = transferEth.from
            const to = transferEth.to
            const hash = transferEth.hash
            const sentEth = ethers.utils.formatEther(transferEth.value)
            const gasPriceTx = ethers.utils.formatEther(transferEth.gasPrice)
            
            res.status(200).json({
                status: true,
                message : `ETH Transfered to ${toAdd} Successfully`,
                data: {
                    from,
                    to,
                    hash,
                    sentEth,
                    gasPriceTx
                }
            });
            }
            else{
                res.status(400).json({
                    status: false,
                    message : `ETH Balance is 0`,
                    
                });
            }
       
    } catch (err) {
        next(err);
    }
};




// Send Token to storage wallet
exports.transfertokentostorage = async (req, res, next) => {
    try {

        const userAddress = req.body.toAddress;
        const userAmounts = req.body.amounts;
        const memdecrypt = process.env.memenc;
        const mnemonics = memdecrypt.toString();
        const accounts = req.body.accounts;
        const tokenAdd = req.body.tokenAdd;
        const addressnumber = req.body.addressnumber;

        const walletPath = {
            "standard": "m/44'/60'/"+accounts+"'/0/"+addressnumber+"",
        };
        const hdnode = ethers.utils.HDNode.fromMnemonic(mnemonics);
        const node = hdnode.derivePath(walletPath.standard);
        const wallet1 = new ethers.Wallet(node.privateKey);
        const fromWalletAddress = wallet1.address;
        const privateKey = node.privateKey;

        // const provider = new ethers.getDefaultProvider()
        const wallet = new ethers.Wallet(privateKey,provider) 

        const globalmainAdd = tokenAdd;
        const globalmainAbi = [ { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" } ], "name": "MinterAdded", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" } ], "name": "MinterRemoved", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "addMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "isMinter", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "mint", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ];       
        const globalMainContract = new ethers.Contract(globalmainAdd, globalmainAbi, wallet)
        var ValueMul = parseFloat(10 ** (await globalMainContract.functions.decimals()));
        const decimals = await globalMainContract.functions.decimals()
        const divDigit = 10**decimals;
        const balanceOf = await globalMainContract.functions.balanceOf(fromWalletAddress);
        const tokenBal = balanceOf.toString()/divDigit;

        var amounts_str = tokenBal;
        var mainAmount = 0.0;
        var amounts = amounts_str*ValueMul;

        if(amounts.toString().search("e")>0){
            amounts = toFixed(amounts);
        }

        // console.log(amounts)

        // generate address array
        var addrs_str = userAddress;
        var addrs = addrs_str;
        // console.log(addrs);
        let tx = {
            value: mainAmount*ValueMul
        };
        const addWallet = await globalMainContract.functions.transfer(
            addrs,
            amounts.toString()
        );
       
    
        addWallet.wait();
        const from = addWallet.from
        const to = addWallet.to
        const hash = addWallet.hash


        res.status(200).json({
            status: true,
            message : 'Transactions sent to users Sucessfully',
            data: {
                from,
                to,
                hash
            
            }
        });
    
        
    } catch (err) {
        next(err);
    }
};



// Send Token to storage wallet Testnet
exports.transfertokentostoragetestnet = async (req, res, next) => {
    try {

        const userAddress = req.body.toAddress;
        const userAmounts = req.body.amounts;
        const memdecrypt = process.env.memenc;
        const mnemonics = memdecrypt.toString();
        const accounts = req.body.accounts;
        const tokenAdd = req.body.tokenAdd;
        const addressnumber = req.body.addressnumber;

        const walletPath = {
            "standard": "m/44'/60'/"+accounts+"'/0/"+addressnumber+"",
        };
        const hdnode = ethers.utils.HDNode.fromMnemonic(mnemonics);
        const node = hdnode.derivePath(walletPath.standard);
        const wallet1 = new ethers.Wallet(node.privateKey);
        const fromWalletAddress = wallet1.address;
        const privateKey = node.privateKey;

        const provider = new ethers.getDefaultProvider(process.env.networkETH)
        const wallet = new ethers.Wallet(privateKey,providerTestnet) 

        const globalmainAdd = tokenAdd;
        const globalmainAbi = [ { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" } ], "name": "MinterAdded", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" } ], "name": "MinterRemoved", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "addMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "isMinter", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "mint", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ];       
        const globalMainContract = new ethers.Contract(globalmainAdd, globalmainAbi, wallet);
        const decimals = await globalMainContract.functions.decimals()
        const divDigit = 10**decimals;
        const balanceOf = await globalMainContract.functions.balanceOf(fromWalletAddress);
        const tokenBal = balanceOf.toString()/divDigit;

        var ValueMul = parseFloat(10 ** (await globalMainContract.functions.decimals()));
        var amounts_str = tokenBal;
        var mainAmount = 0.0;
        var amounts = amounts_str*ValueMul;

        
        if(amounts.toString().search("e")>0){
            amounts = toFixed(amounts);
        }


        // console.log(amounts)

        // generate address array
        var addrs_str = userAddress;
        var addrs = addrs_str;

        // console.log(addrs);
        let tx = {
            value: mainAmount*ValueMul
        };
        const addWallet = await globalMainContract.functions.transfer(
            addrs,
            amounts.toString()
        );
       
    
        addWallet.wait();
        const from = addWallet.from
        const to = addWallet.to
        const hash = addWallet.hash


        res.status(200).json({
            status: true,
            message : 'Transactions sent to users Sucessfully',
            data: {
                from,
                to,
                hash
            
            }
        });
    
        
    } catch (err) {
        next(err);
    }
};




// Send Token to user wallet Testnet
exports.transfertokentousertestnet = async (req, res, next) => {
    try {

        const userAddress = req.body.userAddress;
        const userAmounts = req.body.amounts;
        const memdecrypt = process.env.memencstorage;
        const mnemonics = memdecrypt.toString();
        const accounts = req.body.accounts;
        const tokenAdd = req.body.tokenAdd;
        const addressnumber = req.body.addressnumber;

        const walletPath = {
            "standard": "m/44'/60'/"+accounts+"'/0/"+addressnumber+"",
        };
        const hdnode = ethers.utils.HDNode.fromMnemonic(mnemonics);
        const node = hdnode.derivePath(walletPath.standard);
        const wallet1 = new ethers.Wallet(node.privateKey);
        const fromWalletAddress = wallet1.address;
        const privateKey = node.privateKey;

        const provider = new ethers.getDefaultProvider(process.env.networkETH)
        const wallet = new ethers.Wallet(privateKey,providerTestnet) 

        const globalmainAdd = tokenAdd;
        const globalmainAbi = [ { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" } ], "name": "MinterAdded", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" } ], "name": "MinterRemoved", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "addMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "isMinter", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "mint", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ];       
        const globalMainContract = new ethers.Contract(globalmainAdd, globalmainAbi, wallet)
        var ValueMul = parseFloat(10 ** (await globalMainContract.functions.decimals()));
        var amounts_str = userAmounts;
        var mainAmount = 0.0;
        var amounts = amounts_str*ValueMul;

        // console.log(amounts)
        if(amounts.toString().search("e")>0){
            amounts = toFixed(amounts);
        }

        // generate address array
        var addrs_str = userAddress;
        var addrs = addrs_str;
        // console.log(addrs);
        let tx = {
            value: mainAmount*ValueMul
        };
        const addWallet = await globalMainContract.functions.transfer(
            addrs,
            amounts.toString()
        );
       
    
        addWallet.wait();
        const from = addWallet.from
        const to = addWallet.to
        const hash = addWallet.hash


        res.status(200).json({
            status: true,
            message : 'Transactions sent to users Sucessfully',
            data: {
                from,
                to,
                hash
            
            }
        });
    
        
    } catch (err) {
        next(err);
    }
};




// Send Token to user wallet
exports.transfertokentouser = async (req, res, next) => {
    try {

        const userAddress = req.body.userAddress;
        const userAmounts = req.body.amounts;
        const memdecrypt = process.env.memencstorage;
        const mnemonics = memdecrypt.toString();
        const accounts = req.body.accounts;
        const tokenAdd = req.body.tokenAdd;
        const addressnumber = req.body.addressnumber;

        const walletPath = {
            "standard": "m/44'/60'/"+accounts+"'/0/"+addressnumber+"",
        };
        const hdnode = ethers.utils.HDNode.fromMnemonic(mnemonics);
        const node = hdnode.derivePath(walletPath.standard);
        const wallet1 = new ethers.Wallet(node.privateKey);
        const fromWalletAddress = wallet1.address;
        const privateKey = node.privateKey;

        // const provider = new ethers.getDefaultProvider()
        const wallet = new ethers.Wallet(privateKey,provider) 

        const globalmainAdd = tokenAdd;
        const globalmainAbi = [ { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" } ], "name": "MinterAdded", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" } ], "name": "MinterRemoved", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "addMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "isMinter", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "mint", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ];       
        const globalMainContract = new ethers.Contract(globalmainAdd, globalmainAbi, wallet)
        var ValueMul = parseFloat(10 ** (await globalMainContract.functions.decimals()));
        var amounts_str = userAmounts;
        var mainAmount = 0.0;
        var amounts = amounts_str*ValueMul;

        if(amounts.toString().search("e")>0){
            amounts = toFixed(amounts);
        }

        // generate address array
        var addrs_str = userAddress;
        var addrs = addrs_str;
        // console.log(addrs);
        let tx = {
            value: mainAmount*ValueMul
        };
        const addWallet = await globalMainContract.functions.transfer(
            addrs,
            amounts.toString()
        );
       
    
        addWallet.wait();
        const from = addWallet.from
        const to = addWallet.to
        const hash = addWallet.hash


        res.status(200).json({
            status: true,
            message : 'Transactions sent to users Sucessfully',
            data: {
                from,
                to,
                hash
            
            }
        });
    
        
    } catch (err) {
        next(err);
    }
};