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

const issuanceRequestCallback = async function (req, res) {
    const result = await IssuerService.issuanceRequestCallback(req, res);
    if (result?.statusCode >= 400) {
        return result;
    }

    res.status(200).json({
        message: "Success",
        data: result
    });
};

const presentationRequestCallback = async function (req, res) {
    const result = await IssuerService.presentationRequestCallback(req, res);
    if (result?.statusCode >= 400) {
        return result;
    }

    res.status(200).json({
        message: "Success",
        data: result
    });
};

module.exports = {
    issuanceRequest,
    issuanceRequestCallback,
    presentationRequestCallback
};
