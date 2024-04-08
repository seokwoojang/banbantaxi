const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Maplist = require("./models/mapList"); //스키마 연결
const methodOverride = require("method-override");

// db 연결
mongoose.connect("mongodb://127.0.0.1:27017/hand");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database 연결됨");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//메인 페이지
app.get("/", (req, res) => {
  res.render("home");
});

//서포터즈 모드 ----------------------------------------------
app.get("/support", async (req, res) => {
  const maplist = await Maplist.find({});
  res.render("support/sMap", { maplist });
});

//새로운 지도 만들기
app.get("/support/new", async (req, res) => {
  res.render("support/newMap");
});

app.post("/support", async (req, res) => {
  const newMap = new Maplist(req.body);
  await newMap.save();
  res.redirect(`/support/${newMap._id}`);
});

//서포터즈 모드에서 지도하나 선택시 가는 페이지
app.get("/support/:id", async (req, res) => {
  const map = await Maplist.findById(req.params.id);
  res.render("support/sShow", { map });
});

//지도 수정
app.get("/support/:id/edit", async (req, res) => {
  const { id } = req.params;
  const map = await Maplist.findById(id);
  res.render("support/edit", { map });
});

//지도 수정
app.put("/support/:id", async (req, res) => {
  const { id } = req.params;
  const map = await Maplist.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  res.redirect(`/support/${map._id}`);
});

app.delete("/support/:id", async (req, res) => {
  const { id } = req.params;
  const map = await Maplist.findByIdAndDelete(id);
  res.redirect("/support");
});

//---------------------------------------------------

//이동약자 모드
app.get("/normal", async (req, res) => {
  const maplist = await Maplist.find({});
  res.render("nMap", { maplist });
});

//이동약자 모드에서 지도하나 선택시 가는 페이지
app.get("/normal/:id", async (req, res) => {
  const map = await Maplist.findById(req.params.id);
  res.render("nShow", { map });
});

app.listen(3000, () => {
  console.log("3000 포트에서 실행 중");
});
