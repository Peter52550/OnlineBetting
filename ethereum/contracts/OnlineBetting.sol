pragma solidity >=0.4.21 <0.6.0;

contract OnlineBetting {

    //events
    event BetAdded(uint betId, string title);  //emit when
    event MoneyAdded(uint betId, uint amount);

    //Bet
    struct Bet {
        address owner;
        string title;
        uint lowerBound;
        uint currentAmount;
        uint upperBound;
        uint publishTime;
        uint lastBetTime;
    }

    //Bet list
    Bet[] bets;

    //Modifiers
    //Valid bet modifier
    modifier isValidId(uint _id) {
        require(_id < bets.length, "Invalid ID!!!");
        require(now <= bets[_id].publishTime, "Bet has expired");
        _;
    }

    //Valid amount
    modifier isValidAmount(uint _id, uint _amount) {
        require(bets[_id].currentAmount + _amount <= bets[_id].upperBound, "Too much money!!!");
        _;
    }

    //Add bet to bets
    function addBet(string memory _title, uint _lowerBound, uint _upperBound, uint _publishTime, uint _lastBetTime) public {
        Bet memory bet = Bet(msg.sender, _title, _lowerBound, 0, _upperBound, _publishTime, _lastBetTime);
        uint betId = bets.push(bet) - 1;
        emit BetAdded(betId, _title);
    }

    //Add money to selected bet
    function addMoney(uint _id, uint _amount) public isValidId(_id) isValidAmount(_id, _amount) {
        bets[_id].currentAmount += _amount;
        emit MoneyAdded(_id, _amount);
    }
    
    //Get bet from ID
    function getBet(uint _id) public view isValidId(_id) returns(string memory, uint) {
        return (bets[_id].title, bets[_id].currentAmount);
    }
}