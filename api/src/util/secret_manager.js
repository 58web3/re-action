const secretsManager = require("@aws-sdk/client-secrets-manager");
global.logger = require("./logger");

const getSecretByKey = async (secretName, region) => {
  const client = new secretsManager.SecretsManagerClient({
    region: region,
  });

  let response;
  try {
    response = await client.send(
      new secretsManager.GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    logger.error(error)
    return null;
  }
  const secret = response.SecretString;
  return secret;
};

module.exports = {
  getSecretByKey,
};
