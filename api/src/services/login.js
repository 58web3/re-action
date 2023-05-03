const UserModel = require("../models/user");
const DonorModel = require("../models/donor");
const TokenModel = require("../models/token");
const UserNFTModel = require("../models/user_nft");
const Web3Util = require("../util/web3");
const SubscanUtil = require("../util/subscan");

const login = async function (userId, res) {

  const user = await UserModel.getUserByKey(userId);
  if (!user) {
    return res.status(404).json({ message: "No user account" });
  }
  const walletAddress = user.wallets[0].wallet_address.toLowerCase();
  const donorList = await DonorModel.getDonors(user.user_id);

  if (donorList.length == 0) {
    return res.status(400).json({
      message: "Invalid Donor"
    });
  }

  let sentTokenList = [];
  let allNFTs = [];

  if (donorList && donorList.length > 0) {
    //get all tokenAddress
    const tokens = await TokenModel.getAllTokens();
    const tokenAddresses = tokens.map(t => t.contract_address.toLowerCase());

    // get all NFTs by subscan
    let isErrorSubscan = false;
    try {
      allNFTs = await SubscanUtil.getAllNFTs(walletAddress, tokenAddresses);
    } catch (e) {
      logger.error(e);
      allNFTs = [];
      isErrorSubscan = true;
    }

    // get before UserNFTs from UserNFT table, Skip this step if subscan error occurs
    const userNFTsBefore = isErrorSubscan ? [] : await UserNFTModel.getUserNFTsByWalletAddress(walletAddress);

    // remove UserNFT
    const userNFTRemoves = userNFTsBefore.filter(x => {
      let result = true;
      for (const nft of allNFTs) {
        if (nft.contract.toLowerCase() === x.token_address.toLowerCase()) {
          result = false;
          break;
        }
      }
      return result;
    });
    if (userNFTRemoves.length > 0) {
      await UserNFTModel.batchDelete(userNFTRemoves.map(u => ({
        user_id: u.user_id,
        token_address: u.token_address
      })));
    }

    // LOOP all NFTs
    // Update/Insert/Delete:
    let results = [];

    for (let nft of allNFTs) {
      const token = tokens.find(e => e.contract_address.toLowerCase() == nft.contract.toLowerCase());
      const name = token.token_name;
      const symbol = token.symbol;
      const getContractAddress = results.find(e => e.contract.toLowerCase() == nft.contract.toLowerCase());
      const metadata = {};
      const donor = donorList.find(d => d.token_name === name && d.token_id === nft.token_id);
      const tokenURI = donor?.token_uri; // await Web3Util.getTokenURI(nft.contract, nft.token_id);
      const imageUrl = donor?.image_url;
      const tokenDetail = {
        token_id: nft.token_id,
        name: name,
        symbol: symbol,
        token_uri: tokenURI ? tokenURI : "",
        image_url: imageUrl ? imageUrl.replace("ipfs://", process.env.IPFS_GATEWAY_URL) : "",
        metadata: JSON.stringify(metadata),
        owner_of: walletAddress
      };

      if (!getContractAddress) {
        results.push({
          userId: user.user_id,
          wallet_address: walletAddress,
          contract: nft.contract,
          token_ids: [tokenDetail]
        })
      } else {
        getContractAddress.token_ids.push(tokenDetail)
      }
    }

    for (let result of results) {
      await UserNFTModel.upsertUserNFT({
        userId: result.userId,
        tokenAddress: result.contract,
        walletAddress: result.wallet_address,
        tokenIds: result.token_ids,
      });
    }
  }

  let checkAllFailed = true;
  let transferFails = [];

  for (const donor of donorList) {
    if (!donor.is_sent_token) {
      const token = await TokenModel.getToken(donor.token_name);

      // check sent token by subscan
      const checkSentToken = await allNFTs.find(e =>
        e.contract.toLowerCase() === token.contract_address.toLowerCase() &&
        e.token_id === donor.token_id
      );

      if (checkSentToken) {
        donor.is_sent_token = true;

        await DonorModel.update(donor);
        if (checkAllFailed) checkAllFailed = false;
        continue;
      }

      let timesTransfer = 0;
      let sendToken;

      do {
        if (token.contract_type === 'SBT') {
          sendToken = await Web3Util.mint(token.contract_address, walletAddress, donor.token_id, donor.token_uri);
        } else if (token.contract_type === 'NFT') {
          sendToken = await Web3Util.transfer(token.contract_address, walletAddress, donor.token_id);
        }

        timesTransfer++;
      } while (timesTransfer < 1 && sendToken.messageError)

      const objectAddUserNFT = {
        userId: userId,
        tokenAddress: token.contract_address.toLowerCase(),
        tokenId: donor.token_id,
        tokenUri: donor.token_uri,
        imageUrl: donor.image_url,
        symbol: token.symbol,
        tokenName: donor.token_name,
        walletAddress: walletAddress
      }
      await UserNFTModel.addUserNft(objectAddUserNFT);

      if (!sendToken.messageError) {
        if (checkAllFailed) checkAllFailed = false;
      } else {
        transferFails.push({
          message: sendToken.messageError,
          token_name: donor.token_name,
          token_id: donor.token_id,
        });
        logger.error(`message: "${sendToken.messageError}" - contract_address:: ${token.contract_address} - token_name: ${donor.token_name} - token_id: ${donor.token_id}`);
      }

      sentTokenList.push(await DonorModel.update(donor));

    }
  }

  // get user nfts by wallet address
  const userNFTs = await UserNFTModel.getUserNFTsByWalletAddress(walletAddress);
  if (userNFTs.length === 0　&& checkAllFailed) {
    return res.status(403).json({
      message: "NFT/SBT possession required",
      transfer_fails: transferFails
    });
  }

  return { sentTokenList, transferFails };
};

module.exports = {
  login
};
