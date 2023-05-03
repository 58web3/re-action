const UserWalletSchema = require("../schemas/user_wallet");

// Get model using schema
const UserWallet = dynamoose.model("UserWallet", UserWalletSchema);

const getUserWalletByUserId = async(userId) => {
  const searchResult = await UserWallet.scan("user_id").eq(userId).exec();
  if (searchResult.count == 0) {
    return null;
  }

  return searchResult.toJSON()[0]?.wallet_address;
}

const getUserWalletByWalletAddress = async (walletAddress) => {
  return UserWallet.get({ wallet_address: walletAddress });
};

const getUserWalletByPublicKey = async (publicKey) => {
  const searchResult = await UserWallet.query("wallet_public_key").eq(publicKey).exec();
  if (searchResult.count == 0) {
    return null;
  }
  return searchResult.toJSON()[0];
};

const createUserWallet = async (userId, walletAddress, walletPublicKey) => {
  const systemDate = new Date().getTime();
  const userWallet = await UserWallet.create({
    wallet_address: walletAddress,
    user_id: userId,
    wallet_public_key: walletPublicKey,
    created_at: systemDate,
    created_by: userId,
    updated_at: systemDate,
    updated_by: userId,
    delete_flg: false
  });
  return userWallet;
};

const updateUserWallet = async (userId, walletAddress, walletPublicKey) => {
  const systemDate = new Date().getTime();
  const userWallet = await UserWallet.update({ wallet_address: walletAddress }, {
    user_id: userId,
    wallet_public_key: walletPublicKey,
    updated_at: systemDate,
    updated_by: userId,
    delete_flg: false
  });
  return userWallet;
};

module.exports = {
  getUserWalletByWalletAddress,
  createUserWallet,
  updateUserWallet,
  getUserWalletByPublicKey,
  getUserWalletByUserId,
  UserWallet,
};
