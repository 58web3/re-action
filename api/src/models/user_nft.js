const UserNFTSchema = require("../schemas/user_nft");
const { getTokenURI, getImageUrl, getMetadata } = require("../util/web3");

// Get model using schema
const UserNFT = dynamoose.model("UserNFT", UserNFTSchema);

const getUserNFTs = async (userId, tokenAddresses) => {
  let condition = new dynamoose.Condition()
    .where("user_id").eq(userId);

  if (tokenAddresses?.length > 0) {
    condition = condition.where("token_address")
      .in([...tokenAddresses]);
  }
  
  const userNFTs = await UserNFT.scan(condition).exec();

  return userNFTs;
};

const getUserNFT = async (userId, tokenAddress) => {
  const userNFT = await UserNFT.get({
    user_id: userId,
    token_address: tokenAddress
  });

  return userNFT;
};

const getUserNFTsByWalletAddress = async (walletAddress) => {
  const condition = new dynamoose.Condition()
    .where("wallet_address").eq(walletAddress);
  return await UserNFT.query(condition).exec();
};

const addUserNft = async ({ userId, tokenAddress, tokenId, tokenUri, imageUrl, symbol, tokenName, walletAddress }) => {
  const systemDate = new Date().getTime();
  const userNft = await getUserNFT(userId, tokenAddress);
  const tokenURI = tokenUri; // await getTokenURI(tokenAddress, tokenId) || "";
  const metadata = {};
  const nftName = tokenName;
  const gatewayImageUri = imageUrl ?
    imageUrl.replace("ipfs://", process.env.IPFS_GATEWAY_URL) : "";

  const tokenIdObj = {
    name: nftName,
    token_id: tokenId,
    symbol: symbol,
    token_uri: tokenURI,
    image_url: gatewayImageUri || "",
    metadata: JSON.stringify(metadata),
    owner_of: walletAddress
  };
  if (!userNft) {
    return await UserNFT.create({
      user_id: userId,
      token_address: tokenAddress,
      wallet_address: walletAddress,
      symbol: symbol,
      token_ids: [tokenIdObj],
      created_at: systemDate,
      created_by: userId,
      updated_at: systemDate,
      updated_by: userId,
      delete_flg: false
    });
  }
  const checkTokenIdExist = userNft.token_ids.find(element => element.token_id == tokenIdObj.token_id);
  if (!checkTokenIdExist) {
    return await UserNFT.update({
      user_id: userId, token_address: tokenAddress
    }, {
      symbol: symbol,
      "$ADD": {
        token_ids: [tokenIdObj]
      },
      updated_at: systemDate,
      updated_by: userId
    });
  }
};

const getName = async(symbol, tokenAddress, tokenId) => {
  // const tokens = await TokenModel.getTokensBySymbol(symbol);
  // if (!tokens) {
  //   return "";
  // }

  for (let token of tokens) {
    if (token.token_address.toLowerCase() === tokenAddress.toLowerCase()) {
      for (let variation of token.variation) {
        if (Number(variation.token_id_start) <= Number(tokenId)
          && Number(variation.token_id_end) >= Number(tokenId)) {
          return variation.token_name;
        }
      }
    }
  }
  return "";
}

const upsertUserNFT = async ({ userId, tokenAddress, walletAddress, tokenIds }) => {
  logger.info(userId, tokenAddress, walletAddress);
  const systemDate = new Date().getTime();

  const userNft = await getUserNFT(userId, tokenAddress);
  if (!userNft) {
    return await UserNFT.create({
      user_id: userId,
      token_address: tokenAddress,
      wallet_address: walletAddress,
      token_ids: tokenIds,
      created_at: systemDate,
      created_by: userId,
      updated_at: systemDate,
      updated_by: userId,
      delete_flg: false
    });
  }
  return await UserNFT.update({
    user_id: userId, token_address: tokenAddress
  }, {
    token_ids: tokenIds,
    updated_at: systemDate,
    updated_by: userId
  })
}

const batchDelete = async (keys) => {
  return await UserNFT.batchDelete(keys);
}
module.exports = {
  getUserNFT,
  getUserNFTs,
  addUserNft,
  getUserNFTsByWalletAddress,
  getName,
  upsertUserNFT,
  batchDelete,
  UserNFT
};
