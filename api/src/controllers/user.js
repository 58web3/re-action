const UserService = require("../services/user");
const UserWalletService = require("../services/user_wallet");

const getUserByKey = async function (req, res) {
  try {
    // get parameter
    const userId = req.params.user_id;
    const publicKey = req.user.wallets[0].public_key;

    // Check if the Requester and Resource Owner are the same
    const userWallet = await UserService.getUserWalletByPublicKey(publicKey);
    if (userWallet.user_id !== userId) {
      return res.status(403).json({ "message": "Forbidden" })
    }

    // call service method
    const user = await UserService.getUserByKey(userId);
    if (!user)
      return res.status(404).json({ "message": "Not Found" });

    const userNFT = await UserService.getUserNFTs(userId);
    if (userNFT.count === 0) {
      return res.status(403).json({ "message": "Forbidden" })
    }

    // return response
    return res.status(200).json(user);
  } catch (e) {
    logger.error(e);
    res.status(500).json({
      message: 'Service Unavailable',
    });
  }
};

const createUser = async function (req, res) {
  try {
    // get parameter
    const requestBody = req.body;
    const verificationCode = requestBody.verification_code;
    const walletAddress = requestBody.wallet_address;

    const publicKey = req.user.wallets[0].public_key;
    const checkUserWallet = await UserWalletService.getUserWalletByPublicKey(publicKey);
    if (checkUserWallet) {
      return res.status(409).json({ message: 'Conflict' });
    }

    const result = await UserService.createUser(verificationCode, walletAddress, req.user, res);

    if (result.statusCode >= 400) {
      return result;
    }

    // return response
    res.status(201).json({
      message: "Success",
      id_info: {
        "key": "user_id",
        "value": result
      }
    });
  } catch (e) {
    logger.error(e);
    res.status(500).json({
      message: 'Service Unavailable',
    });
  }
};

module.exports = { getUserByKey, createUser };
