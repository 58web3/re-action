const request = require("supertest");
const app = require("../../src/app");
const { mockRequest, mockResponse } = require("../util/util");

jest.mock('../../src/services/wallet');
const WalletService = require("../../src/services/wallet");
const WalletController = require("../../src/controllers/wallet");
const UserService = require("../../src/services/user");

const walletAddress = '0x123456789';

const getUrl = `/v1/wallet/${walletAddress}/nft`;

// https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/

describe("Confirm authorize", () => {
  test("getWhitelist(Get API: /wallet) 401 error when no authorization in header", async () => {
    const response = await request(app).get(getUrl);
    expect(response.statusCode).toBe(401);
  });

  test("getWhitelist(Get API: /wallet) 401 error when authorization is not right", async () => {
    const response = await request(app).get(getUrl).set({ Authorization: "dummy" });
    expect(response.statusCode).toBe(401);
  });
});

describe("Success", () => {
  test("getAllNFTs(Get API: /wallet/{wallet_address}/nft) OK when can search data in DB", async () => {

    WalletService.getAllNFTs = jest.fn(() => {
      return [{
        total: 0,
        list: []
      }];
    });
    UserService.getUserWalletByPublicKey = jest.fn(() => {
      return {wallet_address: walletAddress};
    });

    const req = mockRequest(
      {wallet_address: walletAddress},
      {},
      {count: 50, page: 0}
    );
    req.user = {
      wallets:[
        {public_key:"dummy"}
      ]
    };
    const res = mockResponse();

    await WalletController.getAllNFTs(req, res);
    expect(res.statusCode).toBe(200);

  });
});


