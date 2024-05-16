const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync"); //오류처리
const { reviewSchema } = require("../schemas.js"); //유효성검사
const Review = require("../models/review.js");
const Maplist = require("../models/mapList"); //스키마 연결

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const map = await Maplist.findById(req.params.id);
    const review = new Review(req.body.review);
    map.reviews.push(review);
    await review.save();
    await map.save();
    req.flash("success", "새로운 리뷰를 작성하였습니다!");
    res.redirect(`/support/${map._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Maplist.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "리뷰를 성공적으로 삭제했습니다!");
    res.redirect(`/support/${id}`);
  })
);

module.exports = router;
