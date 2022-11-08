# Dmail
ChainLink Hackathon Project

## Technology Stack & Tools

- Solidity (Writing Smart Contract)
- Javascript (React & Testing)
- [Ethers](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Chainlink] ()(To get the current prices)
- [Ipfs](https://ipfs.io/) (Metadata storage)
- [React routers](https://v5.reactrouter.com/) (Navigational components)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/), should work with any node version below 16.5.0
- Install [Hardhat](https://hardhat.org/)

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
```
$ cd Dmail
$ npm install
```

### 3. Connect to blockchain
- create a .env file in the root directory and add the wallet's private address and alchemy/Infura/Moralis Rinkeby http key.

### 4. Run deploy script to migrate smart contracts
`$ npx hardhat run scripts/deploy.js --network rinkeby`

### 5. Run Tests
`$ npx hardhat test`

### 6. Launch Frontend
`$ npm run start`

License
----
MIT

