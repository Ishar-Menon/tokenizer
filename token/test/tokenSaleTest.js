var zorToken = artifacts.require('zorToken.sol');
var tokenSale = artifacts.require('tokenSale.sol');

contract('tokenSale', function (accounts) {
  var tokenPrice = 1000000000000000; // 0.001 Ether
  var admin = accounts[0];
  var buyer = accounts[1];
  var tokensAvailable = 750000;

  it('initializes the contract with the correct values', async function () {
    var tokenSaleInstance = await tokenSale.deployed();

    // testing if the contract exists
    var address = await tokenSaleInstance.address;
    assert.notEqual(address, '0x0', 'has contract address');

    // testing if the token contract function is working
    var tokenContractAddress = await tokenSaleInstance.tokenContract();
    assert.notEqual(address, '0x0', 'has token contract address');

    // testing the token price
    var price = await tokenSaleInstance.tokenPrice();
    assert.equal(price, tokenPrice, 'token price is correct');
  });

  it('facilitates buting tokens', async function () {
    var tokenInstance = await zorToken.deployed();
    var tokenSaleInstance = await tokenSale.deployed();

    // provision tokens to token sale
    var tokenSaleAddress = await tokenSaleInstance.address;
    await tokenInstance.transfer(tokenSaleAddress, tokensAvailable, {
      from: admin,
    });

    var numberOfTokens = 10;
    var value = numberOfTokens * tokenPrice;

    // testing that the Sell event has been emitted
    var receipt = await tokenSaleInstance.buyTokens(numberOfTokens, {
      from: buyer,
      value: value,
    });
    assert.equal(receipt.logs.length, 1, 'triggers one event');
    assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
    assert.equal(
      receipt.logs[0].args._buyer,
      buyer,
      'logs the account that purchased the token'
    );
    assert.equal(
      receipt.logs[0].args._amount,
      numberOfTokens,
      'logs the amount of tokens purchased'
    );

    // testing the tokensSold function
    var tokensSold = await tokenSaleInstance.tokensSold();
    assert.equal(
      tokensSold.toNumber(),
      numberOfTokens,
      'increments the number of tokens sold'
    );

    // testing the balance of the buyer and the token sale contract
    var buyerBalance = await tokenInstance.balanceOf(buyer);
    assert.equal(
      buyerBalance.toNumber(),
      numberOfTokens,
      'increments tokens for the buyer'
    );
    var tokenSaleBalance = await tokenInstance.balanceOf(tokenSaleAddress);
    assert.equal(
      tokenSaleBalance.toNumber(),
      tokensAvailable - numberOfTokens,
      'deducts tokens from the token sale contract'
    );

    // testing that the value is equal to the number of tokens
    try {
      assert.fail(
        await tokenSaleInstance.buyTokens(numberOfTokens, {
          from: buyer,
          value: 1,
        })
      );
    } catch (error) {
      assert(
        error.message.indexOf('revert') >= 0,
        'msg.value must equal number of tokens in wei'
      );
    }

    // testing for buying tokens more than that provisioned to the crowd sale
    try {
      assert.fail(
        await tokenSaleInstance.buyTokens(800000, { from: buyer, value: value })
      );
    } catch (error) {
      assert(
        error.message.indexOf('revert') >= 0,
        'cannot buy more tokens than provisioned'
      );
    }
  });

  it('ends token sale', async function () {
    var tokenInstance = await zorToken.deployed();
    var tokenSaleInstance = await tokenSale.deployed();

    // testing for endSale from invalid admin
    try {
      assert.fail(await tokenSaleInstance.endSale({ from: buyer }));
    } catch (error) {
      assert(error.message.indexOf('revert') >= 0, 'must be admin to end sale');
    }

    // testing to end sale from valid admin
    await tokenSaleInstance.endSale({ from: admin });
    var balance = await tokenInstance.balanceOf(admin);
    assert.equal(
      balance.toNumber(),
      999990,
      'returns all unsold tokens to admin'
    );
  });
});
