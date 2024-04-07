const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Maplist = require("./models/mapList"); //스키마 연결

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

//메인 페이지
app.get("/", (req, res) => {
  res.render("home");
});

//서포터즈 모드
app.get("/support", async (req, res) => {
  const maplist = await Maplist.find({});
  res.render("sMap", { maplist });
});

//이동약자 모드
app.get("/normal", async (req, res) => {
  const maplist = await Maplist.find({});
  res.render("nMap", { maplist });
});

//서포터즈 모드에서 지도하나 선택시 가는 페이지
app.get("/support/:id", async (req, res) => {
  const maplist = await Maplist.findById(req.params.id);
  res.render("sShow", { maplist });
});

app.listen(3000, () => {
  console.log("3000 포트에서 실행 중");
});
