pragma solidity >=0.4.21 <0.6.0;

import "./PeterToken.sol";

contract OnlineBetting {

    //events
    event BetAdded(uint betId, string title);  //emit when
    event MoneyAdded(uint betId, string choice, uint amount);

    //Bet
    struct Bet {
        string title;
        address owner;
        uint lowerBound;
        uint currentAmount;
        uint upperBound;
        uint publishTime;
        uint lastBetTime;
        mapping (string => uint) currentChoice;
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

    //functions
    //Add bet to bets
    function addBet(string memory _title, uint _lowerBound, uint _upperBound, uint _publishTime, uint _lastBetTime) public {
        Bet memory bet = Bet(_title, msg.sender, _lowerBound, 0, _upperBound, _publishTime, _lastBetTime);
        uint betId = bets.push(bet) - 1;
        emit BetAdded(betId, _title);
    }

    //Add money to selected choice
    function addMoney(uint _id, string memory _choice, uint _amount) public isValidId(_id) isValidAmount(_id, _amount) {
        require(bets[_id].owner != msg.sender, "Cannot add money to your own bets.");
        bets[_id].currentAmount += _amount;
        bets[_id].currentChoice[_choice] += _amount;
        emit MoneyAdded(_id, _choice, _amount);
    }
    
    //Get bet from ID
    function getBet(uint _id) public view isValidId(_id) returns(string memory, uint, uint, uint) {
        Bet memory bet = bets[_id];
        return (bet.title, bet.lowerBound, bet.currentAmount, bet.upperBound);
    }

    //Get Amount from choice
    function getChoiceAmount(uint _id, string memory _choice) public view isValidId(_id) returns(uint) {
        return bets[_id].currentChoice[_choice];
    }
}