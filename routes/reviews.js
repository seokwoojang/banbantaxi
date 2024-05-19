const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync"); //오류처리
const Review = require("../models/review.js");
const Maplist = require("../models/mapList"); //스키마 연결
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const map = await Maplist.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    map.reviews.push(review);
    await review.save();
    await map.save();
    req.flash("success", "새로운 리뷰를 작성하였습니다!");
    res.redirect(`/support/${map._id}`);
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Maplist.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "리뷰를 성공적으로 삭제했습니다!");
    res.redirect(`/support/${id}`);
  })
);

module.exports = router;
