const request = require("supertest");
const app = require("../../src/app");
const { mockRequest, mockResponse } = require("../util/util")

jest.mock('uuid');
const uuid = require('uuid');

jest.mock('../../src/services/user');
const UserService = require("../../src/services/user");
const UserController = require("../../src/controllers/user");
const UserWalletService = require("../../src/services/user_wallet");
const testUserId = "user0001";

const postUrl = `/v1/user/`;
const getUrl = `/v1/user/` + testUserId;

const newUser = {
  wallet_address: '0x12345678',
  verification_code: 'code'
}
const testUserWalletParam = {
  wallets: [
    {
      public_key: 'public_key'
    }
  ]
}
// https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/

describe("Confirm authorize", () => {
  test("getUserByKey(Get API: /user/{user_id}) 401 error when no authorization in header", async () => {
    const response = await request(app).get(getUrl);
    expect(response.statusCode).toBe(401);
  });

  test("getUserByKey(Get API: /post/{user_id}) 401 error when authorization is not right", async () => {
    const response = await request(app).get(getUrl).set({ Authorization: "dummy" });
    expect(response.statusCode).toBe(401);
  });

  test("createUser(Post API: /user) 401 error when no authorization in header", async () => {
    const response = await request(app).post(postUrl).send(newUser);
    expect(response.statusCode).toBe(401);
  });

  test("createUser(Post API: /user) 401 error when authorization is not right", async () => {
    const response = await request(app).post(postUrl).send(newUser).set({ Authorization: "dummy" });
    expect(response.statusCode).toBe(401);
  });
});

describe("Bad request", () => {
  test("createUser(Post API: /user) 400 error when body wrong data or missing data", async () => {
    const fakeUserData = {}
    const response = await request(app).post(postUrl).send(fakeUserData);
    expect(response.statusCode).toBe(400);
  });
});

describe("Not found", () => {
  test("getUserByKey (Get API: /user/{user_id}) 404 error when no data in DB", async () => {
    UserService.getUserByKey = jest.fn((userId) => {
      return null;
    });
    UserService.getUserWalletByPublicKey = jest.fn(() => {
      return {user_id: testUserId};
    });

    const req = mockRequest(
      { user_id: testUserId }
    );
    req.user = testUserWalletParam;
    const res = mockResponse();

    await UserController.getUserByKey(req, res);
    expect(res.statusCode).toBe(404);
  });
})

describe("Success", () => {
  test("getUserByKey (Get API: /user/{user_id}) OK when can search data in DB", async () => {
    UserService.getUserByKey = jest.fn((userId) => {
      return { user_id: testUserId }
    });
    UserService.getUserWalletByPublicKey = jest.fn(() => {
      return {user_id: testUserId};
    });

    UserService.getUserNFTs = jest.fn((userId) => {
      return { count: 1 }
    });

    const req = mockRequest(
      { user_id: testUserId }
    );
    req.user = testUserWalletParam;
    const res = mockResponse();
    await UserController.getUserByKey(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.data.user_id).toBe(testUserId);
  })

  test("createUser(Post API: /user) created user", async () => {
    const createdUserId = "user0002";
    UserWalletService.getUserWalletByPublicKey = jest.fn(() => {
      return null;
    });

    const req = mockRequest(
      {},
      newUser,
    );
    const res = mockResponse();
    req.user = {
      wallets: [
        {
          public_key: 'public_key'
        }
      ]
    }
    uuid.v4(() => {
      return createdUserId;
    });
    UserService.createUser = jest.fn((requestBody) => {
      return createdUserId;
    });

    await UserController.createUser(req, res);

    expect(res.statusCode).toBe(201);
    expect(res.data.id_info.key).toBe("user_id")
    expect(res.data.id_info.value).toBe(createdUserId)
  });
});


