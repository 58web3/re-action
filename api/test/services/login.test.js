global.dynamoose = require('../../src/init_dynamoose');

const { mockResponse } = require("../util/util");
const app = require("../../src/app");
const LoginService = require("../../src/services/login");
const DonorModel = require("../../src/models/donor");
const UserModel = require("../../src/models/user");
const UserWalletModel = require("../../src/models/user_wallet");
const TokenModel = require("../../src/models/token");
const UserNFTModel = require("../../src/models/user_nft");
const Web3Util = require('../../src/util/web3');
const SubscanUtil = require('../../src/util/subscan');
jest.mock('../../src/util/web3');

const verificationCode1 = "7938062e-2103-46af-a39e-89b7cf672894";
const verificationCode2 = "7938062e-2103-46af-a39e-89b7cf672894";
const testTokenName01 = "SBT_001";
const testTokenName02 = "NFT_002";
const testUserId = '7938062e-2103-46af-a39e-89b7cf672894';
const testWalletAddress = '0x67dF41d7Df0b07EcC985D87E093D48bbbab68E74';
const testContractAddress = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'

const testUserWalletData = {
  wallet_address: testWalletAddress,
  user_id: testUserId,
  created_at: 1673979629149,
  created_by: "",
  delete_flg: false
}
const testDonorListNFT = [
  {
    code: verificationCode1,
    token_name: testTokenName01,
    token_id: 10,
    is_sent_token: false,
    created_at: 1673979629149,
    created_by: "",
    delete_flg: false
  },
  {
    code: verificationCode2,
    token_name: testTokenName02,
    token_id: 0,
    is_sent_token: true,
    created_at: 1673979629149,
    created_by: "",
    delete_flg: false
  }
]

const testDonorListSBT = [
  {
    code: verificationCode1,
    token_name: testTokenName01,
    token_id: 10,
    is_sent_token: true,
    created_at: 1673979629149,
    created_by: "",
    delete_flg: false
  },
  {
    code: verificationCode2,
    token_name: testTokenName02,
    token_id: 0,
    is_sent_token: false,
    created_at: 1673979629149,
    created_by: "",
    delete_flg: false
  }
]
const testUser = {
  user_id: testUserId,
  wallets: [
    {
      wallet_address: '0x...',
      wallet_public_key: 'publicKey'
    }
  ],
  is_sent_token: true,
  created_at: 1673979629149,
  created_by: "",
  delete_flg: false
}
const testDonor = {
  code: verificationCode2,
  token_name: testTokenName02,
  token_id: 0,
  is_sent_token: false,
  created_at: 1673979629149,
  created_by: "",
  delete_flg: false
}
const testTokenSBT = {
  token_name: testTokenName01,
  contract_address: testContractAddress,
  contract_type: 'SBT',
  token_id: 0,
  is_sent_token: false,
  created_at: 1673979629149,
  created_by: "",
  delete_flg: false
}
const testTokenNFT = {
  token_name: testTokenName02,
  contract_address: testContractAddress,
  contract_type: 'NFT',
  token_id: 0,
  is_sent_token: false,
  created_at: 1673979629149,
  created_by: "",
  delete_flg: false
}
const testUserNFT = {
  user_id: testUserId,
  token_address: testContractAddress,
  wallet_address: testWalletAddress,
  token_ids: [
    {
      token_id: "1",
      name: "SBT",
      symbol: "SBT",
      token_uri: "ipfs://",
      metadata: "{}",
      owner_of: testWalletAddress
    },
  ]
}

describe("Success", () => {
  test('login mint SBT', async () => {
    UserWalletModel.getUserWalletByWalletAddress = jest.fn(async (walletAddress) => {
      return testUserWalletData;
    });
    UserModel.getUserByKey = jest.fn(async (userId) => {
      return testUser;
    });
    DonorModel.getDonors = jest.fn(async (code) => {
      return testDonorListSBT;
    });
    TokenModel.getToken = jest.fn(async (tokenName) => {
      return testTokenSBT;
    });
    TokenModel.getAllTokens = jest.fn(async () => {
      return [testTokenSBT];
    });
    SubscanUtil.getAllNFTs = jest.fn(async () => {
      return [{
        contract: testContractAddress,
        holder: testWalletAddress,
        token_id: '1'
      }];
    });
    UserNFTModel.getUserNFTsByWalletAddress = jest.fn(async() => {
      return [testUserNFT];
    });
    UserNFTModel.upsertUserNFT = jest.fn();
    Web3Util.getTokenURI= jest.fn(async() => {
      return 'ipfs://';
    })

    Web3Util.mint = jest.fn(async () => {
      return {
        txhash: '0x...',
        messageError: ''
      }
    });

    UserNFTModel.addUserNft = jest.fn();

    DonorModel.update = jest.fn(async (userId) => {
      return testDonor;
    });
    const res = mockResponse();
    const result = await LoginService.login(testWalletAddress, res);

    for (const donor of result.sentTokenList) {
      expect(donor.token_name).toBe(testTokenName02);
    }
  });

  test('login transfer NFT', async () => {
    UserWalletModel.getUserWalletByWalletAddress = jest.fn(async (walletAddress) => {
      return testUserWalletData;
    });
    UserModel.getUserByKey = jest.fn(async (userId) => {
      return testUser;
    });
    DonorModel.getDonors = jest.fn(async (code) => {
      return testDonorListNFT;
    });
    TokenModel.getToken = jest.fn(async (tokenName) => {
      return testTokenNFT;
    });
    TokenModel.getAllTokens = jest.fn(async () => {
      return [testTokenNFT];
    });
    SubscanUtil.getAllNFTs = jest.fn(async () => {
      return [{
        contract: testContractAddress,
        holder: testWalletAddress,
        token_id: '1'
      }];
    });
    UserNFTModel.getUserNFTsByWalletAddress = jest.fn(async () => {
      return [testUserNFT];
    });
    UserNFTModel.upsertUserNFT = jest.fn();
    Web3Util.getTokenURI = jest.fn(async () => {
      return 'ipfs://';
    })

    Web3Util.transfer = jest.fn(async () => {
      return {
        txhash: '0x...',
        messageError: ''
      }
    });

    UserNFTModel.addUserNft = jest.fn();

    DonorModel.update = jest.fn(async () => {
      return testDonor;
    });
    const res = mockResponse();
    const result = await LoginService.login(testWalletAddress, res);

    for (const donor of result.sentTokenList) {
      expect(donor.token_name).toBe(testTokenName02);
    }
  });
});
