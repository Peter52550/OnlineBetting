let token

const Peter = artifacts.require('OnlineBetting')

contract('Peter', (accounts) => {

  beforeEach(async () => {
    token = await Peter.new()
  })

  it('TestAddBet', async () => {
    await token.setVIP({from: accounts[0], value: web3.utils.toWei("0.5")});
    await token.addBet(
      "asdf",
      0,
      10000,
      99999999999999,
      99999999999999,
      99999999999999,
      ["asd", "sdf", "dfg"],
      "Taiwan", 
      "Sports", 
      {from : accounts[0]}
    );
    await token.addBet(
      "NMSL",
      0,
      9000,
      99999999999999,
      99999999999999,
      99999999999999,
      ["asd", "sdf", "dfg"],
      "Taiwan", 
      "Sports", 
      {from : accounts[0]}
    );
    const ids= await token.getIds.call({from: accounts[0]});
    const bets = await token.getBets.call({from: accounts[0]});
    const hotBets = await token.getHotBets.call({from: accounts[0]});
    console.log(ids[1][0].toNumber());
    console.log(bets);
    console.log(hotBets);
  })
})