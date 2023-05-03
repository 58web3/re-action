const UserWalletModel = require("../models/user_wallet")

const getUserWalletByWalletAddress = async (walletAddress) => {
  return await UserWalletModel.getUserWalletByWalletAddress(walletAddress);
}

const getUserWalletByPublicKey = async (publicKey) => {
  return await UserWalletModel.getUserWalletByPublicKey(publicKey);
}

module.exports = {
  getUserWalletByWalletAddress,
  getUserWalletByPublicKey,
};
