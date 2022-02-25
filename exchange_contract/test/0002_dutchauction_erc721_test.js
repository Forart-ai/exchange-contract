const tests = require("@daonomic/tests-common");

const {AssetType, OrderDir, ZEROADDR, MakeFixPirceAsset, MakeDutchAuctionAsset, MakeSignOrder} = require("./common/utils");

const Exchange = artifacts.require("Exchange");
const TransferProxy = artifacts.require("TransferProxy");
const ERC721NFT = artifacts.require("ERC721NFT");


contract("erc721 dutchauction test", accounts => {
    before(async function () {
        [account1, account2] = await web3.eth.getAccounts();
        transferProxy = await TransferProxy.new();
        exchange = await Exchange.new();
        nft = await ERC721NFT.new();

    });

    it("initialize the environment", async function() {
        await exchange.setProxy(transferProxy.address);
        await transferProxy.setAccessible(exchange.address);
    });

    it("create test nft", async function() {
        await nft.awardItem(account1,"test item");
        tokenId = await nft.tokenOfOwnerByIndex(account1, 0);
        await nft.setApprovalForAll(transferProxy.address, true, {from: account1});
    });

    it("exchange", async function() {
        const sellAsset = MakeFixPirceAsset(AssetType.ERC721, tokenId.toString(), nft.address, 1);
        const auctionAsset = MakeDutchAuctionAsset(AssetType.ETH, 0, ZEROADDR, 100, 0);

        const startTime = (await web3.eth.getBlock("latest")).timestamp;

        // auction will be stop after 100 sec
        const endTime = startTime + 100;
        const sellSignOrder = await MakeSignOrder(OrderDir.sell, account1, sellAsset, ZEROADDR, auctionAsset, 1, ZEROADDR, startTime, endTime, parseInt(new Date() / 1000));
        
        
        await tests.increaseTime(20);

        const curTime = (await web3.eth.getBlock("latest")).timestamp;
        const chgValue = (curTime - startTime) * (auctionAsset.baseAsset.value - auctionAsset.extraValue) / (endTime - startTime);
        
        const buyValue = auctionAsset.baseAsset.value - chgValue;
        const buyAsset = MakeFixPirceAsset(AssetType.ETH, 0, ZEROADDR, buyValue);

        const buySignOrder = await MakeSignOrder(OrderDir.buy, account2, buyAsset, account1, sellAsset, 1, ZEROADDR, 0, 0, parseInt(new Date() / 1000));

        await tests.verifyBalanceChange(account1, -buyValue, async() =>
            await tests.verifyBalanceChange(account2, buyValue, async () => 
                await exchange.matchSingle(sellSignOrder.order, sellSignOrder.sign, buySignOrder.order, buySignOrder.sign, {from: account2, value: buyValue, gasPrice: 0})
            )
        );

        assert.equal(await nft.ownerOf(tokenId), account2);
    });

});