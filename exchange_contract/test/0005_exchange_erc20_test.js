const tests = require("@daonomic/tests-common");

const {AssetType, OrderDir, ZEROADDR, MakeFixPirceAsset, MakeDutchAuctionAsset, MakeSignOrder} = require("./common/utils");

const Exchange = artifacts.require("Exchange");
const TransferProxy = artifacts.require("TransferProxy");
const ERC721NFT = artifacts.require("ERC721NFT");
const ERC20Wallet = artifacts.require("ERC20Wallet");


contract("erc20 exchange test", accounts => {
    before(async function () {
        [account1, account2] = await web3.eth.getAccounts();
        transferProxy = await TransferProxy.new();
        exchange = await Exchange.new();
        nft = await ERC721NFT.new();
        erc20Wallet = await ERC20Wallet.new();

    });

    it("initialize the environment", async function() {
        await exchange.setProxy(transferProxy.address);
        await transferProxy.setAccessible(exchange.address);
        await erc20Wallet.mint(account2, 100);

        
        assert.equal(await erc20Wallet.balanceOf(account1), 0);
        assert.equal(await erc20Wallet.balanceOf(account2), 100);
    });

    it("create test nft", async function() {
        await nft.awardItem(account1,"test item");
        tokenId = await nft.tokenOfOwnerByIndex(account1, 0);
        await erc20Wallet.approve(transferProxy.address, 100, {from: account2} );
        await nft.setApprovalForAll(transferProxy.address, true, {from: account1});
    });

    it("exchange", async function() {
        const sellAsset = MakeFixPirceAsset(AssetType.ERC721, tokenId.toString(), nft.address, 1);
        const buyAsset = MakeFixPirceAsset(AssetType.ERC20, 0, erc20Wallet.address, 100);
        
        const sellSignOrder = await MakeSignOrder(OrderDir.sell, account1, sellAsset, ZEROADDR, buyAsset, 1, ZEROADDR, 0, 0, parseInt(new Date() / 1000));
        const buySignOrder = await MakeSignOrder(OrderDir.buy, account2, buyAsset, account1, sellAsset, 1, ZEROADDR, 0, 0, parseInt(new Date() / 1000));

        await exchange.matchSingle(sellSignOrder.order, sellSignOrder.sign, buySignOrder.order, buySignOrder.sign, {from: account2, value: 100, gasPrice: 0})


        assert.equal(await erc20Wallet.balanceOf(account1), 100);
        assert.equal(await erc20Wallet.balanceOf(account2), 0);
        assert.equal(await nft.ownerOf(tokenId), account2);
    });

});