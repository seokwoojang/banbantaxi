const { mapSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError.js");
const Maplist = require("./models/mapList.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "로그인을 해야 합니다");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

//유효성 검사
module.exports.validateMap = (req, res, next) => {
  const { error } = mapSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//권한 학인
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const map = await Maplist.findById(id);
  if (!map.author.equals(req.user._id)) {
    req.flash("error", "권한이 없습니다");
    return res.redirect(`/support/${id}`);
  }
  next();
};

//권한 학인
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const map = await Review.findById(reviewId);
  if (!map.author.equals(req.user._id)) {
    req.flash("error", "권한이 없습니다");
    return res.redirect(`/support/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
