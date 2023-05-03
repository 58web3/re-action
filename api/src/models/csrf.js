const CsrfSchema = require("../schemas/csrf");

// Get model using schema
const Csrf = dynamoose.model("Csrf", CsrfSchema);

const addCsrfToken = async (csrfToken, secret, userId) => {
  const systemDate = new Date().getTime();
  await Csrf.create({
    csrf_token: csrfToken,
    secret: secret,
    created_at: systemDate,
    created_by: userId,
    updated_at: systemDate,
    updated_by: userId,
    delete_flg: false,
  });
};

const getCsrfToken = async (csrfToken) => {
  return await Csrf.get({csrf_token: csrfToken});
};

const deleteCsrfToken = async (csrfToken) => {
  return await Csrf.delete({csrf_token: csrfToken});
};

module.exports = {
  addCsrfToken,
  getCsrfToken,
  deleteCsrfToken,
  Csrf,
};
