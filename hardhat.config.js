require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

PRIVATE_KEY = process.env.PRIVATE_KEY
ALCHEMY_URL = process.env.ALCHEMY_URL

module.exports = {
  
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    rinkeby: {
      url: ALCHEMY_URL,
      accounts: [PRIVATE_KEY],
      eth_usd_priceFeed : "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e"
    }
  },

  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
