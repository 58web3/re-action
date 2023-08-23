global.dynamoose = require('../../src/init_dynamoose').dynamoose;

const testDaoId = "dao12345";
const testUserId = 'user12345';
const testWalletAddress = '0x3535353535353535353535353535353535353535';
const testTokenAddress = '0x00c5496aEe77C1bA1f0854206A26DdA82a81D6D8';
jest.mock('uuid');
const uuid = require("uuid");

const UserModel = require("../../src/models/user");
const UserWalletModel = require("../../src/models/user_wallet");
const TokenModel = require("../../src/models/token");
const DonorModel = require("../../src/models/donor");
const UserService = require("../../src/services/user");
jest.mock('../../src/util/web3');

const testVerificationCode = 'code';
const testDonor = {
  code: testVerificationCode,
  token_name: "MD",
  owner_user_id: "0x123",
  token_id: "tokenId",
  token_uri: "ipfs://",
  is_verified: true,
  is_used: false,
  is_sent_token: false
}
const testUserData = {
  user_id: testUserId,
  nickname: "nickname",
  profile_image_url: "profile_image_url",
  type_of_login: "type_of_login",
  unread_notification_ids: ["unread_notification_id"],
  user_role_ids: ["admin_role_id"],
  wallets: [{
    wallet_public_key: "p12345",
    wallet_address: testWalletAddress
  }]
};

const updateUserData = {
  wallets: [],
}
describe("Success", () => {
  test('getUserByKey result is null', async () => {
    UserModel.getUserByKey = jest.fn(async (userId) => {
      return null;
    });

    const user = await UserService.getUserByKey(testUserId);

    expect(user).toBeNull();
  });

  test('getUserByKey full result is not null', async () => {
    UserModel.getUserByKey = jest.fn((userId) => {
      return testUserData;
    });

    TokenModel.getTokens = jest.fn(async () => {
      return [ {
        token_address: testTokenAddress,
        contract_type: "ERC20"
      } ];
    });

    const user = await UserService.getUserByKey(testDaoId, testUserId, "1");
    expect(user.user_id).toBe(testUserId);
  });

  test('getUserByKey part result is not null', async () => {
    UserModel.getUserByKey = jest.fn((userId) => {
      return testUserData;
    });

    TokenModel.getTokens = jest.fn(async () => {
      return [ {
        token_address: testTokenAddress,
        contract_type: "ERC20"
      } ];
    });

    const user = await UserService.getUserByKey(testDaoId, testUserId, "0");
    expect(user.user_id).toBe(testUserId);
  });

  test('getUserByKey wallets is null', async () => {
    UserModel.getUserByKey = jest.fn((userId) => {
      return testUserData;
    });

    TokenModel.getTokens = jest.fn(async () => {
      return [{
        token_address: testTokenAddress,
        contract_type: "ERC20"
      }];
    });

    const user = await UserService.getUserByKey(testDaoId, testUserId, "0");
    expect(user.user_id).toBe(testUserId);
    expect(user.wallets[0].wallet_address).toBe(testWalletAddress);
  });

  test('createUser', async () => {
    uuid.v4(() => {
      return testUserId;
    });
    const idTokenUser = {
      wallets: [{
        public_key: 'publicKey'
      }],
    }

    DonorModel.getDonorByCode = jest.fn(async() => {
      return testDonor;
    });

    UserModel.createUser = jest.fn(async (userData) => {
      return {
        user_id: testUserId,
        ...userData
      };
    });
    UserWalletModel.createUserWallet = jest.fn();
    DonorModel.update = jest.fn();

    const userId = await UserService.createUser(testVerificationCode, testWalletAddress, idTokenUser);

    expect(userId).toBe(testUserId);
  });

  test('updateUser', async () => {
    UserModel.updateUser = jest.fn(async (userId, userData) => {
      return {
        user_id: testUserId,
        ...updateUserData
      };
    });
    const user = await UserService.updateUser(updateUserData);
    expect(user.user_id).toBe(testUserId);
  });

});
