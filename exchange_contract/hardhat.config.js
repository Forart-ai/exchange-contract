// Replace this private key with your Ropsten account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
require("@nomiclabs/hardhat-waffle");
require("./tasks/account");
require("./tasks/transfer");
require("./tasks/mint");
require("./tasks/balanceOf");
require("./tasks/approve");
require("./tasks/transferFrom");
require('dotenv').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const getHDWallet = () => {
  const { MNEMONIC, PRIVATE_KEY } = process.env;
  if (MNEMONIC && MNEMONIC !== "") {
    return {
      mnemonic: MNEMONIC,
    }
  }
  if (PRIVATE_KEY && PRIVATE_KEY !== "") {
    return [PRIVATE_KEY]
  }
  throw Error("Private Key Not Set! Please set up .env");
}

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    development: {
      url: "http://localhost:8545",
      accounts: getHDWallet(),
    },
    cronos_testnet: {
      url: "https://cronos-testnet-3.crypto.org:8545",
      accounts: getHDWallet(),
    },
    avalanche_testnet: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: getHDWallet(),
    },
  },
  solidity: "0.8.4",
};
