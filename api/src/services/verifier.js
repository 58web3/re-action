const { msalCca, msalClientCredentialRequest } = require('../init_verifiable_credential');
const uuid = require('uuid');
const presentationConfig = require('../config/presentation_request_config.json');
const azureConfig = require('../config/azure_config.json');
const base64url = require('base64url');
const VCCallbackModel = require('../models/vc_callback');

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

    const id = uuid.v4();
    presentationConfig.includeQRCode = "false" == req.query.include_qr_code ? false : true;
    presentationConfig.authority = azureConfig.AppSettings["VerifierAuthority"]
    //presentationConfig.callback.url = `https://${req.hostname}/v1/verifier/presentation-request-callback`;
    presentationConfig.callback.state = id;

    await VCCallbackModel.upsertVCCallback(id, {}, 'verifier');
    presentationConfig.callback.state = id;

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
    resp.id = id;                              // add session id so browser can pull status

    return resp;
}

const presentationRequestCallback = async function (req, res) {
    const body = req.body;
    console.log(body);
    console.log('--------------------------------presentationRequestCallback--------------------------------');
    switch (body.requestStatus) {
        // this callback signals that the request has been retrieved (QR code scanned, etc)
        case "request_retrieved":
            body.message = "QR Code is scanned. Waiting for validation..."
            break;
        // this callback signals that presentation has happened and VerifiedID have verified it
        case "presentation_verified":
            body.message =  "Presentation received";

            // get details on VC, when it was issued, when it expires, etc
            if (body.receipt && body.receipt.vp_token) {
                let vp_token = JSON.parse(base64url.decode(body.receipt.vp_token.split(".")[1]));
                let vc = JSON.parse(base64url.decode(vp_token.vp.verifiableCredential[0].split(".")[1]));
                body.jti = vc.jti;
                body.iat = vc.iat;
                body.exp = vc.exp;
            }
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

const presentationResponse = async function (req, res) {
    const id = req.query.id;
    if (!id) return res.status(400).json({ message: 'Bad Request' });

    const vcCallback = await VCCallbackModel.getVCCallback(id);
    if (!vcCallback) return res.status(400).json({ 'error': `Unknown state: ${id}` });

    return JSON.parse(vcCallback.value);
}

const presentationResponseB2C = async function (req, res) {
    const id = req.body.id;
    if (!id) return res.status(400).json({ message: 'Bad Request' });

    const vcCallback = await VCCallbackModel.getVCCallback(id);
    if (!vcCallback) return res.status(400).json({ 'error': `Unknown state: ${id}` });
    const presentationResponse = JSON.parse(vcCallback.value);
    if (presentationResponse.requestStatus === "presentation_verified") {
        const claims = presentationResponse.verifiedCredentialsData[0].claims;
        const claimsExtra = {
            'vcType': presentationConfig.requestedCredentials[0].type,
            'vcIss': presentationResponse.verifiedCredentialsData[0].authority,
            'vcSub': presentationResponse.subject,
            'vcKey': presentationResponse.subject.replace("did:ion:", "did.ion.").split(":")[0]
        };
        const responseBody = { ...claimsExtra, ...claims }; // merge the two structures

        return responseBody;   
    } else {
        console.log('Will return 409 to B2C');
        return res.status(409).json({
            'version': '1.0.0',
            'status': 400,
            'userMessage': 'Verifiable Credentials not presented'
        });   
    }
}


const getPresentationDetails = async function (req, res) {
    const id = req.query.id;
    if (!id) return res.status(400).json({ message: 'Bad Request' });

    return {
        clientName: presentationConfig.registration.clientName,
        purpose: presentationConfig.registration.purpose,
        VerifierAuthority: azureConfig.AppSettings["VerifierAuthority"],
        type: presentationConfig.requestedCredentials[0].type,
        acceptedIssuers: presentationConfig.requestedCredentials[0].acceptedIssuers    
    }
}


module.exports = {
    presentationRequest,
    presentationRequestCallback,
    presentationResponse,
    presentationResponseB2C,
    getPresentationDetails
};
