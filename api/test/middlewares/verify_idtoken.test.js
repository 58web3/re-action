
global.dynamoose = require('../../src/init_dynamoose');
const verifyIdToken = require("../../src/middlewares/verify_idtoken");
const jose = require('jose');

const { mockRequest, mockResponse } = require("../util/util")

describe("verifyIdToken", () => {
  test("verifyIdToken return statusCode 401", async () => {
    const req = mockRequest();

    const res = mockResponse();
    const next = jest.fn();

    await verifyIdToken.verifyIdToken(req, res, next);
    expect(res.statusCode).toBe(401);
  });

});