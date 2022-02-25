// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
require('dotenv').config();
const hre = require("hardhat");

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');


    const deployerWallet = (await hre.ethers.getSigners())[0];

    console.log(
        "Deploying contracts with the account:",
        deployerWallet.address
    );

    const PlanetItem = await hre.ethers.getContractFactory("PlanetItem");
    const planetItem = await PlanetItem.connect(deployerWallet).deploy();
    await planetItem.deployed();


    const TransferProxy = await hre.ethers.getContractFactory("TransferProxy");
    const transferProxy = await TransferProxy.connect(deployerWallet).deploy();
    await transferProxy.deployed();

    
    const Exchange = await hre.ethers.getContractFactory("Exchange");
    const exchange = await Exchange.connect(deployerWallet).deploy();
    await exchange.deployed();
    
    await exchange.setProxy(transferProxy.address);
    await transferProxy.setAccessible(exchange.address);
    
    
    console.log("planetItem deployed to:", planetItem.address);
    console.log("exchange deployed to:", exchange.address);
    console.log("transferProxy deployed to:", transferProxy.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
