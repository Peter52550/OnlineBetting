pragma solidity >=0.4.21 <0.6.0;

contract OnlineBetting {

    //constants
    uint constant SMALLEST_FEE = 0.001 ether;

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
    }

    //Bet list
    Bet[] bets;
    mapping (uint => mapping (string => uint)) currentChoice;

    //Modifiers
    //Valid bet modifier
    modifier isValidId(uint _id) {
        require(_id < bets.length, "Invalid ID!!!");
        //require(now <= bets[_id].publishTime, "Bet has expired");
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
    function addMoney(uint _id, string memory _choice, uint _amount) public payable isValidId(_id) isValidAmount(_id, _amount) {
        //require(bets[_id].owner != msg.sender, "Cannot add money to your own bets.");
        require(msg.value == _amount*SMALLEST_FEE, "Not Enough Money");
        bets[_id].currentAmount += _amount;
        currentChoice[_id][_choice] += _amount;
        emit MoneyAdded(_id, _choice, _amount);
    }
    
    //Get Title from ID
    function getTitle(uint _id) public view isValidId(_id) returns(string memory) {
        Bet memory bet = bets[_id];
        return bet.title;
    }

    function getLowerBound(uint _id) public view isValidId(_id) returns(uint) {
        Bet memory bet = bets[_id];
        return bet.lowerBound;
    }

    function getCurrentAmount(uint _id) public view isValidId(_id) returns(uint) {
        Bet memory bet = bets[_id];
        return bet.currentAmount;
    }

    function getUpperBound(uint _id) public view isValidId(_id) returns(uint) {
        Bet memory bet = bets[_id];
        return bet.upperBound;
    }

    //Get Amount from choice
    function getChoiceAmount(uint _id, string memory _choice) public view isValidId(_id) returns(uint) {
        return currentChoice[_id][_choice];
    }
}