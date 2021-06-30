## NMLab Final -- EE OnlineBetting

### About the project

<img width="1000" alt="截圖 2021-06-30 下午12 41 31" src="https://user-images.githubusercontent.com/64849784/123903036-812ae980-d9a0-11eb-8e02-7d49c856abb9.png">
<img width="1000" alt="截圖 2021-06-30 下午12 41 45" src="https://user-images.githubusercontent.com/64849784/123903059-8a1bbb00-d9a0-11eb-8e9c-a0a91e20c1a9.png">

This is an project that is built on ethereum, allowing users to create bets, bidding and earn lots of tokens.

Users can leave their comments on specific bets and spin the wheels to get more bounties, We've got also hot bets and bets from all regions and categories for you to choose from.

The currency unit in this system is "haha" and the currency exchange rate is 1000 haha to 1 ether.

### Built with

#### Frontend
* React
* ant design
* material ui
* Web3

#### Backend
* Solidity
* Ganache
* Truffle

### Getting Started

#### Install dependencies

run the following command

```
npm install
```

#### Some dependencies you need to install

```
npm install antd --save
npm install @ant-design/icons --save
npm install @ant-design/charts --save
npm install clsx --save
npm install react-router-dom --save
npm install @material-ui/core --save
```
If npm install does not work and show some errors, this is probably due to the fact that the spinning wheel in our project is installed by yarn, try the following method:

```
yarn remove react-custom-roulette
rm -r node_modules
npm install
yarn add react-custom-roulette
```
The order above may depends on your environment, try switching the order and remember to install other packages required

#### Ganache
Make sure you have your Ganache open, add truffle.js and change the server port to 8545

```
cd ethereum
truffle compile
truffle migrate
```
move the build directory and the contract directory under src


#### Start the project

```
cd to root
npm start
```

### Usage

This is the page when you get in, there is a "join member" icon on the top-right, you will have to be one of our members to comment, create a bet, bid and spin the wheels
<img width="1434" alt="截圖 2021-06-27 上午11 10 50" src="https://user-images.githubusercontent.com/64849784/123900980-ae759880-d99c-11eb-9b48-5f6e971f989b.png">



The icon will disappear after you join the membership
<img width="681" alt="截圖 2021-06-30 下午12 29 36" src="https://user-images.githubusercontent.com/64849784/123902126-d9f98280-d99e-11eb-87e1-4df963a2618c.png">



#### Be sure that you read the rules and have fun

<img width="1434" alt="截圖 2021-06-30 下午12 37 30" src="https://user-images.githubusercontent.com/64849784/123902741-f3e79500-d99f-11eb-8018-d445abe45010.png">


