const Maplist = require("../models/mapList"); //스키마 연결
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
  const map = await Maplist.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  map.reviews.push(review);
  await review.save();
  await map.save();
  req.flash("success", "새로운 리뷰를 작성하였습니다!");
  res.redirect(`/support/${map._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Maplist.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "리뷰를 성공적으로 삭제했습니다!");
  res.redirect(`/support/${id}`);
};
