## API common: Check idToken
### Method parameter
- req: request
- res: response
- next: next(Express JS)
### Check logic
1. Get authorization from header. header sample: `Bearer xxx`
2. Spit authorization by blank
3. Get the second value(`xxx`) as idToken
4. Get public_key from header
5. Create a JWKSet with URL:`https://api.openlogin.com/jwks`
6. Call jwtVerify method to verify: 
   1. jwt: idToken 
   2. algorithms: `ES256`
7. If there is an error, throw 401 error
8. Get public_key from decoded jwt 
9. If public_key of header != public_key of decoded jwt, throw 401 error
10. If aggregateVerifier != `tkey-auth0-email-passwordless`, throw 401 error.

### Where to check
Set for all methods in router.js