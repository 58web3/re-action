const IssuerService = require("../services/issuer");

const issuanceRequest = async function (req, res) {
    const result = await IssuerService.issuanceRequest(req, res);
    if (result.statusCode >= 400) {
        return result;
    }

    res.status(200).json({
        message: "Success",
        data: result 
    });
};

module.exports = {
    issuanceRequest,
};