const { msalCca, msalClientCredentialRequest } = require('../init_verifiable_credential');
const issuanceConfig = require('../config/issuance_request_config.json');
const azureConfig = require('../config/azure_config.json');
const base64url = require('base64url');

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

    return resp;
}

const issuanceRequestCallback = async function (req, res) {
    const body = req.body;
    console.log(body);
    console.log(body.requestStatus);
    console.log('----------------------------------------------------------------');
    let cacheData;
    switch (body.requestStatus) {
        // this callback signals that the request has been retrieved (QR code scanned, etc)
        case "request_retrieved":
            cacheData = {
                "status": body.requestStatus,
                "message": "QR Code is scanned. Waiting for validation..."
            };
            break;
        // this callback signals that issuance of the VC was successful and the VC is now in the wallet
        case "issuance_successful":
            cacheData = {
                "status": body.requestStatus,
                "message": "Credential successfully issued"
            };
            break;
        // this callback signals that issuance did not complete. It could be for technical reasons or that the user didn't accept it
        case "issuance_error":
            cacheData = {
                "status": body.requestStatus,
                "message": body.error.message,
                "payload": body.error.code
            };
            break;
        default:
            console.log(`400 - Unsupported requestStatus: ${body.requestStatus}`);
            return res.status(400).json({ 'error': `Unsupported requestStatus: ${body.requestStatus}` });
    }
    return;
        // // store the session state so the UI can pick it up and progress
        // mainApp.sessionStore.get(body.state, (error, session) => {
        //     if (session) {
        //         session.sessionData = cacheData;
        //         mainApp.sessionStore.set(body.state, session, (error) => {
        //             console.log("200 - OK");
        //             res.send();
        //         });
        //     } else {
        //         console.log(`400 - Unknown state: ${body.state}`);
        //         res.status(400).json({ 'error': `Unknown state: ${body.state}` });
        //         return;
        //     }
        // })
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

const generatePin = (digits) => {
    let add = 1, max = 12 - add;
    max = Math.pow(10, digits + add);
    const min = max / 10; // Math.pow(10, n) basically
    const number = Math.floor(Math.random() * (max - min + 1)) + min;
    return ("" + number).substring(add);
}

module.exports = {
    issuanceRequest,
    issuanceRequestCallback,
    presentationRequestCallback
};
