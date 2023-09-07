global.dynamoose = require('../../src/init_dynamoose').dynamoose;

const testUserId = 'user12345';
const testTokenAddress = '0x00c5496aEe77C1bA1f0854206A26DdA82a81D6D8';

const UserWalletModel = require("../../src/models/user_wallet");
const UserWalletService = require("../../src/services/user_wallet");
jest.mock('../../src/util/web3');

describe("Success", () => {
  test('getUserWalletByWalletAddress result is null', async () => {
    UserWalletModel.getUserWalletByWalletAddress = jest.fn(async (userId) => {
      return null;
    });

    const userWallet = await UserWalletService.getUserWalletByWalletAddress(testUserId);

    expect(userWallet).toBeNull();
  });

  test('getUserWalletByWalletAddress result is not null', async () => {
    const userWalletData = {
      wallet_address: testTokenAddress,
      updated_at: 1673431069650,
      user_id: testUserId,
      updated_by: testUserId,
      created_at: 1673431069650,
      wallet_public_key: "038cff396ee2aa880299feb2c55772a1b3238edb2a98b70cf69b27a38b0481fd68",
      created_by: testUserId,
      delete_flg: false
    };

    UserWalletModel.getUserWalletByWalletAddress = jest.fn(async (userId) => {
      return userWalletData;
    });

    const userWallet = await UserWalletService.getUserWalletByWalletAddress(testUserId);

    expect(userWallet.user_id).toBe(testUserId);
  });
});
