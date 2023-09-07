const { msalCca, msalClientCredentialRequest } = require('../init_verifiable_credential');
const uuid = require('uuid');
const issuanceConfig = require('../config/issuance_request_config.json');
const azureConfig = require('../config/azure_config.json');
const VCCallbackModel = require('../models/vc_callback');

issuanceConfig.registration.clientName = azureConfig.AppSettings["ClientName"];
issuanceConfig.authority = azureConfig.AppSettings["IssuerAuthority"];
issuanceConfig.manifest = azureConfig.AppSettings["CredentialManifest"];


const issuanceRequest = async function (req, res) {
    // get the Access Token
    let accessToken = "";
    try {
        const result = await msalCca.acquireTokenByClientCredential(msalClientCredentialRequest);
        if (result) {
            accessToken = result.accessToken;
        }
    } catch (e) {
        logger.error(e);
        console.log("failed to get access token");
        return res.status(401).json({
            message: 'Could not acquire credentials to access your Azure Key Vault'
        });
    }

    issuanceConfig.authority = azureConfig.AppSettings["IssuerAuthority"]
    //issuanceConfig.callback.url = `https://${req.hostname}/v1/issuer/issuance-request-callback`;
    // modify payload with new state, the state is used to be able to update the UI when callbacks are received from the VC Service
    const id = uuid.v4();
    await VCCallbackModel.upsertVCCallback(id, {}, 'issuer');
    issuanceConfig.callback.state = id;

    // check if pin is required, if found make sure we set a new random pin
    // pincode is only used when the payload contains claim value pairs which results in an IDTokenhint
    if (issuanceConfig.pin) {
        // don't use pin if user is on mobile device
        if (req.headers["user-agent"].includes("Android") || req.headers["user-agent"].includes('iPhone')) {
            delete issuanceConfig.pin;
        } else {
            issuanceConfig.pin.value = generatePin(issuanceConfig.pin.length);
        }
    }
    // here you could change the payload manifest and change the firstname and lastname
    if (!issuanceConfig.claims) {
        issuanceConfig.claims = {};
    }
    if (req.body.first_name) {
        issuanceConfig.claims.first_name = req.body.first_name;
    }
    if (req.body.last_name) {
        issuanceConfig.claims.last_name = req.body.last_name
    }
    if (req.body.email) {
        issuanceConfig.claims.email = req.body.email
    }
    if (req.body.wallet_address) {
        issuanceConfig.claims.wallet_address = req.body.wallet_address
    }

    console.log(issuanceConfig);

    const msIdentityHostName = "https://verifiedid.did.msidentity.com/v1.0/";
    const client_api_request_endpoint = `${msIdentityHostName}verifiableCredentials/createIssuanceRequest`;

    const payload = JSON.stringify(issuanceConfig);
    console.log(issuanceConfig, 'payload');
    const fetchOptions = {
        method: 'POST',
        body: payload,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': payload.length.toString(),
            'Authorization': `Bearer ${accessToken}`
        }
    };

    const response = await fetch(client_api_request_endpoint, fetchOptions);
    const resp = await response.json()
    resp.id = id;                              // add session id so browser can pull status
    resp.pinCode = issuanceConfig.pin.value;

    return resp;
}

const issuanceRequestCallback = async function (req, res) {
    const body = req.body;
    console.log(body);
    console.log(body.requestStatus);
    console.log('----------------------------------------------------------------');

    switch (body.requestStatus) {
        // this callback signals that the request has been retrieved (QR code scanned, etc)
        case "request_retrieved":
            body.message = "QR Code is scanned. Waiting for validation...";
            break;
        // this callback signals that issuance of the VC was successful and the VC is now in the wallet
        case "issuance_successful":
            body.message = "Credential successfully issued";
            break;
        // this callback signals that issuance did not complete. It could be for technical reasons or that the user didn't accept it
        case "issuance_error":
            body.message = body.error.message;
            break;
        default:
            console.log(`400 - Unsupported requestStatus: ${body.requestStatus}`);
            return res.status(400).json({ 'error': `Unsupported requestStatus: ${body.requestStatus}` });
    }

    const vcCallback = await VCCallbackModel.getVCCallback(body.state);
    if (!vcCallback) return res.status(400).json({ 'error': `Unknown state: ${body.state}` });

    await VCCallbackModel.upsertVCCallback(body.state, body);
    return;
}

const issuanceResponse = async function (req, res) {
    const id = req.query.id;
    if (!id) return res.status(400).json({ message: 'Bad Request' });

    const vcCallback = await VCCallbackModel.getVCCallback(id);
    if (!vcCallback) return res.status(400).json({ 'error': `Unknown state: ${id}` });

    return JSON.parse(vcCallback.value);
}

const getManifest = async function (req, res) {
    return azureConfig.AppSettings["CredentialManifest"];
}


const generatePin = (digits) => {
    let add = 1, max = 12 - add;
    max = Math.pow(10, digits + add);
    const min = max / 10; // Math.pow(10, n) basically
    const number = Math.floor(Math.random() * (max - min + 1)) + min;
    return ("" + number).substring(add);
}

module.exports = {
    issuanceRequest,
    issuanceResponse,
    issuanceRequestCallback,
    getManifest
};
