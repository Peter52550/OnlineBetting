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
    event SetVIP(address member);
    event AddComment(uint betId, string comment);

    //Enums
    enum Status{ OwnAvailable, OtherAvailable, OwnExpire, OtherExpire }
    enum Region{ Other, Taiwan, China, USA, Europe }
    enum Genre{ Other, News, Politics, Sports }
    enum Reward{ Sorry, ByeBye, haha_10, haha_20, haha_50, haha_100, haha_200, Jackpot}

    //Bet
    struct Bet {
        string title;
        string[] choices;
        string[] comments;
        address owner;
        uint lowerBound;
        uint currentAmount;
        uint upperBound;
        uint publishTime;
        uint lastBetTime;
        uint distributeTime;
        uint answer;
        uint[] currentChoices;
        address[] voter;
        bool isAnswerSet;
        Region region;
        Genre genre;
    }

    struct MemberView {
        uint betsConstructed;
        uint moneyAdded;
        bool isVIP;
    }

    constructor() public {
        jackpotAmount = 0;
    }

    //Bet list
    uint jackpotAmount;
    Bet[] bets;
    mapping (address => MemberView) members;
    mapping (uint => mapping (address => uint[])) voterChoice;
    mapping (uint => mapping (address => string[])) comments;

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
    function addBet(
        string memory _title, 
        uint _lowerBound, 
        uint _upperBound, 
        uint _publishTime, 
        uint _lastBetTime, 
        uint _distributeTime,
        string[] memory _choices, 
        string memory _region, 
        string memory _genre
    ) public {
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
        bet.distributeTime = _distributeTime;
        bet.choices = _choices;
        bet.currentChoices = currentChoices;
        bet.region = _str2Region(_region);
        bet.genre = _str2Genre(_genre);
        emit BetAdded(betId, _title);
        members[msg.sender].betsConstructed++;
    }

    function setVIP() public payable {
        require(msg.value == 0.5 ether, "Not enough money to set VIP");
        members[msg.sender].isVIP = true;
        emit SetVIP(msg.sender);
    }

    function addMoney(uint _id, uint _choice, uint _amount) public payable isValidId(_id) isValidAmount(_id, _amount) {
        //require(bets[_id].owner != msg.sender, "Cannot add money to your own bets.");
        require(msg.value == _amount*SMALLEST_FEE, "Not Enough Money");
        require(now <= bets[_id].lastBetTime, "Bet time is over");
        bets[_id].currentAmount += _amount;
        bets[_id].currentChoices[_choice] += _amount;
        _addressInit(_id, msg.sender);
        voterChoice[_id][msg.sender][_choice] += _amount;
        emit MoneyAdded(_id, msg.sender, _choice, _amount);
        members[msg.sender].moneyAdded += _amount;
    }
    
    function setAnswer(uint _id, uint _answer) public {
        require(msg.sender == bets[_id].owner);
        bets[_id].answer = _answer;
        bets[_id].isAnswerSet = true;
        emit AnswerSet(_id, _answer);
    }

    function distributeMoney(uint _id) public payable {
        require(msg.sender == bets[_id].owner);
        if(bets[_id].isAnswerSet) {
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
        else {
            address payable receiver;
            uint numVoters = bets[_id].voter.length;
            uint numChoices = bets[_id].choices.length;
            for(uint i = 0; i < numVoters; i++) {
                receiver = payable(bets[_id].voter[i]);
                for(uint j = 0; j < numChoices; j++) {
                    receiver.transfer(voterChoice[_id][receiver][j] * SMALLEST_FEE);
                    emit MoneyGiven(receiver, voterChoice[_id][receiver][j]);
                }
            }
        }
    }

    function addComment(uint _id, string memory _comment) public {
        bets[_id].comments.push(_comment);
        emit AddComment(_id, _comment);
    }

    function spinWheel() public payable returns(Reward) {
        require(msg.value == 0.1 ether, "Not enough money to spin");
        jackpotAmount += 100;
        uint howard = _rng();
        if(howard == 0) {
            msg.sender.transfer(jackpotAmount);
            jackpotAmount = 0;
            return Reward.Jackpot;
        }
        if(howard > 0 && howard <= 500) {
            msg.sender.transfer(jackpotAmount);
            jackpotAmount -= 200;
            return Reward.haha_200;
        }
        if(howard > 500 && howard <= 1000) {
            msg.sender.transfer(jackpotAmount);
            jackpotAmount = 0;
            return Reward.haha_100;
        }
        if(howard > 1000 && howard <= 2000) {
            msg.sender.transfer(jackpotAmount);
            jackpotAmount = 0;
            return Reward.haha_50;
        }
        if(howard > 2000 && howard <= 3000) {
            msg.sender.transfer(jackpotAmount);
            jackpotAmount = 0;
            return Reward.haha_20;
        }
        if(howard > 3000 && howard <= 4000) {
            msg.sender.transfer(jackpotAmount);
            jackpotAmount = 0;
            return Reward.haha_10;
        }
        if(howard > 4000 && howard <= 7000) {
            msg.sender.transfer(jackpotAmount);
            jackpotAmount = 0;
            return Reward.Sorry;
        }
        if(howard > 7000) {
            msg.sender.transfer(jackpotAmount);
            jackpotAmount = 0;
            return Reward.ByeBye;
        }
    }

    function getIds() public view returns(uint[] memory, Status[] memory) {
        uint[] memory ids;
        Status[] memory statuses;
        for(uint i = 0; i < bets.length; i++) {
            ids[i] = i;
            statuses[i] = _getStatus(i);
        }
        return (ids, statuses);
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

    function getHotBets() public view returns(Bet[] memory) {
        Bet[] memory validBets = getBets();
        Bet[] memory hotBets = new Bet[](10);
        _sortBets(validBets);
        for(uint i = 0; i < _max(10, validBets.length); ++i) {
            hotBets[i] = validBets[i];
        }
        return hotBets;
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
            voterChoice[_id][msg.sender] = new uint[](bets[_id].choices.length);
        }
    }

    function _str2Region(string memory _region) internal pure returns(Region) {
        if(keccak256(abi.encodePacked(_region)) == keccak256(abi.encodePacked("Taiwan"))) return Region.Taiwan;
        if(keccak256(abi.encodePacked(_region)) == keccak256(abi.encodePacked("China"))) return Region.China;
        if(keccak256(abi.encodePacked(_region)) == keccak256(abi.encodePacked("USA"))) return Region.Taiwan;
        if(keccak256(abi.encodePacked(_region)) == keccak256(abi.encodePacked("Europe"))) return Region.Europe;
        else return Region.Other;
    }

    function _str2Genre(string memory _genre) internal pure returns(Genre) {
        if(keccak256(abi.encodePacked(_genre)) == keccak256(abi.encodePacked("News"))) return Genre.News;
        if(keccak256(abi.encodePacked(_genre)) == keccak256(abi.encodePacked("Sports"))) return Genre.Sports;
        if(keccak256(abi.encodePacked(_genre)) == keccak256(abi.encodePacked("Politics"))) return Genre.Politics;
        return Genre.Other;
    }

    function _sortBets(Bet[] memory _bets) internal pure {
        _quickSort(_bets, 0, _bets.length-1);
    }

    function _quickSort(Bet[] memory _bets, uint _init, uint _end) internal pure {
        uint i = _init;
        uint j = _end;
        if(i == j) return;
        Bet memory pivot = _bets[(_init + (_end - _init) / 2)];
        while (i <= j) {
            while (_bets[i].voter.length < pivot.voter.length) i++;
            while (pivot.voter.length < _bets[j].voter.length) j--;
            if (i <= j) {
                (_bets[uint(i)], _bets[uint(j)]) = (_bets[uint(j)], _bets[uint(i)]);
                i++;
                j--;
            }
        }
        if (_init < j)
            _quickSort(_bets, _init, j);
        if (i < _end)
            _quickSort(_bets, i, _end);
    }

    function _max(uint a, uint b) internal pure returns(uint) {
        if(a > b) return a;
        else return b;
    }

    function _getStatus(uint _id) internal view returns(Status) {
        Bet memory bet = bets[_id];
        if(bet.owner == msg.sender && bet.publishTime <= now) return Status.OwnAvailable;
        else if(bet.owner != msg.sender && bet.publishTime <= now) return Status.OtherAvailable;
        else if(bet.owner != msg.sender && bet.publishTime <= now) return Status.OwnExpire;
        else if(bet.owner != msg.sender && bet.publishTime <= now) return Status.OtherExpire;
    }

    function _rng() internal view returns(uint) {
        uint random = uint(keccak256(abi.encodePacked(block.difficulty, now)));
        return random%10000;
    }
}