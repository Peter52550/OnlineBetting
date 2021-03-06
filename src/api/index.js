const BN = require("bn.js");
const getInfo = async (func, accounts, arr) => {
  let values = [];
  let choices = arr.map((ele, index) => {
    let a = func(ele).call({
      from: accounts[0],
    });
    return a;
  });
  values = await Promise.all(choices);
  return values;
};
const getMoreInfo = async (func, accounts, id, arr) => {
  let values = [];
  let choices = arr.map((ele, index) => {
    let a = func(id, index).call({
      from: accounts[0],
    });
    return a;
  });
  values = await Promise.all(choices);
  return values;
};

const wrapperGet = (getter) => {
  try {
    let values = getter;
    return values;
  } catch (e) {
    console.log(e);
    throw e; // let caller know the promise was rejected with this reason
  }
};
export const InfoAPI = {
  getVoterChoices: async (contract, accounts, arr) => {
    let values = wrapperGet(
      getInfo(contract.methods.getVoterChoices, accounts, arr)
    );
    return values;
  },
  getJackpot: async (contract, accounts) => {
    let values = await contract.methods.getJackpot().call({
      from: accounts[0],
    });
    return values;
  },
  getMemberView: async (contract, accounts) => {
    let values = await contract.methods.getMemberView().call({
      from: accounts[0],
    });
    return values;
  },
  getBets: async (contract, accounts) => {
    let values = await contract.methods.getBets().call({
      from: accounts[0],
    });
    return values;
  },
  getReward: async (contract, accounts) => {
    let values = await contract.methods.getReward().call({
      from: accounts[0],
    });

    return values;
  },
  getHotBets: async (contract, accounts) => {
    console.log("hi");
    let values = await contract.methods.getHotBets().call({
      from: accounts[0],
    });
    console.log(values);
    return values;
  },
  getLastBet: async (contract, accounts) => {
    let values = await contract.methods.getLastBet().call({
      from: accounts[0],
    });
    return values;
  },
  getComments: async (contract, accounts, id) => {
    let values = await contract.methods.getComments(id).call({
      from: accounts[0],
    });
    return values;
  },
  getIds: async (contract, accounts) => {
    let values = await contract.methods.getIds().call({
      from: accounts[0],
    });
    console.log(values);
    return values;
  },
  getTitles: (contract, accounts, arr) => {
    // try {
    //   let values = getInfo(contract.methods.getTitle, accounts, arr[0]);
    //   return values; // this will be the resolved value of the returned promise
    // } catch (e) {
    //   console.log(e);
    //   throw e; // let caller know the promise was rejected with this reason
    // }
    let values = wrapperGet(
      getInfo(contract.methods.getTitle, accounts, arr[0])
    );
    return values;
  },
  getLowerBounds: (contract, accounts, arr) => {
    let values = wrapperGet(
      getInfo(contract.methods.getLowerBound, accounts, arr[0])
    );
    return values;
  },
  getUpperBounds: (contract, accounts, arr) => {
    let values = wrapperGet(
      getInfo(contract.methods.getUpperBound, accounts, arr[0])
    );
    return values;
  },
  getCurrentAmounts: (contract, accounts, arr) => {
    let values = wrapperGet(
      getInfo(contract.methods.getCurrentAmount, accounts, arr[0])
    );
    return values;
  },
  getAddressAmounts: async (contract, accounts, id) => {
    let values = await contract.methods.getAddressAmount(id).call({
      from: accounts[0],
    });
    // wrapperGet(
    //   getInfo(contract.methods.getAddressAmount, accounts, arr[0])
    // );
    // console.log("addressAmount: ", values);
    return values;
  },
  getChoiceNums: (contract, accounts, arr) => {
    let values = wrapperGet(
      getInfo(contract.methods.getChoiceNum, accounts, arr[0])
    );
    return values;
  },
  getChoices: (contract, accounts, id, arr) => {
    let values = wrapperGet(
      getMoreInfo(contract.methods.getChoice, accounts, id, arr)
    );
    return values;
  },
  getChoicesAmounts: (contract, accounts, arr) => {
    let values = wrapperGet(
      getInfo(contract.methods.getChoicesAmount, accounts, arr[0])
    );
    return values;
  },
};
export const AdderAPI = {
  addMoney: async (contract, accounts, web3, id, arr, nums) => {
    let values = [];
    let choices = arr.map((ele, index) => {
      let am = Number(nums[index]);
      if (isNaN(am) === false) {
        if (am > 0) {
          let a = contract.methods.addMoney(id, index, am).send({
            from: accounts[0],
            value: web3.utils.toWei(String(Number(am) * 0.001)),
          });
          return a;
        }
      }
    });
    values = await Promise.all(choices);
    return values;
  },
  setAnswer: async (contract, accounts, id, num) => {
    let value = await contract.methods.setAnswer(id, num).send({
      from: accounts[0],
    });
    return value;
  },
  distributeMoney: async (contract, accounts, id) => {
    let value = await contract.methods.distributeMoney(id).send({
      from: accounts[0],
    });
    return value;
  },
  addComment: async (contract, accounts, id, comment) => {
    let value = await contract.methods.addComment(id, comment).send({
      from: accounts[0],
    });
    return value;
  },
  setVIP: async (contract, accounts, web3) => {
    let value = await contract.methods.setVIP().send({
      from: accounts[0],
      value: web3.utils.toWei(String(500 * 0.001)),
    });
    return value;
  },
  spinWheel: async (contract, accounts, web3) => {
    let value = await contract.methods.spinWheel().send({
      from: accounts[0],
      value: web3.utils.toWei(String(100 * 0.001)),
    });
    return value;
  },
};
