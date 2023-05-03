global.dynamoose = require('../../src/init_dynamoose');

const WalletService = require("../../src/services/wallet");
const UserNFTModel = require("../../src/models/user_nft");

describe("Success", () => {
  test('getAllNFTs result is not null', async () => {
    UserNFTModel.getUserNFTsByWalletAddress = jest.fn((tokenAddress) => {
      return [
        {
          user_id: "userId00001",
          token_address: "0x123456789",
          wallet_address: "0x123456789",
          token_ids: [
            {
              token_id: "1",
              name: "SGW",
              symbol: "SGW",
              token_uri: "https://",
              metadata: "{}",
              owner_of: "0x123456789"
            }
          ],
          created_at: 1,
          created_by: "70196fc9-053f-47cb-b760-29f51d977966",
          updated_at: 2,
          updated_by: "70196fc9-053f-47cb-b760-29f51d977966"
        }
      ]
    });

    const userAddress = '0x123456789';
    const count = 50;
    const page = 0;
    const userNFTs = await WalletService.getAllNFTs(userAddress, count, page);

    expect(userNFTs.total).toBe(1);
    expect(userNFTs.list.length).toBe(1);
  });
});
