const Tokens = require("csrf");
const CsrfModel = require("../models/csrf");

module.exports.verifyCSRFToken = async function (req, res, next) {

  try {
    const headerToken = req.headers['x-xsrf-token'];
    const csrf = await CsrfModel.getCsrfToken(headerToken);

    const tokens = new Tokens();
    if (!tokens.verify(csrf?.secret, headerToken)) {
      return res.status(419).json({ message: 'Invalid CSRF Token' })
    } else {
      await CsrfModel.deleteCsrfToken(headerToken);
      return next();
    }
  } catch (e) {
    logger.error(e);
    return res.status(403).json({ message: 'Forbidden' });
  }
}
