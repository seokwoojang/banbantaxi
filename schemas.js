const Joi = require("joi");

module.exports.mapSchema = Joi.object({
  map: Joi.object({
    location: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});
