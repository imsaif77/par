const ethers = require('ethers')
const bitcoin = require('bitgo-utxo-lib')
const bip39 = require('bip39')
// const bitcoin = require('bitcoinjs-lib')



exports.generatemnemonics = async (req, res, next) => {
    try {
        let mnemonics = ethers.Wallet.createRandom().mnemonic;
        res.status(200).json({
            status: true,
            message : 'Your New Mnemonics is : '+mnemonics,
            data: {
                mnemonics
            }
        });

    } catch (err) {
        next(err);
    }
};



exports.converthex = async (req, res, next) => {
    try {
        const mnemonic = 'elegant milk put nurse nature crew afford grain unlock hawk distance say'
        const seed = await bip39.mnemonicToSeedSync(mnemonic).toString('hex')
        const node = bitcoin.HDNode.fromSeedHex(seed)
        const child = node.derivePath("m/44'/0'/0'/0/0")
        const publicAddress = child.getAddress();
        const privateKey = child.keyPair.toWIF();
    
        res.status(200).json({
            status: true,
            message : 'Address And Key',
            data: {
                seed,
                publicAddress,
                privateKey
            }
        });

    } catch (err) {
        next(err);
    }
};
