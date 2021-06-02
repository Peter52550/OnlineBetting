let token

const Peter = artifacts.require('OnlineBetting')

contract('Peter', (accounts) => {

  beforeEach(async () => {
    token = await Peter.new()
  })

  it('TestAddBet', async () => {
    await token.addBet("Peter", 0, 100, 123, 456, {from: accounts[0]});
    await token.addBet("Howard", 0, 200, 123, 456, {from: accounts[0]});

    const title_0 = await token.getTitle.call(0);
    const title_1 = await token.getTitle.call(1);
    const upper_0 = await token.getUpperBound.call(0);
    const upper_1 = await token.getUpperBound.call(1);
    const lower_0 = await token.getLowerBound.call(0);
    const lower_1 = await token.getLowerBound.call(1);
    const current_0 = await token.getCurrentAmount.call(0);
    const current_1 = await token.getCurrentAmount.call(1);

    assert.strictEqual(title_0, "Peter");
    assert.strictEqual(title_1, "Howard");
    assert.strictEqual(upper_0.toNumber(), 100);
    assert.strictEqual(upper_1.toNumber(), 200);
    assert.strictEqual(lower_0.toNumber(), 0);
    assert.strictEqual(lower_1.toNumber(), 0);
    assert.strictEqual(current_0.toNumber(), 0);
    assert.strictEqual(current_1.toNumber(), 0);
  })

  it('TestAddMoney', async () => {
    await token.addBet("Peter", 0, 100, 123, 456, {from: accounts[0]});
    await token.addBet("Howard", 0, 200, 123, 456, {from: accounts[0]});

    var current_0 = await token.getCurrentAmount.call(0);
    var current_1 = await token.getCurrentAmount.call(1);

    assert.strictEqual(current_0.toNumber(), 0);
    assert.strictEqual(current_1.toNumber(), 0);

    await token.addMoney(0, "asdf", 10, {from: accounts[0], value: web3.utils.toWei("0.01")});

    current_0 = await token.getCurrentAmount.call(0);
    current_1 = await token.getCurrentAmount.call(1);
    var asdf = await token.getChoiceAmount.call(0, "asdf");

    assert.strictEqual(current_0.toNumber(), 10);
    assert.strictEqual(current_1.toNumber(), 0);
    assert.strictEqual(asdf.toNumber(), 10);
  })

  it('TestReturnBets', async () => {
    await token.addBet("Peter", 0, 100, 123, 456, {from: accounts[0]});
    await token.addBet("Howard", 0, 200, 123, 456, {from: accounts[1]});
    await token.addBet("HaHa", 0, 200, 123, 456, {from: accounts[0]});
    await token.addBet("asdf", 0, 200, 123, 456, {from: accounts[0]});
    await token.addBet("zxcv", 0, 200, 123, 456, {from: accounts[1]});

    const ids = await token.getOwnId.call();
    const ans = [true, false, true, true, false];

    var i;
    for(i = 0; i < 5; i++) {
      assert.strictEqual(ids[i], ans[i]);
    }
  })
})