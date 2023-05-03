const LoginService = require("../services/login");
const UserService = require("../services/user");
const LoginState = require("../middlewares/login_state_manager");

const login = async function (req, res) {
  try {
    const publicKey = req.user.wallets[0].public_key;
    const userWallet = await UserService.getUserWalletByPublicKey(publicKey);
    if (!userWallet) {
      return res.status(404).json({
        message: "User Wallet Not Found"
      });
    }

    const result = await LoginService.login(userWallet.user_id, res);

    if (result.statusCode >= 400) {
      return result;
    }
    await LoginState.setLoggedIn(userWallet.user_id);

    res.status(200).json({
      message: "Success",
      transfer_fails: result.transferFails
    });
  } catch (e) {
    logger.error(e);
    res.status(500).json({
      message: 'Service Unavailable',
    });
  }
};

module.exports = {
  login,
};
