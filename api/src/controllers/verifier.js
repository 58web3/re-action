const VerifierService = require("../services/verifier");

const presentationRequest = async function (req, res) {
    const result = await VerifierService.presentationRequest(req, res);
    if (result.statusCode >= 400) {
        return result;
    }

    res.status(200).json({
        message: "Success",
        data: result 
    });
};


const presentationRequestCallback = async function (req, res) {
    const result = await VerifierService.presentationRequestCallback(req, res);
    if (result?.statusCode >= 400) {
        return result;
    }

    res.status(200).json({
        message: "Success",
        data: result
    });
};

module.exports = {
    presentationRequest,
    presentationRequestCallback
};
