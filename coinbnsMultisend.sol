pragma solidity >=0.4.23 <0.6.0;


contract CoinBNS_MultiSend {
   
    event amountTransfered(address indexed fromAddress,address contractAddress,address indexed toAddress, uint256 indexed amount);
    
    function transferEth(uint256[] memory amounts, address payable[] memory receivers) payable public {
    assert(amounts.length == receivers.length);
    assert(receivers.length <= 100); //maximum receievers can be 100
    for(uint i = 0; i< receivers.length; i++){
            receivers[i].transfer(amounts[i]);
            emit amountTransfered(msg.sender,address(this) ,receivers[i],amounts[i]);
        }
    }
} 

0xb4e8707a546eFc208a1D2b56F4A9C3768E472Cff