const DonorService = require("../services/donor");

const verifyCode = async function (req, res) {
  try {
    const verificationCode = req.body.verification_code;
    const result = await DonorService.verifyCode(verificationCode, res);

    if (result.statusCode >= 400) {
      return result;
    }

    res.status(200).json({
      message: "Success"
    });
  } catch (e) {
    logger.error(e);
    res.status(500).json({
      message: 'Service Unavailable',
    });
  }
}

module.exports = {
  verifyCode
};
