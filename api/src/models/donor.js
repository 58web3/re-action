const DonorSchema = require("../schemas/donor");

// Get model using schema
const Donor = dynamoose.model("Donor", DonorSchema);

const getDonorByCode = async (code) => {
  const donor = await Donor.get({ code: code });
  return donor;
};

const getDonors = async (userId) => {
  const condition = new dynamoose.Condition()
    .where("owner_user_id").eq(userId);

  const donor = await Donor.query(condition).exec();
  return donor;
};

const update = async (donor, userId) => {
  const systemDate = new Date().getTime();
  return await Donor.update({
    code: donor.code,
  }, {
    token_name: donor.token_name,
    owner_user_id: donor.owner_user_id,
    token_id: donor.token_id,
    token_uri: donor.token_uri,
    image_url: donor.image_url,
    is_verified: donor.is_verified,
    is_used: donor.is_used,
    is_sent_token: donor.is_sent_token,
    updated_at: systemDate,
    updated_by: userId,
  });
}

module.exports = {
  getDonorByCode,
  getDonors,
  update,
  Donor
};
