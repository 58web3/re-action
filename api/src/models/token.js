const TokenSchema = require("../schemas/token");

// Get model using schema
const Token = dynamoose.model("Token", TokenSchema);

const getToken = async (tokenName) => {
  return Token.get(tokenName);
};

const getAllTokens = async () => {
  return Token.scan().exec();
};

module.exports = {
  getToken,
  getAllTokens
};
