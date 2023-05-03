const UserNFTModel = require("../models/user_nft");
const getAllNFTs = async (userAddress, count, page) => {
  const allNFTs = await UserNFTModel.getUserNFTsByWalletAddress(userAddress.toLowerCase());

  let newNFTs = [];
  for (const nft of allNFTs) {
    for (const nftInfo of nft.token_ids) {
      newNFTs.push({
        wallet_address: nft.wallet_address,
        token_address: nft.token_address,
        token_id: nftInfo.token_id,
        owner_of: nftInfo.owner_of,
        contract_type: "ERC721",
        name: nftInfo.name,
        symbol: nftInfo.symbol,
        token_uri: nftInfo.token_uri,
        image_url: nftInfo.image_url,
        metadata: nftInfo.metadata
      })
    }
  }
  return {
    total: newNFTs.length,
    list: newNFTs.slice(page * count, page * count + count)
  };
}

module.exports = {
  getAllNFTs,
};
