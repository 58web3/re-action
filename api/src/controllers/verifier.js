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

const presentationResponse = async function (req, res) {
    const result = await VerifierService.presentationResponse(req, res);
    if (result?.statusCode >= 400) {
        return result;
    }

    res.status(200).json({
        message: "Success",
        data: result
    });
}


const presentationResponseB2C = async function (req, res) {
    const result = await VerifierService.presentationResponseB2C(req, res);
    if (result?.statusCode >= 400) {
        return result;
    }

    res.status(200).json({
        message: "Success",
        data: result
    });
}

const getPresentationDetails = async function (req, res) {
    const result = await VerifierService.getPresentationDetails(req, res);
    if (result?.statusCode >= 400) {
        return result;
    }

    res.status(200).json({
        message: "Success",
        data: result
    });
}

module.exports = {
    presentationRequest,
    presentationResponse,
    presentationRequestCallback,
    presentationResponseB2C,
    getPresentationDetails
};
