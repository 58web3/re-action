global.dynamoose = require('../../src/init_dynamoose').dynamoose;

jest.mock('uuid');
const DonorModel = require("../../src/models/donor");
const testCode = "bee17444-88d4-4cc8-b667-2e5759493c07";
const testTokenName = "NFT_002";
const testUserId = '7938062e-2103-46af-a39e-89b7cf672894';
const testDonorData = [
  {
    token_id: "tokenId",
    is_sent_token: false
  }
]
const testUpdateDonor = {
  code: testCode,
  token_name: testTokenName,
  token_id: 0,
  is_sent_token: true,
  created_at: 1673979629149,
  created_by: "",
  delete_flg: false
}

describe("Success", () => {
  test('getDonorsByCode result is null', async () => {
    DonorModel.Donor.get = jest.fn((condition) => {
      return null;
    });

    const donor = await DonorModel.getDonorByCode(testCode);
    expect(donor).toBeNull();
  });

  test('getDonorsByCode result is not null', async () => {
    DonorModel.Donor.get = jest.fn((condition) => {
      return testDonorData;
    });

    const donor = await DonorModel.getDonorByCode(testCode);
    expect(donor.length).toBe(testDonorData.length);
  })

  test('update', async () => {
    DonorModel.update = jest.fn((userId, userData) => {
      return testUpdateDonor;
    })

    const donor = await DonorModel.update(testUpdateDonor, testUserId);
    expect(donor.is_sent_token).toBe(true);
  });
});
