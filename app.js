const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { mapSchema } = require("./schemas.js");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const Maplist = require("./models/mapList"); //스키마 연결
const methodOverride = require("method-override");

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

const validateMap = (req, res, next) => {
  const { error } = mapSchema.validate(req.body);
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
    const map = await Maplist.findById(req.params.id);
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
