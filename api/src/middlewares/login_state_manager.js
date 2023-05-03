const UserModel = require("../models/user");
const UserService = require("../services/user");

module.exports.setLoggedIn = async function (userId) {
  return await UserModel.updateUserLoginState(userId, true);
}

module.exports.setLoggedOut = async function (req, res) {
  const publicKey = req.user.wallets[0].public_key;
  const userWallet = await UserService.getUserWalletByPublicKey(publicKey);
  await UserModel.updateUserLoginState(userWallet.user_id, false);
  res.status(200).json({
    message: "Success"
  });
  return;
}

module.exports.isLoggedIn = async function (req, res, next) {
  const publicKey = req.user.wallets[0].public_key;
  const userWallet = await UserService.getUserWalletByPublicKey(publicKey);
  const user = await UserModel.getUserByKey(userWallet.user_id);

  if(!user.is_logged_in){
    res.status(401).json({ name: 'Not logged In' });
    return;
  }
  return next();
}
