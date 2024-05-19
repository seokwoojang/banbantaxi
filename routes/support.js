const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync"); //오류처리
const ExpressError = require("../utils/ExpressError"); //오류처리
const Maplist = require("../models/mapList"); //스키마 연결
const { mapSchema } = require("../schemas.js");
const { isLoggedIn } = require("../middleware.js");

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

//서포터즈 모드 ----------------------------------------------
router.get(
  "/",
  catchAsync(async (req, res) => {
    const maplist = await Maplist.find({});
    res.render("support/sMap", { maplist });
  })
);

//새로운 지도 만들기
router.get(
  "/new",
  isLoggedIn,
  catchAsync(async (req, res) => {
    res.render("support/newMap");
  })
);

router.post(
  "/",
  isLoggedIn,
  validateMap,
  catchAsync(async (req, res) => {
    const newMap = new Maplist(req.body.map);
    await newMap.save();
    req.flash("success", "새로운 지도를 추가하는데 성공하였습니다!");
    res.redirect(`/support/${newMap._id}`);
  })
);

//서포터즈 모드에서 지도하나 선택시 가는 페이지
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const map = await Maplist.findById(req.params.id).populate("reviews");
    if (!map) {
      req.flash("error", "지도를 찾을 수 없습니다!");
      return res.redirect("/support");
    }
    res.render("support/sShow", { map });
  })
);

//지도 수정
router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const map = await Maplist.findById(id);
    if (!map) {
      req.flash("error", "지도를 찾을 수 없습니다!");
      return res.redirect("/support");
    }
    res.render("support/edit", { map });
  })
);

//지도 수정
router.put(
  "/:id",
  isLoggedIn,
  validateMap,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const map = await Maplist.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    req.flash("success", "성공적으로 지도를 갱신하였습니다!");
    res.redirect(`/support/${map._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const map = await Maplist.findByIdAndDelete(id);
    req.flash("success", "지도를 성공적으로 삭제했습니다!");
    res.redirect("/support");
  })
);

module.exports = router;
