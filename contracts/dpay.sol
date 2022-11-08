//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


contract Dpay{

    AggregatorV3Interface internal priceFeed;

    constructor(address _pricefeed){
        priceFeed = AggregatorV3Interface(_pricefeed);
    }
    function transfer(address _to) public payable returns (bool) {
        require(_to != address(0), "ERC20: transfer to the zero address");
        require(msg.sender.balance >= msg.value, "insufficient funds");
        payable(_to).transfer(msg.value);
        return true;
    }

    function getLatestPrice() public view returns (int) {
        (,int price,,,) = priceFeed.latestRoundData();
        return price;
    }

    function getUsdPrice(int _amount) public view returns (int){
        return _amount * getLatestPrice();
    }

    }