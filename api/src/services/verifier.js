const { msalCca, msalClientCredentialRequest } = require('../init_verifiable_credential');
const presentationConfig = require('../config/presentation_request_config.json');
const azureConfig = require('../config/azure_config.json');

presentationConfig.registration.clientName = "Node.js Verified ID sample";


const presentationRequest = async function (req, res) {
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

    presentationConfig.authority = azureConfig.AppSettings["VerifierAuthority"]
    presentationConfig.callback.url = `https://${req.hostname}/v1/verifier/presentation-request-callback`;
    const msIdentityHostName = "https://verifiedid.did.msidentity.com/v1.0/";

    const client_api_request_endpoint = `${msIdentityHostName}verifiableCredentials/createPresentationRequest`;
    console.log(presentationConfig);
    const payload = JSON.stringify(presentationConfig);
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

module.exports = {
    presentationRequest
};
