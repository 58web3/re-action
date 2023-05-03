const WalletService = require("../services/wallet");
const UserWalletService = require("../services/user_wallet");
const UserService = require("../services/user");

const getUserIdByWalletAddress = async function (req, res) {
  try {
    // get parameter
    const walletAddress = req.params.wallet_address;

    // call service method
    const userWallet = await UserWalletService.getUserWalletByWalletAddress(walletAddress);

    // return response
    return res.status(200).json({ "user_id": userWallet?.user_id || null });
  } catch (e) {
    logger.error(e);
    res.status(500).json({
      message: 'Service Unavailable',
    });
  }
};

const getAllNFTs = async function (req, res) {
  try {
    //get parameter
    const walletAddress = req.params.wallet_address;
    let count = req.query.count;
    let page = req.query.page;

    // Check if the Requester and Resource Owner are the same
    if (!await verifyOwnershipOfUserWallet(req, walletAddress)) {
      return res.status(403).json({ "message": "Forbidden" })
    }

    let checkParameterNg = false;
    const maxCount = 50;

    const paramCount = req.query.count;
    if (paramCount && (isNaN(paramCount) || Number(paramCount) < 0 || Number(paramCount) > maxCount)) {
      checkParameterNg = true;
    }

    const paramPage = req.query.page;
    if (paramPage && (isNaN(paramPage) || Number(paramPage) < 0)) {
      checkParameterNg = true;
    }

    if (checkParameterNg) return res.status(400).json({
      message: "Bad Request"
    });

    if (!count) count = maxCount;
    if (!page) page = 0;

    const nfts = await WalletService.getAllNFTs(walletAddress, Number(count), Number(page))

    return res.status(200).json({
      total: nfts.total,
      result: nfts.list
    })
  } catch (e) {
    logger.error(e);
    res.status(500).json({
      message: 'Service Unavailable',
    });
  }
}

const verifyOwnershipOfUserWallet = async function (req, walletAddress) {
  const publicKey = req.user.wallets[0].public_key;
  const requesterWallet = await UserService.getUserWalletByPublicKey(publicKey);
  if (!requesterWallet || requesterWallet.wallet_address !== walletAddress) {
    return false;
  } else {
    return true;
  }
}

module.exports = { getUserIdByWalletAddress, getAllNFTs };
