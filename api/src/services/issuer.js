const { msalCca, msalClientCredentialRequest } = require('../init_verifiable_credential');
const issuanceConfig = require('../config/issuance_request_config.json');
const azureConfig = require('../config/azure_config.json');

issuanceConfig.registration.clientName = "Node.js Verified ID sample";
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
    issuanceConfig.callback.url = `https://${req.hostname}/v1/issuer/issuance-request-callback`;
    // modify payload with new state, the state is used to be able to update the UI when callbacks are received from the VC Service
    // issuanceConfig.callback.state = id;
    
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
    if (issuanceConfig.claims) {
        if (issuanceConfig.claims.given_name) {
            issuanceConfig.claims.given_name = "Megan";
        }
        if (issuanceConfig.claims.family_name) {
            issuanceConfig.claims.family_name = "Bowen";
        }
    }

    const msIdentityHostName = "https://verifiedid.did.msidentity.com/v1.0/";
    const client_api_request_endpoint = `${msIdentityHostName}verifiableCredentials/createIssuanceRequest`;

    const payload = JSON.stringify(issuanceConfig);
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

    return resp;
}


const generatePin = (digits) => {
    let add = 1, max = 12 - add;
    max = Math.pow(10, digits + add);
    const min = max / 10; // Math.pow(10, n) basically
    const number = Math.floor(Math.random() * (max - min + 1)) + min;
    return ("" + number).substring(add);
}

module.exports = {
    issuanceRequest
};
