global.dynamoose = require('../../src/init_dynamoose').dynamoose;

jest.mock('uuid');
const UserWalletModel = require("../../src/models/user_wallet");
const testUserId = "user12345";

describe("Success", () => {
  test('getUserWalletByWalletAddress result is null', async () => {
    UserWalletModel.UserWallet.get = jest.fn((condition) => {
      return null;
    });

    const user = await UserWalletModel.getUserWalletByWalletAddress(testUserId);
    expect(user).toBeNull();
  });

  test('getUserWalletByWalletAddress result is not null', async () => {
    const userWalletData = { user_id: testUserId };

    UserWalletModel.UserWallet.get = jest.fn((condition) => {
      return userWalletData;
    });

    const userWallet = await UserWalletModel.getUserWalletByWalletAddress(testUserId);
    expect(userWallet.user_id).toBe(testUserId);
  })
});
