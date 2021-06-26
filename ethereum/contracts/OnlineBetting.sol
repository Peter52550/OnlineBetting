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
    enum Region{ Other, Taiwan, China, USA, UK, Japan, Korea, Canada, Egypt, Italy }
    enum Genre{ Other, News, Politics, Sports, Music, Meme, Art, Bitcoin, School, Tech }
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
        uint howard;
        bool isVIP;
        bool canGetReward;
        Reward reward;
    }

    constructor() public {
        jackpotAmount = 0;
    }

    //Bet list
    uint jackpotAmount;
    Bet[] bets;
    mapping (address => MemberView) members;
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
        require(members[msg.sender].isVIP, "You are not VIP!!");
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

    function spinWheel() public payable {
        require(msg.value == 0.1 ether, "Not enough money to spin");
        jackpotAmount += 100;
        uint howard = _rng();
        members[msg.sender].howard = howard;
        members[msg.sender].canGetReward = false;
        if(howard == 0) {
            msg.sender.transfer(jackpotAmount*SMALLEST_FEE);
            jackpotAmount = 0;
            members[msg.sender].reward = Reward.Jackpot;
        }
        if(howard > 0 && howard <= 500) {
            msg.sender.transfer(0.2 ether);
            jackpotAmount -= 200;
            members[msg.sender].reward = Reward.haha_200;
        }
        if(howard > 500 && howard <= 1000) {
            msg.sender.transfer(0.1 ether);
            jackpotAmount -= 100;
            members[msg.sender].reward = Reward.haha_100;
        }
        if(howard > 1000 && howard <= 2000) {
            msg.sender.transfer(0.05 ether);
            jackpotAmount -= 50;
            members[msg.sender].reward = Reward.haha_50;
        }
        if(howard > 2000 && howard <= 3000) {
            msg.sender.transfer(0.02 ether);
            jackpotAmount -= 20;
            members[msg.sender].reward = Reward.haha_20;
        }
        if(howard > 3000 && howard <= 4000) {
            msg.sender.transfer(0.01 ether);
            jackpotAmount -= 10;
            members[msg.sender].reward = Reward.haha_10;
        }
        if(howard > 4000 && howard <= 7000) {
            members[msg.sender].reward = Reward.Sorry;
        }
        if(howard > 7000) {
            members[msg.sender].reward = Reward.ByeBye;
        }
        members[msg.sender].canGetReward = true;
    }

    function getLastBet() public view returns(Bet memory) {
        return bets[bets.length-1];
    }

    function getBets() public view returns(uint[] memory, Bet[] memory, Status[] memory) {
        uint[] memory ids = new uint[](bets.length);
        Status[] memory statuses = new Status[](bets.length);
        for(uint i = 0; i < bets.length; i++) {
            ids[i] = i;
            statuses[i] = _getStatus(i);
        }
        return (ids, bets, statuses);
    }

    function getHotBets() public view returns(uint[] memory, Bet[] memory) {
        uint[] memory ids;
        Bet[] memory validBets;
        (ids, validBets) = _getValidBets();
        Bet[] memory hotBets = new Bet[](_min(10, validBets.length));
        _sortBets(ids, validBets);
        for(uint i = 0; i < _min(10, validBets.length); ++i) {
            hotBets[i] = validBets[i];
        }
        return (ids, hotBets);
    }

    function getVoterChoices(uint _id) public view returns(uint[] memory) {
        return voterChoice[_id][msg.sender];
    }

    function getComments(uint _id) public view returns(string[] memory) {
        return bets[_id].comments;
    }

    function getMemberView() public view returns(MemberView memory) {
        return members[msg.sender];
    }

    function getJackpot() public view returns(uint) {
        return jackpotAmount;
    }

    function getReward() public view returns(Reward) {
        require(members[msg.sender].canGetReward, "You are not allowed to get Reward");
        return members[msg.sender].reward;
    }

    function _getValidBets() internal view returns(uint[] memory, Bet[] memory) {
        uint count;
        uint[] memory ids;
        (count, ids) = _getValidIds();
        Bet[] memory validBets = new Bet[](count);
        for(uint i = 0; i < count; i++) {
            validBets[i] = bets[ids[i]];
        }
        return (ids, validBets);
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
        if(keccak256(abi.encodePacked(_region)) == keccak256(abi.encodePacked("USA"))) return Region.USA;
        if(keccak256(abi.encodePacked(_region)) == keccak256(abi.encodePacked("UK"))) return Region.UK;
        if(keccak256(abi.encodePacked(_region)) == keccak256(abi.encodePacked("Japan"))) return Region.Japan;
        if(keccak256(abi.encodePacked(_region)) == keccak256(abi.encodePacked("Korea"))) return Region.Korea;
        if(keccak256(abi.encodePacked(_region)) == keccak256(abi.encodePacked("Canada"))) return Region.Canada;
        if(keccak256(abi.encodePacked(_region)) == keccak256(abi.encodePacked("Egypt"))) return Region.Egypt;
        if(keccak256(abi.encodePacked(_region)) == keccak256(abi.encodePacked("Italy"))) return Region.Italy;
        else return Region.Other;
    }

    function _str2Genre(string memory _genre) internal pure returns(Genre) {
        if(keccak256(abi.encodePacked(_genre)) == keccak256(abi.encodePacked("News"))) return Genre.News;
        if(keccak256(abi.encodePacked(_genre)) == keccak256(abi.encodePacked("Sports"))) return Genre.Sports;
        if(keccak256(abi.encodePacked(_genre)) == keccak256(abi.encodePacked("Politics"))) return Genre.Politics;
        if(keccak256(abi.encodePacked(_genre)) == keccak256(abi.encodePacked("Music"))) return Genre.Music;
        if(keccak256(abi.encodePacked(_genre)) == keccak256(abi.encodePacked("Meme"))) return Genre.Meme;
        if(keccak256(abi.encodePacked(_genre)) == keccak256(abi.encodePacked("Art"))) return Genre.Art;
        if(keccak256(abi.encodePacked(_genre)) == keccak256(abi.encodePacked("Bitcoin"))) return Genre.Bitcoin;
        if(keccak256(abi.encodePacked(_genre)) == keccak256(abi.encodePacked("School"))) return Genre.School;
        if(keccak256(abi.encodePacked(_genre)) == keccak256(abi.encodePacked("Tech"))) return Genre.Tech;
        return Genre.Other;
    }

    function _sortBets(uint[] memory ids, Bet[] memory _bets) internal pure {
        if(_bets.length > 0) _quickSort(ids, _bets, 0, _bets.length-1);
    }

    function _quickSort(uint[] memory ids, Bet[] memory _bets, uint _init, uint _end) internal pure {
        uint i = _init;
        uint j = _end;
        if(i >= j) return;
        Bet memory pivot = _bets[(_init+_end )/ 2];
        while (i <= j) {
            while (_isLargerThan(_bets[i], pivot)) i++;
            while (_isLargerThan(pivot, _bets[j])) j--;
            if (i <= j) {
                (_bets[i], _bets[j]) = (_bets[j], _bets[i]);
                (ids[i], ids[j]) = (ids[j], ids[i]);
                i++;
                j--;
            }
        }
        if (_init < j)
            _quickSort(ids, _bets, _init, j);
        if (i < _end)
            _quickSort(ids, _bets, i, _end);
    }

    function _isLargerThan(Bet memory _bet1, Bet memory _bet2) internal pure returns(bool) {
        if(_bet1.voter.length > _bet2.voter.length) return true;
        else if(_bet1.voter.length == _bet2.voter.length) return _bet1.currentAmount > _bet2.currentAmount;
        else return false;
    }

    function _min(uint a, uint b) internal pure returns(uint) {
        if(a > b) return b;
        else return a;
    }

    function _getStatus(uint _id) internal view returns(Status) {
        Bet memory bet = bets[_id];
        if(bet.owner == msg.sender && bet.publishTime > now) return Status.OwnAvailable;
        else if(bet.owner != msg.sender && bet.publishTime > now) return Status.OtherAvailable;
        else if(bet.owner == msg.sender && bet.publishTime <= now) return Status.OwnExpire;
        else if(bet.owner != msg.sender && bet.publishTime <= now) return Status.OtherExpire;
    }

    function _rng() internal view returns(uint) {
        uint random = uint(keccak256(abi.encodePacked(block.difficulty, now)));
        return random%10000;
    }
}