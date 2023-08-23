global.dynamoose = require('../../src/init_dynamoose').dynamoose;
const UserNFTModel = require("../../src/models/user_nft");
const TokenModel = require("../../src/models/token");
const Web3Util = require("../../src/util/web3");

jest.mock("../../src/util/web3");

const walletAddress = "0x123456789";
const tokenAddress = "0x123123123";
const testUserId = "userId00001";
const tokenId = "1";
const symbol = "MD";
const tokenName = "MD";
const userNFTList = [
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
];

const userNFTData = {
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

describe("Success", () => {
  test('getUserNFTsByWalletAddress', async () => {
    const query = {};
    UserNFTModel.UserNFT.query = jest.fn((condition) => {
      return query;
    });
    query.exec = jest.fn(async () => {
      return userNFTList;
    });

    const userNFTs = await UserNFTModel.getUserNFTsByWalletAddress(walletAddress);

    expect(userNFTs[0].user_id).toBe("userId00001");
  });

  test('getUserNFT result is null', async () => {
    UserNFTModel.UserNFT.get = jest.fn((condition) => {
      return null;
    });

    const userNFT = await UserNFTModel.getUserNFT(testUserId, tokenAddress);

    expect(userNFT).toBeNull();
  });

  test('getUserNFT result is not null', async () => {
    UserNFTModel.UserNFT.get = jest.fn((condition) => {
      return userNFTData;
    });

    const userNFT = await UserNFTModel.getUserNFT(testUserId, tokenAddress);

    expect(userNFT.user_id).toBe("userId00001");
  });

  test('getUserNFTs result is null', async () => {
    const scan = {};
    UserNFTModel.UserNFT.scan = jest.fn((condition) => {
      return scan;
    });
    scan.exec = jest.fn(async () => {
      return [];
    });

    const userNFTs = await UserNFTModel.getUserNFTs(testUserId, [...tokenAddress]);
    expect(userNFTs.length).toBe(0);
  });

  test('getUserNFTs result is not null', async () => {
    const scan = {};
    UserNFTModel.UserNFT.scan = jest.fn((condition) => {
      return scan;
    });
    scan.exec = jest.fn(async () => {
      return userNFTList;
    });

    const userNFTs = await UserNFTModel.getUserNFTs(testUserId, [...tokenAddress]);

    expect(userNFTs[0].user_id).toBe("userId00001");
  });

  test('addUserNft create', async () => {
    UserNFTModel.UserNFT.get = jest.fn((condition) => {
      return null;
    });
    Web3Util.getTokenURI = jest.fn((condition) => {
      return 'tokenURI';
    });
    Web3Util.getImageUrl = jest.fn(()=> {
      return 'image';
    });

    UserNFTModel.UserNFT.create = jest.fn((condition) => {
      return userNFTData;
    });


    const userNFT = await UserNFTModel.addUserNft({
      userId: testUserId, 
      tokenAddress: tokenAddress,
      tokenId: tokenId,
      symbol: symbol,
      tokenName: tokenName,
      walletAddress: walletAddress
    });
    expect(userNFT.user_id).toBe(testUserId);
  });

  test('addUserNft not update because tokenId exist', async () => {
    UserNFTModel.UserNFT.get = jest.fn((condition) => {
      return userNFTData;
    });
    Web3Util.getTokenURI = jest.fn((condition) => {
      return 'tokenURI';
    });
    Web3Util.getImageUrl = jest.fn(() => {
      return 'image';
    });

    const userNFT = await UserNFTModel.addUserNft({
      userId: testUserId,
      tokenAddress: tokenAddress,
      tokenId: tokenId,
      symbol: symbol,
      tokenName: tokenName,
      walletAddress: walletAddress
    });
    
    expect(userNFT).toBe(undefined);
  });

  test('addUserNft update', async () => {
    const tokenIdNew = "2";

    UserNFTModel.UserNFT.get = jest.fn((condition) => {
      return userNFTData;
    });
    Web3Util.getTokenURI = jest.fn((condition) => {
      return null;
    });
    Web3Util.getImageUrl = jest.fn(() => {
      return null;
    });

    UserNFTModel.UserNFT.update = jest.fn((condition) => {
      return userNFTData;
    })
    const userNFT = await UserNFTModel.addUserNft({
      userId: testUserId,
      tokenAddress: tokenAddress,
      tokenId: tokenIdNew,
      symbol: symbol,
      tokenName: tokenName,
      walletAddress: walletAddress
    });
    expect(userNFT.user_id).toBe(testUserId);
  });
});
