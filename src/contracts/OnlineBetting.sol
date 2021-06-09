pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

contract OnlineBetting {

    //constants
    uint constant SMALLEST_FEE = 0.001 ether;
    uint constant PERCENTAGE_FEE = 0.00001 ether;

    //events
    event BetAdded(uint betId, string title);  //emit when
    event MoneyAdded(uint betId, address adder, uint choice, uint amount);
    event AnswerSet(uint betId, uint choice);
    event MoneyGiven(address receiver, uint amount);

    //Bet
    struct Bet {
        string title;
        string[] choices;
        address owner;
        uint lowerBound;
        uint currentAmount;
        uint upperBound;
        uint publishTime;
        uint lastBetTime;
        uint answer;
        uint[] currentChoices;
        address[] voter;
        bool isAnswerSet;
    }

    //Bet list
    Bet[] bets;
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
    function addBet(string memory _title, uint _lowerBound, uint _upperBound, uint _publishTime, uint _lastBetTime, string[] memory _choices) public {
        uint betId = bets.length;
        uint choiceLength = _choices.length;
        uint[] memory currentChoices = new uint[](choiceLength);
        Bet storage bet = bets.push();
        bet.title = _title;
        bet.owner = msg.sender;
        bet.lowerBound = _lowerBound;
        bet.upperBound = _upperBound;
        bet.publishTime = _publishTime;
        bet.lastBetTime = _lastBetTime;
        bet.choices = _choices;
        bet.currentChoices = currentChoices;
        emit BetAdded(betId, _title);
    }

    function addMoney(uint _id, uint _choice, uint _amount) public payable isValidId(_id) isValidAmount(_id, _amount) {
        //require(bets[_id].owner != msg.sender, "Cannot add money to your own bets.");
        require(msg.value == _amount*SMALLEST_FEE, "Not Enough Money");
        bets[_id].currentAmount += _amount;
        bets[_id].currentChoices[_choice] += _amount;
        _addressInit(_id, msg.sender);
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
        uint creatorReward = uint(bets[_id].currentAmount*5);
        uint otherReward = uint(bets[_id].currentAmount*90);
        uint numVoters = bets[_id].voter.length;
        uint answer = bets[_id].answer;

        address payable receiver = msg.sender;
        receiver.transfer(creatorReward * PERCENTAGE_FEE);
        emit MoneyGiven(receiver, creatorReward);
        for(uint i = 0; i < numVoters; i++) {
            receiver = payable(bets[_id].voter[i]);
            receiver.transfer(otherReward * PERCENTAGE_FEE * voterChoice[_id][receiver][answer] / bets[_id].currentChoices[answer]);
            emit MoneyGiven(receiver, otherReward * voterChoice[_id][receiver][answer] / bets[_id].currentChoices[answer]);
        }
    }

    function getLastBet() public view returns(Bet memory) {
        return bets[bets.length-1];
    }

    function getBets() public view returns(Bet[] memory) {
        uint count;
        uint[] memory ids;
        (count, ids) = _getValidIds();
        Bet[] memory validBets = new Bet[](count);
        for(uint i = 0; i < count; i++) {
            validBets[i] = bets[ids[i]];
        }
        return validBets;
    }


// version 1.0
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
        return bets[_id].choices.length;
    }

    function getChoice(uint _id, uint _choice) public view isValidId(_id) returns(string memory) {
        return bets[_id].choices[_choice];
    }

    function getChoicesAmount(uint _id) public view isValidId(_id) returns(uint[] memory) {
        return bets[_id].currentChoices;
    }

    function getAddressAmount(uint _id) public view isValidId(_id) returns(uint[] memory) {
        uint len = getChoiceNum(_id);
        uint[] memory amounts = new uint[](len);
        if(_hasBet(_id, msg.sender)) {
            for(uint i = 0; i < len; i++) {
                amounts[i] = voterChoice[_id][msg.sender][i];
            }
        }
        return amounts;
    } 

    function getAnswer(uint _id) public view isValidId(_id) returns(uint) {
        require(bets[_id].isAnswerSet, "Answer not set yet");
        return bets[_id].answer;
    }

    function getTime() public view returns(uint) {
        return now;
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

    function _hasBet(uint _id, address _better) internal view returns(bool) {
        uint len = bets[_id].voter.length;
        for(uint i = 0; i < len; i++) {
            if(bets[_id].voter[i] == _better) return true;
        }
        return false;
    }

    function _addressInit(uint _id, address _better) internal isValidId(_id) {
        bool isInit = _hasBet(_id, _better);
        if(!isInit) {
            bets[_id].voter.push(_better);
            voterChoice[_id][msg.sender] = new uint[](getChoiceNum(_id));
        }
    }
}