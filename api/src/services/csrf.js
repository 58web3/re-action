const Tokens = require("csrf");
const CsrfModel = require("../models/csrf");

const refreshCsrfToken = async function (userId) {
  const tokens = new Tokens();
  const secret = tokens.secretSync();
  const csrfToken = tokens.create(secret);

  await CsrfModel.addCsrfToken(csrfToken, secret, userId)

  return csrfToken;
};

module.exports = {
  refreshCsrfToken,
};
