const Joi = require("joi");

const tweetSchema = Joi.object({
  question: Joi.string().trim().min(2).max(300).required(),
  answer: Joi.string().trim().min(2).max(300).required(),
  video_uri: Joi.string().uri(),
});

module.exports = tweetSchema;
