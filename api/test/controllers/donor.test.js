const request = require("supertest");
const app = require("../../src/app");
const { mockRequest, mockResponse } = require("../util/util")

jest.mock('../../src/services/donor');
const DonorService = require("../../src/services/donor");
const DonorController = require("../../src/controllers/donor");

const donorUrl = `/v1/verification-code/verify`;
const testVerificationCode = 'code';
const testDonorData = {
  code: testVerificationCode,
  token_name: "MD",
  owner_user_id: "0x123",
  token_id: "tokenId",
  token_uri: "ipfs://",
  is_verified: true,
  is_used: false,
  is_sent_token: false
}

describe("Bad request", () => {
  test("verifyCode(PUT API: /user) 400 error when no data in body", async () => {
    const response = await request(app).put(donorUrl).send({ verification_code: "" });
    expect(response.statusCode).toBe(400);
  });
});

describe("Success", () => {
  test("verifyCode(PUT API: /user) 200", async () => {
    const req = mockRequest(
      {},
      { verification_code: testVerificationCode },
    );

    DonorService.verifyCode = jest.fn((condition) => {
      return testDonorData;
    });

    const res = mockResponse();
    await DonorController.verifyCode(req, res);

    expect(res.statusCode).toBe(200);
  });
});

