require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades');
require('@nomiclabs/hardhat-web3');
require('@rumblefishdev/hardhat-kms-signer');

const { setTimeout } = require('timers/promises');

let envFileName = '';
if (process.env.NODE_ENV === 'staging') {
  envFileName = './.env.staging';
} else if (process.env.NODE_ENV === 'production') {
  envFileName = './.env.production';
} else {
  envFileName = './.env.development';
}

require('dotenv').config({ path: envFileName });
const config =process.env;

const AWS = require('aws-sdk');
AWS.config.update({region: 'ap-northeast-1'});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: 'http://localhost:8545',
      chainId: 31337,
    },
    shibuya: {
      url: config.SHIBUYA_RPC,
      chainId: parseInt(config.SHIBUYA_CHAIN_ID),
      accounts: config.ADMIN_PRIVATE_KEY ? [config.ADMIN_PRIVATE_KEY] : []
    },
    shibuya_kms: {
      url: config.SHIBUYA_RPC,
      chainId: parseInt(config.SHIBUYA_CHAIN_ID),
      kmsKeyId: config.ADMIN_KMS_ID,
      minMaxFeePerGas: 1600000000,
      mixMaxPriorityFeePerGas: 1200000000,
      timeout: 200000
    }
  },
  solidity: {
    compilers: [
      {
        version: '0.8.2',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.1',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  mocha: {
    timeout: 40000,
  }
};
