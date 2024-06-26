//유효성 검사
const Joi = require("joi");

module.exports.mapSchema = Joi.object({
  map: Joi.object({
    location: Joi.string().required(),
    // image: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});
