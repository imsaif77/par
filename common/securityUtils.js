var eccrypto = require("eccrypto");
const express = require('express');
const router = express.Router();
const BJSON = require('buffer-json')

exports.generateencryption = async (req, res, next) => {

    try {
        const text = req.body.text;
        var privateKeyB = eccrypto.generatePrivate();
        var publicKeyB = eccrypto.getPublic(privateKeyB);
        
        eccrypto.encrypt(publicKeyB, Buffer.from(text)).then(function(encrypted) {
            const encryptedText = encrypted;

            // console.log('PrivateKey',JSON.stringify(privateKeyB))
            // console.log('EncryptedString',JSON.stringify(encryptedText))

            // read json string to Buffer
            const pribuf = BJSON.parse(JSON.stringify(privateKeyB)); 
            const encbuf = BJSON.parse(JSON.stringify(encryptedText)); 
            const pubbuf = BJSON.parse(JSON.stringify(publicKeyB)); 

            res.status(200).json({
                status: true,
                message : 'Encrypted ECC Data',
                data: {
                    privateKeyBuffer: pribuf,
                    publicKeyBuffer: pubbuf,
                    encryptedTextBuffer: encbuf,
                }
            });
          });
        
    } catch (err) {
        next(err);
    }

}


exports.eccdecryption = async (req, res, next) => {

    try {
        const memprivkey =  process.env.mempriv;
        const memenckey =  process.env.memenc;

        // console.log(process.env.mempriv)
        // console.log(process.env.memenc)

        // // read json string to Buffer
        const pribuf =  BJSON.parse(memprivkey); 
        const encbuf =  BJSON.parse(memenckey);

        // console.log('private',pribuf)
        // console.log('encrypt',encbuf)

        eccrypto.decrypt(pribuf, encbuf).then(function(plaintext) {
            const decryptedText = plaintext.toString();            
            res.json({decryptedText})
            // console.log(decryptedText)
            // return decryptedText
            // res.status(200).json({
            //     status: true,
            //     message : 'Decrypted ECC Data',
            //     data: {
            //         decryptedText: decryptedText,
            //     }
            // });
        });
    
    } catch (err) {
        next(err);
    }
}








