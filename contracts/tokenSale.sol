pragma solidity ^0.5.0;

import "./zorToken.sol";

contract tokenSale {
    address payable admin;
    zorToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address _buyer, uint256 _amount);

    constructor(zorToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function multiply(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        // Amount send should be correct
        require(
            msg.value == multiply(_numberOfTokens, tokenPrice),
            "Please provide current amount of ether"
        );

        // number of tokens available should be more than _numberOfTokens
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);

        // Token transfer should be successful
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        tokensSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);

    }

    function endSale() public {
        require(msg.sender == admin);
        require(
            tokenContract.transfer(
                admin,
                tokenContract.balanceOf(address(this))
            )
        );
        admin.transfer(address(this).balance);
    }

}
