# Getting Started with Hardhat


## Installation

This tutorial assumes that you have Node.js 12+ and Yarn. Please refer to
the [Yarn installation how-to](https://classic.yarnpkg.com/en/docs/install#mac-stable)
if you don't yet have the yarn command installed locally.

- To install the prerequisite packages, clone the examples repository:

```bash
git clone https://github.com/Forart-ai/forart-contract.git
```

- Add your private key (from MetaMask) to __.env__ file and
then run yarn: <br/>

```bash
echo "PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE" >> .env
npm install
```

## Deployment
### Deploy to Cronos testnet
Run the following command:
```bash
npm run deploy:cronos_testnet
```

### Deploy to Avalanche testnet
Run the following command:
```bash
npm run deploy:avalanche_testnet
```