const dotenv = require('dotenv');
dotenv.config();

dotenv.config({
  path: './config.env'
});

module.exports = {
  port : process.env.PORT,

  ercAbi : process.env.erctoken_abi,
  networkETH : process.env.networkETH,
  mnemonics : process.env.mnemonic,
  coldAddress : process.env.coldAddress,
  'secret': 'supersecret'

};
