const AssetType = {
    NONE: 0,
    ETH: 1,
    ERC20: 2,
    ERC721: 3,
    ERC1155: 4
};

const OrderDir = {
    sell: 0,
    buy: 1
};


const ZEROADDR = "0x0000000000000000000000000000000000000000";


async function HashAsset(asset) {
    return (await web3.utils.keccak256(await web3.eth.abi.encodeParameter({
        "Asset": {
            "settleType": 'uint256',
            "baseAsset": {
                "code": {
                    "baseType": 'uint256',
                    "extraType": 'uint256',
                    "contractAddr": 'address'
                },
                "value": 'uint256'
            },
            "extraValue": 'uint256'
        }
    }, asset)));
    
}
async function HashOrder(order) {
    const origin = {
        dir: order.dir, 
        maker: order.maker,
        makerAssetHash: await HashAsset(order.makerAsset),
        taker: order.taker,
        takerAssetHash: await HashAsset(order.takerAsset),
        fee: order.fee,
        feeRecipient: order.feeRecipient,
        startTime: order.startTime,
        endTime: order.endTime,
        salt: order.salt,
    }
    
    return (await web3.utils.keccak256(await web3.eth.abi.encodeParameter({
        "Order": {
            "dir": 'uint256',
            "maker": 'address',
            "makerAssetHash": 'bytes32',
            "taker": 'address',
            "takerAssetHash": 'bytes32',
            "fee": 'uint256',
            "feeRecipient": 'address',
            "startTime": 'uint256',
            "endTime": 'uint256',
            "salt": 'uint256',
        }
    }, origin)));
    
}


function MakeFixPirceAsset(baseType,extraType,contractAddr,amount) {
    return {settleType: 0, baseAsset: {code: {baseType, extraType, contractAddr}, value: amount}, extraValue: 0};
}

function MakeDutchAuctionAsset(baseType,extraType,contractAddr,startAmount,endAmount) {
    return {settleType: 1, baseAsset: {code: {baseType, extraType, contractAddr}, value: startAmount}, extraValue: endAmount};
}



async function MakeSignOrder(dir, maker, makerAsset, taker, takerAsset, fee, feeRecipient, startTime, endTime, salt) {
    const order = {dir, maker, makerAsset, taker, takerAsset, fee, feeRecipient, startTime, endTime, salt};
    const sign = await web3.eth.sign(await HashOrder(order), maker);
    
    return {order, sign};
}



module.exports = {MakeFixPirceAsset, MakeDutchAuctionAsset, MakeSignOrder,HashOrder, AssetType, OrderDir, ZEROADDR};