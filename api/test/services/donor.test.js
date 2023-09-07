global.dynamoose = require('../../src/init_dynamoose').dynamoose;

const verificationCode = 'code';

const DonorModel = require("../../src/models/donor");
const DonorService = require("../../src/services/donor");
const { mockResponse } = require("../util/util")

const testCode = 'code';
const testDonorData = {
  code: testCode,
  token_name: "MD",
  owner_user_id: "0x123",
  token_id: "tokenId",
  token_uri: "ipfs://",
  is_verified: true,
  is_used: true,
  is_sent_token: false
}
const testUpdateDonor = {
  code: testCode,
  token_name: 'MD',
  token_id: 0,
  is_sent_token: true,
  created_at: 1673979629149,
  created_by: "",
  delete_flg: false
}

describe("Success", () => {
  test('verifyCode result is null', async () => {
    DonorModel.getDonorByCode = jest.fn(async (userId) => {
      return null;
    });
    const res = mockResponse();


    const donor = await DonorService.verifyCode(verificationCode, res);
    expect(donor.statusCode).toBe(404);
  });

  test('verifyCode result is already used', async () => {
    DonorModel.getDonorByCode = jest.fn(async (userId) => {
      return {
        ...testDonorData,
        is_used: true
      };
    });
    const res = mockResponse();

    const donor = await DonorService.verifyCode(verificationCode, res);

    expect(donor.statusCode).toBe(400);
  });

  test('verifyCode result success', async () => {
    DonorModel.getDonorByCode = jest.fn(async (userId) => {
      return {
        ...testDonorData,
        is_used: false
      };
    });
    DonorModel.update = jest.fn((userId, userData) => {
      return testUpdateDonor;
    })

    const donor = await DonorService.verifyCode(verificationCode);
    expect(donor.code).toBe(testCode);
  });
});
