const UserService = require("../services/user");
const { createPage } = require('../services/notion');

const createNotionPage = async function (req, res) {
    try {
        const publicKey = req.user.wallets[0].public_key;
        const userWallet = await UserService.getUserWalletByPublicKey(publicKey);
        if (!userWallet) {
            return res.status(404).json({
                message: "User Wallet Not Found"
            });
        }

        const url = await createPage(req.file, req.body.title, req.body.url, "", userWallet.wallet_address, req.body.latitude, req.body.longitude);

        if (!userWallet) {
            return res.status(404).json({
                message: "User Wallet Not Found"
            });
        }

        res.status(200).json({
            message: "Success",
            url: url
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
}


module.exports = {
    createNotionPage,
};
