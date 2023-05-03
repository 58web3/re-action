const jose = require('jose');

module.exports.verifyIdToken = async function (req, res, next) {
  try {
    // https://web3auth.io/docs/server-side-verification/social-login-users#verifying-idtoken-in-backend

    // passed from the frontend in the Authorization header
    const idToken = req.headers.jwt?.split(' ')[1];
    const publicKey = req.headers.public_key;

    // Get the JWK set used to sign the JWT issued by Web3Auth
    const jwks = jose.createRemoteJWKSet(new URL("https://api.openlogin.com/jwks"));

    // Verify the JWT using Web3Auth's JWKS
    const jwtDecoded = await jose.jwtVerify(idToken, jwks, { algorithms: ["ES256"] });
    if ((jwtDecoded.payload).wallets[0].public_key === publicKey) {
      // Verified
      req.user = jwtDecoded.payload;
      return next();
    } else {
      res.status(401).json({ name: 'Unauthorized' })
    }
  } catch (e) {
    try {
      const idToken = req.headers.jwt?.split(' ')[1];
      // get publicAddress as public key
      const publicAddress = req.headers.public_key;

      // Get the JWK set used to sign the JWT issued by Web3Auth
      const jwks = jose.createRemoteJWKSet(new URL("https://authjs.web3auth.io/jwks"));

      // Verify the JWT using Web3Auth's JWKS
      const jwtDecoded = await jose.jwtVerify(idToken, jwks, { algorithms: ["ES256"] });

      // Incase of Non-Torus Users
      // Checking Wallet's `publicAddress` against the decoded JWT wallet's address
      if ((jwtDecoded.payload).wallets[0].address === publicAddress) {
        (jwtDecoded.payload).wallets[0].public_key = (jwtDecoded.payload).wallets[0].address;
        // Verified
        req.user = jwtDecoded.payload;

        return next();
      } else {
        res.status(401).json({ name: 'Unauthorized' });
        return;
      }
    } catch (ex) {
      res.status(401).json({ name: 'Unauthorized' });
      return;
    }
  }
}



