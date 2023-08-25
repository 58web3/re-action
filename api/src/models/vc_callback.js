const VCCallbackSchema = require("../schemas/vc_callback");

// Get model using schema
const VCCallback = dynamoose.model("VCCallback", VCCallbackSchema);

const getVCCallback = async (key) => {
  return await VCCallback.get({ key: key });
};

const upsertVCCallback = async (key, value, type, userId) => {
  const systemDate = new Date().getTime();
  const vcCallback = await VCCallback.get(key);
  if (!vcCallback) {
    await VCCallback.create({
      key: key,
      value: JSON.stringify(value),
      type: type,
      created_at: systemDate,
      created_by: userId,
      updated_at: systemDate,
      updated_by: userId,
      delete_flg: false,
    });
  } else {
    await VCCallback.update({ key }, {
      value: JSON.stringify(value),
      created_at: systemDate,
      created_by: userId,
      updated_at: systemDate,
      updated_by: userId,
      delete_flg: false,
    });
  }

};


module.exports = {
  upsertVCCallback,
  getVCCallback,
  VCCallback,
};
