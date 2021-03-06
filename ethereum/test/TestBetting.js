let token

const Peter = artifacts.require('OnlineBetting')

contract('Peter', (accounts) => {

  beforeEach(async () => {
    token = await Peter.new()
  })

  it('TestAddBet', async () => {
    await token.setVIP({from: accounts[0], value: web3.utils.toWei("0.5")});
    await token.setVIP({from: accounts[1], value: web3.utils.toWei("0.5")});
    var hotBets = await token.getHotBets.call({from: accounts[0]});

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
    
    hotBets = await token.getHotBets.call({from: accounts[0]});

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

    hotBets = await token.getHotBets.call({from: accounts[0]});

    await token.addBet(
      "Peter",
      0,
      9000,
      99999999999999,
      99999999999999,
      99999999999999,
      ["asd", "sdf"],
      "China", 
      "Meme", 
      {from : accounts[1]}
    );

    hotBets = await token.getHotBets.call({from: accounts[0]});

    await token.addBet(
      "Howard",
      0,
      9000,
      99999999999999,
      99999999999999,
      99999999999999,
      ["asd", "sdf", "haha", "isme"],
      "UK", 
      "Art", 
      {from : accounts[1]}
    );

    hotBets = await token.getHotBets.call({from: accounts[0]});

    await token.addBet(
      "Where",
      0,
      9000,
      99999999999999,
      99999999999999,
      99999999999999,
      ["bug", "is"],
      "asdf", 
      "asdf", 
      {from : accounts[1]}
    );

    hotBets = await token.getHotBets.call({from: accounts[0]});
    console.log(hotBets)

    await token.addMoney(1, 1, 100, {from: accounts[2], value: web3.utils.toWei("0.1")});
    hotBets = await token.getHotBets.call({from: accounts[0]});
    await token.addMoney(1, 1, 100, {from: accounts[0], value: web3.utils.toWei("0.1")});
    hotBets = await token.getHotBets.call({from: accounts[0]});
    await token.addMoney(2, 1, 200, {from: accounts[2], value: web3.utils.toWei("0.2")});
    hotBets = await token.getHotBets.call({from: accounts[0]});
    await token.addMoney(2, 0, 300, {from: accounts[1], value: web3.utils.toWei("0.3")});
    hotBets = await token.getHotBets.call({from: accounts[0]});
    await token.addMoney(0, 2, 500, {from: accounts[0], value: web3.utils.toWei("0.5")});

    hotBets = await token.getHotBets.call({from: accounts[0]});
    //const bets = await token.getBets.call({from: accounts[0]});
    const member0 = await token.getMemberView.call({from: accounts[0]});
    const member1 = await token.getMemberView.call({from: accounts[1]});
    const member2 = await token.getMemberView.call({from: accounts[2]});
    const choice00 = await token.getVoterChoices.call(0, {from: accounts[0]});
    const choice01 = await token.getVoterChoices.call(1, {from: accounts[0]});
    const choice02 = await token.getVoterChoices.call(2, {from: accounts[0]});
    const choice10 = await token.getVoterChoices.call(0, {from: accounts[1]});
    const choice11 = await token.getVoterChoices.call(1, {from: accounts[1]});
    const choice12 = await token.getVoterChoices.call(2, {from: accounts[1]});
    const choice20 = await token.getVoterChoices.call(0, {from: accounts[2]});
    const choice21 = await token.getVoterChoices.call(1, {from: accounts[2]});
    const choice22 = await token.getVoterChoices.call(2, {from: accounts[2]});

    //console.log(ids[1][0].toNumber());
    //console.log(bets);
    //console.log(hotBets);
    console.log(member0);
    console.log(member1);
    console.log(member2);
    console.log(choice00);
    console.log(choice01);
    console.log(choice02);
    console.log(choice10);
    console.log(choice11);
    console.log(choice12);
    console.log(choice20);
    console.log(choice21);
    console.log(choice22);
  })
  it('TestSpinWheel' , async () => {
    await token.spinWheel({from: accounts[0], value: web3.utils.toWei("0.1")});
    const asdf = await token.getReward.call({from: accounts[0]});
    const member = await token.getMemberView.call({from: accounts[0]});
    const jackpot = await token.getJackpot.call({from: accounts[0]});
    console.log(asdf.toNumber());
    console.log(member);
    console.log(jackpot)
  })
})