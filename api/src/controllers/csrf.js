const CsrfService = require("../services/csrf");
const UserService = require("../models/user_wallet");

const refreshCsrfToken = async function (req, res) {
  const publicKey = req.user.wallets[0].public_key;
  const userWallet = await UserService.getUserWalletByPublicKey(publicKey);   

  // return response
  const csrfToken = await CsrfService.refreshCsrfToken(userWallet?.user_id);
  res.status(200).json({
    csrf_token: csrfToken,
  });
};

module.exports = {
  refreshCsrfToken,
};
