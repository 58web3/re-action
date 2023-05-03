const UserModel = require("../models/user");
const UserWalletModel = require("../models/user_wallet");
const DonorModel = require("../models/donor");
const UserNFTModel = require("../models/user_nft");

const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Tokyo')

const getUserByKey = async (userId) => {
  const dbUser = await UserModel.getUserByKey(userId);
  if (!dbUser) {
    return null;
  }


  const reqData = {
    "message": "Success",
    "user_id": dbUser.user_id,
    "nickname": dbUser.nickname,
    "type_of_login": dbUser.type_of_login,
    "wallets": dbUser.wallets,
    "is_admin": dbUser.is_admin || false,
    "is_sent_token": dbUser.is_sent_token || false,
    "user_role_ids": dbUser.user_role_ids || [],
    "created_at": dbUser.created_at,
    "created_by": dbUser.created_by,
    "updated_at": dbUser.updated_at,
    "updated_by": dbUser.updated_by,
    "delete_flg": dbUser.delete_flg
  }

  return reqData;
}

const createUser = async (verificationCode, walletAddress, idTokenUser, res) => {
  const donor = await DonorModel.getDonorByCode(verificationCode);
  if (!donor) {
    return res.status(404).json({
      message: 'Verification code is not found'
    });
  }

  if (!donor.is_verified) {
    return res.status(403).json({
      message: 'Verification code is not verified'
    });
  }

  if (!donor.is_verified) {
    return res.status(403).json({
      message: 'Verification code is not verified'
    });
  }

  if (donor.is_used) {
    return res.status(400).json({
      message: 'Verification code is already used'
    });
  }

  const requestBody = {
    wallet_address: walletAddress
  }
  const user = await UserModel.createUser(requestBody, idTokenUser);
  const userWallet = await UserWalletModel.createUserWallet(user.user_id, walletAddress, idTokenUser.wallets[0].public_key);

  donor.is_used = true;
  donor.owner_user_id = user.user_id;
  await DonorModel.update(donor, user.user_id);

  return user.user_id;
}

const updateUser = async (userId, requestBody) => {
  const user = await UserModel.updateUser(userId, requestBody);
  // Need confirm multi wallets in future
  // for (const wallet of user.wallets) {
  //   await UserWalletModel.updateUserWallet(user.user_id, wallet.wallet_address, wallet.wallet_public_key, requestBody.email);
  // }
  return user;
}

const getUserWalletByPublicKey = async (publicKey) => {
  return await UserWalletModel.getUserWalletByPublicKey(publicKey)
}

const getUserNFTs = async (userId, tokenAddresses) => {
  return await UserNFTModel.getUserNFTs(userId, tokenAddresses)
}

module.exports = {
  getUserByKey,
  createUser,
  updateUser,
  getUserWalletByPublicKey,
  getUserNFTs
};

