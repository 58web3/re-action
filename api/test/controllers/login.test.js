const request = require("supertest");
const app = require("../../src/app");
const { mockRequest, mockResponse } = require("../util/util")

jest.mock('../../src/services/login');
const LoginService = require("../../src/services/login");
const UserService = require("../../src/services/user");
const LoginController = require("../../src/controllers/login");
const loginState = require("../../src/middlewares/login_state_manager");

const testPublicKey = 'publicKey';
const testUserId = 'user12345';
const loginUrl = `/v1/login`;

describe("Bad request", () => {
  test("login(DAO API: /login) 401 error when no authorization in header", async () => {
    const response = await request(app).post(loginUrl).send({});
    expect(response.statusCode).toBe(401);
  });

  test("login(DAO API: /login) 401 error when authorization is not right", async () => {
    const response = await request(app).post(loginUrl).send({}).set({ Authorization: "dummy" });
    expect(response.statusCode).toBe(401);
  });
});

describe("Success", () => {
  test("login(GET API: /login) 200", async () => {
    const req = mockRequest();
    req.user = { wallets: [{ public_key: testPublicKey }] };
    const res = mockResponse();
    UserService.getUserWalletByPublicKey = jest.fn((publicKey) => {
      return { user_id: testUserId };
    });
    LoginService.login = jest.fn((userId, res) => {
      return [{}];
    });
    loginState.setLoggedIn = jest.fn((req) => {
      return;
    });
    await LoginController.login(req, res);
    expect(res.statusCode).toBe(200);
  });
});

