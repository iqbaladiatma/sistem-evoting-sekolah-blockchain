require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    // Local Hardhat Network (untuk development dan testing)
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    }
  },
  
  // Gas optimization untuk development
  gasReporter: {
    enabled: false,
    currency: "USD"
  }
};
