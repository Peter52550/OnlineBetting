let token

const Peter = artifacts.require('OnlineBetting')

contract('Peter', (accounts) => {

  beforeEach(async () => {
    token = await Peter.new()
  })

  it('TestAddBet', async () => {
    await token.addBet("Peter", 0, 100, 1800000000, 456, ["haha", "isme", "asdf"],{from: accounts[0]});
    await token.addBet("Expired", 0, 100, 18, 456, ["haha", "isme", "asdf"],{from: accounts[0]});
    await token.addBet("Howard", 0, 200, 1800000000, 456, [],{from: accounts[0]});

    const title_0 = await token.getTitle.call(0);
    const title_1 = await token.getTitle.call(2);
    const upper_0 = await token.getUpperBound.call(0);
    const upper_1 = await token.getUpperBound.call(2);
    const lower_0 = await token.getLowerBound.call(0);
    const lower_1 = await token.getLowerBound.call(2);
    const current_0 = await token.getCurrentAmount.call(0);
    const current_1 = await token.getCurrentAmount.call(2);
    const bet = await token.getLastBet.call();

    console.log(bet);
    
    assert.strictEqual(title_0, "Peter");
    assert.strictEqual(title_1, "Howard");
    assert.strictEqual(upper_0.toNumber(), 100);
    assert.strictEqual(upper_1.toNumber(), 200);
    assert.strictEqual(lower_0.toNumber(), 0);
    assert.strictEqual(lower_1.toNumber(), 0);
    assert.strictEqual(current_0.toNumber(), 0);
    assert.strictEqual(current_1.toNumber(), 0);

    const choiceNum = await token.getChoiceNum(0);
    const choice0 = await token.getChoice(0, 0);
    const choice1 = await token.getChoice(0, 1);
    const choice2 = await token.getChoice(0, 2);

    assert.strictEqual(choiceNum.toNumber(), 3);
    assert.strictEqual(choice0, "haha");
    assert.strictEqual(choice1, "isme");
    assert.strictEqual(choice2, "asdf");
  })

  it('TestAddMoney', async () => {
    await token.addBet("Peter", 0, 100, 1800000000, 456, ["asdf", "zxcv"], {from: accounts[0]});
    await token.addBet("Howard", 0, 200, 1800000000, 456, ["asdf", "zxcv"],{from: accounts[0]});

    var current_0 = await token.getCurrentAmount.call(0);
    var current_1 = await token.getCurrentAmount.call(1);

    assert.strictEqual(current_0.toNumber(), 0);
    assert.strictEqual(current_1.toNumber(), 0);

    const num0 = await token.getChoiceNum.call(0);
    const choice0 = await token.getChoice.call(0, 0);
    const choice1 = await token.getChoice.call(0, 1);
    var addr0 = await token.getAddressAmount.call(0, {from: accounts[0]});
    var addr1 = await token.getAddressAmount.call(0, {from: accounts[1]});

    assert.strictEqual(num0.toNumber(), 2);
    assert.strictEqual(choice0, "asdf");
    assert.strictEqual(choice1, "zxcv");
    assert.strictEqual(addr0[0].toNumber(), 0);
    assert.strictEqual(addr1[0].toNumber(), 0);

    await token.addMoney(0, 0, 10, {from: accounts[0], value: web3.utils.toWei("0.01")});
    await token.addMoney(0, 0, 20, {from: accounts[1], value: web3.utils.toWei("0.02")});

    current_0 = await token.getCurrentAmount.call(0);
    current_1 = await token.getCurrentAmount.call(1);
    var asdf = await token.getChoicesAmount.call(0);
    addr0 = await token.getAddressAmount.call(0, {from: accounts[0]});
    addr1 = await token.getAddressAmount.call(0, {from: accounts[1]});

    assert.strictEqual(current_0.toNumber(), 30);
    assert.strictEqual(current_1.toNumber(), 0);
    assert.strictEqual(asdf[0].toNumber(), 30);
    assert.strictEqual(addr0[0].toNumber(), 10);
    assert.strictEqual(addr1[0].toNumber(), 20);
  })

  it('TestReturnBets', async () => {
    await token.addBet("Peter", 0, 100, 1800000000, 456, [],{from: accounts[0]});
    await token.addBet("Howard", 0, 200, 1800000000, 456, [],{from: accounts[1]});
    await token.addBet("HaHa", 0, 200, 1800000000, 456, [],{from: accounts[0]});
    await token.addBet("asdf", 0, 200, 1800000000, 456, [],{from: accounts[0]});
    await token.addBet("zxcv", 0, 200, 1800000000, 456, [],{from: accounts[1]});

    const ids = await token.getIds.call();
    const ans = [true, false, true, true, false];

    var i;
    for(i = 0; i < 5; i++) {
      assert.strictEqual(ids[1][i], ans[i]);
    }
  })

  it('TestAnswerSelect', async () => {
    await token.addBet("Peter", 0, 100, 1800000000, 456, ["haha", "isme", "asdf"], {from: accounts[0]});

    await token.setAnswer(0, 1, {from: accounts[0]});

    const answer = await token.getAnswer(0);

    assert.strictEqual(answer.toNumber(), 1);
  })

  it('TestDistribute', async () => {
    await token.addBet("Peter", 0, 10000, 1800000000, 456, ["haha", "isme", "asdf"], {from: accounts[0]});
    await token.setAnswer(0, 1, {from: accounts[0]});
    await web3.eth.getBalance(accounts[0], function(err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log(web3.utils.fromWei(result, "ether") + " ETH")
      }
    })
    await web3.eth.getBalance(accounts[1], function(err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log(web3.utils.fromWei(result, "ether") + " ETH")
      }
    })
    await web3.eth.getBalance(accounts[2], function(err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log(web3.utils.fromWei(result, "ether") + " ETH")
      }
    })

    await token.addMoney(0, 1, 1000, {from: accounts[1], value: web3.utils.toWei("1")});
    await token.addMoney(0, 2, 2000, {from: accounts[2], value: web3.utils.toWei("2")});
    await web3.eth.getBalance(accounts[1], function(err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log(web3.utils.fromWei(result, "ether") + " ETH")
      }
    })
    await web3.eth.getBalance(accounts[2], function(err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log(web3.utils.fromWei(result, "ether") + " ETH")
      }
    })
    await token.distributeMoney(0);
    await web3.eth.getBalance(accounts[0], function(err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log(web3.utils.fromWei(result, "ether") + " ETH")
      }
    })
    await web3.eth.getBalance(accounts[1], function(err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log(web3.utils.fromWei(result, "ether") + " ETH")
      }
    })
    await web3.eth.getBalance(accounts[2], function(err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log(web3.utils.fromWei(result, "ether") + " ETH")
      }
    })

  })
})