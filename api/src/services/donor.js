const DonorModel = require("../models/donor");

const verifyCode = async function (code, res) {
  const donor = await DonorModel.getDonorByCode(code);
  if (!donor) {
    return res.status(404).json({ message: 'Verification code is not found'})
  }

  if (donor.is_used) {
    return res.status(400).json({ message: 'Verification code is already used' })
  }
  
  donor.is_verified = true;
  await DonorModel.update(donor);
  return donor;
}

module.exports = {
  verifyCode
};
