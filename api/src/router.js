const express = require("express");
const router = express.Router();
const user = require("./controllers/user");
const wallet = require("./controllers/wallet");
const csrf = require("./controllers/csrf");
const donor = require("./controllers/donor");
const login = require("./controllers/login");
const issuer = require("./controllers/issuer");
const verifier = require("./controllers/verifier");

const { validator } = require("./middlewares/validator");
const { verifyCSRFToken } = require("./middlewares/verify_csrf_token");
const {
  verifyIdToken,
} = require("./middlewares/verify_idtoken");
const { grantAccess } = require("./middlewares/grant_access");
const { Action, Resource } = require("./util/constant");
const validates = require("./validates/validates");
const loginState = require("./middlewares/login_state_manager");

// User
router.get(
  "/user/:user_id",
  verifyIdToken,
  verifyCSRFToken,
  loginState.isLoggedIn,
  user.getUserByKey
);
router.post(
  "/user",
  validator(validates.createUser),
  verifyIdToken,
  verifyCSRFToken,
  user.createUser
);

//Donor
router.put(
  "/verification-code/verify",
  validator(validates.verifyCode),
  donor.verifyCode
);

// Wallet
router.get(
  "/wallet/:wallet_address/user_id",
  verifyIdToken,
  verifyCSRFToken,
  grantAccess(Action.readAny, Resource.Wallet),
  wallet.getUserIdByWalletAddress
);
router.get(
  "/wallet/:wallet_address/nft",
  verifyIdToken,
  verifyCSRFToken,
  grantAccess(Action.readAny, Resource.Wallet),
  loginState.isLoggedIn,
  wallet.getAllNFTs
);

// CSRF
router.get(
  "/csrf",
  verifyIdToken,
  grantAccess(Action.readAny, Resource.CSRF),
  csrf.refreshCsrfToken
);

// Login
router.post(
    "/login",
    verifyIdToken,
    verifyCSRFToken,
    login.login
);

// Logout
router.post(
    "/logout",
    verifyIdToken,
    verifyCSRFToken,
    loginState.setLoggedOut
);

// Request Issuing VC
router.post(
  "/issuer/issuance-request",
  verifyIdToken,
  issuer.issuanceRequest
);

router.post(
  "/issuer/issuance-request-callback",
  issuer.issuanceRequestCallback
);

router.get(
  "/issuer/issuance-response",
  verifyIdToken,
  issuer.issuanceResponse
);

router.get(
  "/issuer/get-manifest",
  verifyIdToken,
  issuer.getManifest
);

// Verifiable Presentation
router.get(
  "/verifier/presentation-request",
  verifyIdToken,
  verifier.presentationRequest
);

router.post(
  "/verifier/presentation-request-callback",
  verifier.presentationRequestCallback
);

router.get(
  "/verifier/presentation-response",
  verifier.presentationResponse
);

router.post(
  "/verifier/presentation-response-b2c",
  verifier.presentationResponseB2C
);

router.get(
  "/verifier/get-presentation-details",
  verifier.getPresentationDetails
// Notion
router.post(
    "/upload-media",
    verifyIdToken,
    verifyCSRFToken,
    notion.createPage
);

module.exports = router;
