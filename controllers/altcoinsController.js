const bitcoin = require('bitgo-utxo-lib')
const bitcoinlib = require('bitcoinjs-lib')
const bip39 = require('bip39')
const bip32 = require('bip32')
const axios = require('axios')
const bch = require('bitcore-lib-cash')

exports.altcoinswalletdetails = async (req, res, next) => {
    try {
        const mnemonics = req.body.mnemonics;
        const accounts = req.body.accounts;
        const addressnumber = req.body.addressnumber;
        const seed = await bip39.mnemonicToSeed(mnemonics)

        // LiteCoin (LTC) Configuration
        const networkLTC = bitcoin.networks.litecoin;
        const rootLTC = bitcoin.HDNode.fromSeedHex(seed,networkLTC)
        const childLTC = rootLTC.derivePath("m/44'/2'/"+accounts+"'/0/"+addressnumber+"")
        const publicAddressLTC = childLTC.getAddress();
        const privateKeyLTC = childLTC.keyPair.toWIF();

        // Bitcoin Cash (BCH) Configuration
        const networkBCH = bitcoin.networks.bitcoincash;
        const rootBCH = bitcoin.HDNode.fromSeedHex(seed,networkBCH)
        const childBCH = rootBCH.derivePath("m/44'/145'/"+accounts+"'/0/"+addressnumber+"")
        const publicAddressBCH = childBCH.getAddress();
        const privateKeyBCH = childBCH.keyPair.toWIF();
        const BCHAddress = new bch.PrivateKey(privateKeyBCH).toAddress();
        const CashAddress = await BCHAddress.toCashAddress();

        // Bitcoin Gold (BTG) Configuration
        const networkBTG = bitcoin.networks.bitcoingold;
        const rootBTG = bitcoin.HDNode.fromSeedHex(seed,networkBTG)
        const childBTG = rootBTG.derivePath("m/44'/156'/"+accounts+"'/0/"+addressnumber+"")
        const publicAddressBTG = childBTG.getAddress();
        const privateKeyBTG = childBTG.keyPair.toWIF();

        // Bitcoin SV (BSV) Configuration
        const networkBSV = bitcoin.networks.bitcoinsv;
        const rootBSV = bitcoin.HDNode.fromSeedHex(seed,networkBSV)
        const childBSV = rootBSV.derivePath("m/44'/236'/"+accounts+"'/0/"+addressnumber+"")
        const publicAddressBSV = childBSV.getAddress();
        const privateKeyBSV = childBSV.keyPair.toWIF();

        // Dash (Dash) Configuration
        const networkDash = bitcoin.networks.dash;
        const rootDash = bitcoin.HDNode.fromSeedHex(seed,networkDash)
        const childDash = rootDash.derivePath("m/44'/5'/"+accounts+"'/0/"+addressnumber+"")
        const publicAddressDash = childDash.getAddress();
        const privateKeyDash = childDash.keyPair.toWIF();

         // Zcash (ZEC) Configuration
         const networkZEC = bitcoin.networks.zcash;
         const rootZEC = bitcoin.HDNode.fromSeedHex(seed,networkZEC)
         const childZEC = rootZEC.derivePath("m/44'/133'/"+accounts+"'/0/"+addressnumber+"")
         const publicAddressZEC = childZEC.getAddress();
         const privateKeyZEC = childZEC.keyPair.toWIF();


        res.status(200).json({
            status: true,
            message : 'UTXO Altcoins Address And Private Key of entered Mnemonics',
            data: {
                Litecoin: {
                    publicAddress: publicAddressLTC,
                    privateKey: privateKeyLTC
                },
                BitcoinCash: {
                    publicAddress: CashAddress,
                    privateKey: privateKeyBCH
                },
                BitcoinGold: {
                    publicAddress: publicAddressBTG,
                    privateKey: privateKeyBTG
                },
                BitcoinSV: {
                    publicAddress: publicAddressBSV,
                    privateKey: privateKeyBSV
                },
                Dash: {
                    publicAddress: publicAddressDash,
                    privateKey: privateKeyDash
                },
                Zcash: {
                    publicAddress: publicAddressZEC,
                    privateKey: privateKeyZEC
                }
                
            }
        });

    } catch (err) {
        next(err);
    }
};

exports.ltcbalance = async (req, res, next) => {
    try {
        const address = req.body.address;

        await axios.get('https://chainz.cryptoid.info/ltc/api.dws?q=getbalance&a='+address).then((response) => {
            const LTCbalance = response.data
            res.status(200).json({
                status: true,
                message : 'Litecoin Address Balance Details',
                data: {
                    LTCaddress : address,
                    LTCbalance
                }
            });
        });        
    } catch (err) {
        next(err);
    }
};

exports.bchbalance = async (req, res, next) => {
    try {
        const address = req.body.address;

        await axios.get('https://chainz.cryptoid.info/ltc/api.dws?q=getbalance&a='+address).then((response) => {
            const LTCbalance = response.data
            res.status(200).json({
                status: true,
                message : 'Litecoin Address Balance Details',
                data: {
                    LTCaddress : address,
                    LTCbalance
                }
            });
        });        
    } catch (err) {
        next(err);
    }
};