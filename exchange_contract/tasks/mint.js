task("mint", "mint a nft")
.addParam("nft", "NFT account address")
.addParam("creator", "Creator account address")
.addParam("uri", "URI value")
.setAction(async function ({ nft, creator, uri }, { ethers: { getSigners } }, runSuper) {
  const planetItem = await ethers.getContractFactory("PlanetItem");
  const planet = planetItem.attach(nft);
  const [minter] = await ethers.getSigners();
  const ret = await (await planet.connect(minter).awardItem(creator, uri)).wait();
  console.log(ret.events[0].args.tokenId);
});

module.exports = {};