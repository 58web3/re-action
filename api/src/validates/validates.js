const Joi = require('@hapi/joi');

module.exports.createUser = Joi.object({
  verification_code: Joi.string().required(),
  wallet_address: Joi.string().required(),
});

module.exports.verifyCode = Joi.object({
  verification_code: Joi.string().required(),
});
