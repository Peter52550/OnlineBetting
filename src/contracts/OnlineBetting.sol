pragma solidity >=0.4.21 <0.6.0;

contract OnlineBetting {

    //constants
    uint constant SMALLEST_FEE = 0.001 ether;

    //events
    event BetAdded(uint betId, string title);  //emit when
    event MoneyAdded(uint betId, address adder, uint choice, uint amount);
    event AnswerSet(uint betId, uint choice);
    event MoneyGiven(address receiver, uint amount);

    //Bet
    struct Bet {
        string title;
        address owner;
        uint lowerBound;
        uint currentAmount;
        uint upperBound;
        uint publishTime;
        uint lastBetTime;
        uint answer;
        bool isAnswerSet;
    }

    //Bet list
    Bet[] bets;
    mapping (uint => string[]) choices;
    mapping (uint => uint[]) currentChoice;
    mapping (uint => address[]) voters;
    mapping (uint => mapping (address => uint[])) voterChoice;

    //Modifiers
    //Valid bet modifier
    modifier isValidId(uint _id) {
        require(_isIdValid(_id), "Bet has expired");
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
        Bet memory bet = Bet(_title, msg.sender, _lowerBound, 0, _upperBound, _publishTime, _lastBetTime, 0, false);
        uint betId = bets.push(bet) - 1;
        emit BetAdded(betId, _title);
    }

    function addChoice(uint _id, string memory _choice) public {
        choices[_id].push(_choice);
        currentChoice[_id].push(0);
    }

    function addMoney(uint _id, uint _choice, uint _amount) public payable isValidId(_id) isValidAmount(_id, _amount) {
        //require(bets[_id].owner != msg.sender, "Cannot add money to your own bets.");
        require(msg.value == _amount*SMALLEST_FEE, "Not Enough Money");
        bets[_id].currentAmount += _amount;
        currentChoice[_id][_choice] += _amount;
        voters[_id].push(msg.sender);
        voterChoice[_id][msg.sender][_choice] += _amount;
        emit MoneyAdded(_id, msg.sender, _choice, _amount);
    }
    
    function setAnswer(uint _id, uint _answer) public {
        require(msg.sender == bets[_id].owner);
        bets[_id].answer = _answer;
        bets[_id].isAnswerSet = true;
        emit AnswerSet(_id, _answer);
    }

    function distributeMoney(uint _id) public payable {
        require(bets[_id].isAnswerSet, "Answer Not Set");
        require(msg.sender == bets[_id].owner);
        uint creatorReward = uint(bets[_id].currentAmount*5/100);
        uint otherReward = uint(bets[_id].currentAmount*9/10);
        uint numVoters = voters[_id].length;
        uint answer = bets[_id].answer;

        address payable receiver = msg.sender;
        receiver.transfer(creatorReward * SMALLEST_FEE);
        emit MoneyGiven(receiver, creatorReward);
        for(uint i = 0; i < numVoters; i++) {
            receiver = address(uint160(voters[_id][i]));
            receiver.transfer(otherReward * SMALLEST_FEE * voterChoice[_id][receiver][answer] / currentChoice[_id][answer]);
            emit MoneyGiven(receiver, otherReward * voterChoice[_id][receiver][answer] / currentChoice[_id][answer]);
        }
    }

    function getIds() public view returns(uint[] memory, bool[] memory) {
        uint count;
        uint[] memory ids;
        (count, ids) = _getValidIds();
        uint[] memory validIds = new uint[](count);
        bool[] memory isOwnIds = new bool[](count);
        for(uint i = 0; i < count; i++) {
            validIds[i] = ids[i];
            isOwnIds[i] = (bets[i].owner == msg.sender);
        }
        return (validIds, isOwnIds);
    }

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

    function getChoiceNum(uint _id) public view isValidId(_id) returns(uint) {
        return choices[_id].length;
    }

    function getChoice(uint _id, uint _choice) public view isValidId(_id) returns(string memory) {
        return choices[_id][_choice];
    }

    function getChoicesAmount(uint _id) public view isValidId(_id) returns(uint[] memory) {
        uint len = getChoiceNum(_id);
        uint[] memory amounts = new uint[](len);
        for(uint i = 0; i < len; i++) {
            amounts[i] = currentChoice[_id][i];
        }
        return amounts;
    }

    function getAddressAmount(uint _id) public view isValidId(_id) returns(uint[] memory) {
        uint len = getChoiceNum(_id);
        uint[] memory amounts = new uint[](len);
        for(uint i = 0; i < len; i++) {
            amounts[i] = voterChoice[_id][msg.sender][i];
        }
        return amounts;
    } 

    function getAnswer(uint _id) public view isValidId(_id) returns(uint) {
        require(bets[_id].isAnswerSet, "Answer not set yet");
        return bets[_id].answer;
    }

    function _getValidIds() internal view returns(uint, uint[] memory) {
        uint[] memory validIds = new uint[](bets.length);
        uint count = 0;
        for(uint i = 0; i < bets.length; i++) {
            if(_isIdValid(i)) {
                validIds[count] = i;
                count++;
            }
        }
        return (count, validIds);
    }

    function _isIdValid(uint _id) internal view returns(bool) {
        return (now <= bets[_id].publishTime);
    }
}