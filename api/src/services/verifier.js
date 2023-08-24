const { msalCca, msalClientCredentialRequest } = require('../init_verifiable_credential');
const presentationConfig = require('../config/presentation_request_config.json');
const azureConfig = require('../config/azure_config.json');
const base64url = require('base64url');

presentationConfig.registration.clientName = azureConfig.AppSettings["ClientName"];


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

const presentationRequestCallback = async function (req, res) {
    const body = req.body;
    console.log(body);
    console.log('--------------------------------presentationRequestCallback--------------------------------');
    let cacheData;
    switch (body.requestStatus) {
        // this callback signals that the request has been retrieved (QR code scanned, etc)
        case "request_retrieved":
            cacheData = {
                "status": body.requestStatus,
                "message": "QR Code is scanned. Waiting for validation..."
            };
            break;
        // this callback signals that presentation has happened and VerifiedID have verified it
        case "presentation_verified":
            cacheData = {
                "status": body.requestStatus,
                "message": "Presentation received",
                "payload": body.verifiedCredentialsData,
                "subject": body.subject,
                "presentationResponse": body
            };
            // get details on VC, when it was issued, when it expires, etc
            if (body.receipt && body.receipt.vp_token) {
                let vp_token = JSON.parse(base64url.decode(body.receipt.vp_token.split(".")[1]));
                let vc = JSON.parse(base64url.decode(vp_token.vp.verifiableCredential[0].split(".")[1]));
                cacheData.jti = vc.jti;
                cacheData.iat = vc.iat;
                cacheData.exp = vc.exp;
            }
            break;
        default:
            console.log(`400 - Unsupported requestStatus: ${body.requestStatus}`);
            return res.status(400).json({ 'error': `Unsupported requestStatus: ${body.requestStatus}` });
    }
    // // store the session state so the UI can pick it up and progress
    // mainApp.sessionStore.get(presentationResponse.state, (error, session) => {
    //     if (session) {
    //         session.sessionData = cacheData;
    //         mainApp.sessionStore.set(presentationResponse.state, session, (error) => {
    //             console.log("200 - OK");
    //             res.send();
    //         });
    //     } else {
    //         console.log(`400 - Unknown state: ${presentationResponse.state}`);
    //         res.status(400).json({ 'error': `Unknown state: ${presentationResponse.state}` });
    //         return;
    //     }
    // })
    return;
}
module.exports = {
    presentationRequest,
    presentationRequestCallback
};
