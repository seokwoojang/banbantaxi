const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync"); //오류처리
const support = require("../controllers/support.js");
const { isLoggedIn, validateMap, isAuthor } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

//서포터즈 모드 ----------------------------------------------
router
  .route("/")
  .get(catchAsync(support.sMap))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateMap,
    catchAsync(support.createMap)
  ); //새로운 지도 만들기

//새로운 지도 만들기
router.get("/new", isLoggedIn, catchAsync(support.renderNewForm));

router
  .route("/:id")
  .get(catchAsync(support.showMap)) //서포터즈 모드에서 지도하나 선택시 가는 페이지
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateMap,
    catchAsync(support.updateMap)
  ) //지도 수정
  .delete(isLoggedIn, isAuthor, catchAsync(support.deleteMap)); //지도 삭제

//지도 수정
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(support.renderEditForm)
);

module.exports = router;
