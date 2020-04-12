var zorToken = artifacts.require('./zorToken.sol');

contract('zorToken', function (accounts) {
  it('initializes the contract with the correct values', async function () {
    var tokenInstance = await zorToken.deployed();

    var name = await tokenInstance.name();
    assert(name, 'Token AIR', 'has the correct name');

    var symbol = await tokenInstance.symbol();
    assert(symbol, 'TAIR', 'has the correct symbol');

    var standard = await tokenInstance.standard();
    assert(standard, 'Token AIR v1.0', 'has the correct standard');
  });

  it('sets the total supply upon deployment', async function () {
    var tokenInstance = await zorToken.deployed();

    var totalSupply = await tokenInstance.totalSupply();
    assert.equal(
      totalSupply.toNumber(),
      1000000,
      'sets the total supply to 1,000,000'
    );

    var adminBalance = await tokenInstance.balanceOf(accounts[0]);
    assert.equal(
      adminBalance.toNumber(),
      1000000,
      'allocates the initial supply to the admin account'
    );
  });

  it('transfers token ownership', async function () {
    var tokenInstance = await zorToken.deployed();

    // testing `require` statement first by transferring an amount larger than the sender's balance
    try {
      assert.fail(await tokenInstance.transfer.call(accounts[1], 1000001));
    } catch (error) {
      assert(
        error.message.indexOf('revert') >= 0,
        'error message must conatin revert'
      );
    }

    // testing the return value
    var success = await tokenInstance.transfer.call(accounts[1], 250000, {
      from: accounts[0],
    });
    assert.equal(success, true, 'it returns true');

    var receipt = await tokenInstance.transfer(accounts[1], 250000, {
      from: accounts[0],
    });

    // testing that the Transfer event has been emitted
    assert.equal(receipt.logs.length, 1, 'triggers one event');
    assert.equal(
      receipt.logs[0].event,
      'Transfer',
      'should be the "Transfer" event'
    );
    assert.equal(
      receipt.logs[0].args._from,
      accounts[0],
      'logs the account the tokens are transferred from'
    );
    assert.equal(
      receipt.logs[0].args._to,
      accounts[1],
      'logs the account the tokens are transferred to'
    );
    assert.equal(
      receipt.logs[0].args._value,
      250000,
      'logs the transfer amount'
    );

    // testing the balance of the accounts
    var receiverBalance = await tokenInstance.balanceOf(accounts[1]);
    assert.equal(
      receiverBalance.toNumber(),
      250000,
      'adds amount to the receiving account'
    );
    var senderBalance = await tokenInstance.balanceOf(accounts[0]);
    assert.equal(
      senderBalance.toNumber(),
      750000,
      'deducts amount from the sending account'
    );
  });

  it('approves tokens for delegated transfers', async function () {
    var tokenInstance = await zorToken.deployed();

    // testing the return value
    var success = await tokenInstance.approve.call(accounts[1], 100);
    assert.equal(success, true, 'it returns true');

    var receipt = await tokenInstance.approve(accounts[1], 100, {
      from: accounts[0],
    });

    // testing that the Approval event has been emitted
    assert.equal(receipt.logs.length, 1, 'triggers one event');
    assert.equal(
      receipt.logs[0].event,
      'Approval',
      'should be the "Approval" event'
    );
    assert.equal(
      receipt.logs[0].args._owner,
      accounts[0],
      'logs the account the tokens are authorized by'
    );
    assert.equal(
      receipt.logs[0].args._spender,
      accounts[1],
      'logs the account the tokens are authorized to'
    );
    assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');

    // testing the allowance of the spending account
    var allowance = await tokenInstance.allowance(accounts[0], accounts[1]);
    assert.equal(
      allowance.toNumber(),
      100,
      'stores the allowance for delegated transfers'
    );
  });

  it('handles delegated token transfers', async function () {
    var tokenInstance = await zorToken.deployed();

    fromAccount = accounts[2];
    toAccount = accounts[3];
    spendingAccount = accounts[4];

    await tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
    await tokenInstance.approve(spendingAccount, 10, { from: fromAccount });

    // testing `require` statement first by transferring an amount larger than the sender's balance
    try {
      assert.fail(
        await tokenInstance.transferFrom.call(fromAccount, toAccount, 9999, {
          from: spendingAccount,
        })
      );
    } catch (error) {
      assert(
        error.message.indexOf('revert') >= 0,
        'cannot transfer value larger than balance'
      );
    }

    // testing `require` statement first by transferring an amount larger than the spending account's allowance
    try {
      assert.fail(
        await tokenInstance.transferFrom.call(fromAccount, toAccount, 20, {
          from: spendingAccount,
        })
      );
    } catch (error) {
      assert(
        error.message.indexOf('revert') >= 0,
        'cannot transfer value larger than approved amount'
      );
    }

    // testing return value
    var success = await tokenInstance.transferFrom.call(
      fromAccount,
      toAccount,
      10,
      { from: spendingAccount }
    );
    assert.equal(success, true, 'return value must be true');

    var receipt = await tokenInstance.transferFrom(fromAccount, toAccount, 10, {
      from: spendingAccount,
    });

    // testing that the transfer event has been emitted
    assert.equal(receipt.logs.length, 1, 'triggers one event');
    assert.equal(
      receipt.logs[0].event,
      'Transfer',
      'should be the "Transfer" event'
    );
    assert.equal(
      receipt.logs[0].args._from,
      fromAccount,
      'logs the account the tokens are transferred from'
    );
    assert.equal(
      receipt.logs[0].args._to,
      toAccount,
      'logs the account the tokens are transferred to'
    );
    assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');

    // testing the balance of the accounts
    var fromAccountBalance = await tokenInstance.balanceOf(fromAccount);
    assert.equal(
      fromAccountBalance.toNumber(),
      90,
      'deducts the amount from the sending account'
    );
    var toAccountBalance = await tokenInstance.balanceOf(toAccount);
    assert.equal(
      toAccountBalance.toNumber(),
      10,
      'adds the amount to the receiving account'
    );

    // testing the allowance of the spending account
    var allowance = await tokenInstance.allowance(fromAccount, spendingAccount);
    assert.equal(
      allowance.toNumber(),
      0,
      'deducts the allowance from the spending account'
    );
  });
});
