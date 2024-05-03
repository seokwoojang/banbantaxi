const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { mapSchema, reviewSchema } = require("./schemas.js"); //유효성검사
const catchAsync = require("./utils/catchAsync"); //오류처리
const ExpressError = require("./utils/ExpressError"); //오류처리
const Maplist = require("./models/mapList"); //스키마 연결
const methodOverride = require("method-override");
const Review = require("./models/review.js");

// db 연결
mongoose.connect("mongodb://127.0.0.1:27017/hand");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database 연결됨");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//유효성 검사
const validateMap = (req, res, next) => {
  const { error } = mapSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//메인 페이지
app.get("/", (req, res) => {
  res.render("home");
});

//서포터즈 모드 ----------------------------------------------
app.get(
  "/support",
  catchAsync(async (req, res) => {
    const maplist = await Maplist.find({});
    res.render("support/sMap", { maplist });
  })
);

//새로운 지도 만들기
app.get(
  "/support/new",
  catchAsync(async (req, res) => {
    res.render("support/newMap");
  })
);

app.post(
  "/support",
  validateMap,
  catchAsync(async (req, res) => {
    const newMap = new Maplist(req.body.map);
    await newMap.save();
    res.redirect(`/support/${newMap._id}`);
  })
);

//서포터즈 모드에서 지도하나 선택시 가는 페이지
app.get(
  "/support/:id",
  catchAsync(async (req, res) => {
    const map = await Maplist.findById(req.params.id).populate("reviews");
    res.render("support/sShow", { map });
  })
);

//지도 수정
app.get(
  "/support/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const map = await Maplist.findById(id);
    res.render("support/edit", { map });
  })
);

//지도 수정
app.put(
  "/support/:id",
  validateMap,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const map = await Maplist.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    res.redirect(`/support/${map._id}`);
  })
);

app.delete(
  "/support/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const map = await Maplist.findByIdAndDelete(id);
    res.redirect("/support");
  })
);

app.post(
  "/support/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    const map = await Maplist.findById(req.params.id);
    const review = new Review(req.body.review);
    map.reviews.push(review);
    await review.save();
    await map.save();
    res.redirect(`/support/${map._id}`);
  })
);

app.delete(
  "/support/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Maplist.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/support/${id}`);
  })
);

//---------------------------------------------------

//이동약자 모드
app.get(
  "/normal",
  catchAsync(async (req, res) => {
    const maplist = await Maplist.find({});
    res.render("normal/nMap", { maplist });
  })
);

//이동약자 모드에서 지도하나 선택시 가는 페이지
app.get(
  "/normal/:id",
  catchAsync(async (req, res) => {
    const map = await Maplist.findById(req.params.id);
    res.render("normal/nShow", { map });
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "뭔가 잘못됨";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("3000 포트에서 실행 중");
});
