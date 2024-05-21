if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync"); //오류처리
const ExpressError = require("./utils/ExpressError"); //오류처리
const Maplist = require("./models/mapList"); //스키마 연결
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash"); //메세지를 띄우기 위해 사용
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const supportRoutes = require("./routes/support.js");
const reviewsRoutes = require("./routes/reviews.js");
const usersRoutes = require("./routes/users.js");

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
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "thisshouldbebettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/support", supportRoutes); // 서포터즈 라우터
app.use("/support/:id/reviews", reviewsRoutes); // 리뷰 라우터
app.use("/", usersRoutes); //사용자 라우터

//메인 페이지
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/map", async (req, res) => {
  res.render("support/map");
});

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
