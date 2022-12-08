const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.string().trim().min(10).max(10).required(),
  password: Joi.string().trim().min(5).max(150).required(),
});

module.exports = userSchema;
