const msal = require('@azure/msal-node');
const azureConfig = require('./config/azure_config.json');

// MSAL
const msalConfig = {
    auth: {
        clientId: azureConfig.AppSettings.ClientId,
        authority: `https://login.microsoftonline.com/${azureConfig.AppSettings.TenantId}`,
        clientSecret: azureConfig.AppSettings.ClientSecret,
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        }
    }
};

const cca = new msal.ConfidentialClientApplication(msalConfig);
const msalClientCredentialRequest = {
    scopes: ["3db474b9-6a0c-4840-96ac-1fceb342124f/.default"],
    skipCache: false,
};
module.exports.msalCca = cca;
module.exports.msalClientCredentialRequest = msalClientCredentialRequest;