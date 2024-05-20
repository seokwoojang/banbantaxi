const Maplist = require("../models/mapList"); //스키마 연결

module.exports.sMap = async (req, res) => {
  const maplist = await Maplist.find({});
  res.render("support/sMap", { maplist });
};

module.exports.renderNewForm = async (req, res) => {
  res.render("support/newMap");
};

module.exports.createMap = async (req, res) => {
  const newMap = new Maplist(req.body.map);
  newMap.author = req.user._id;
  await newMap.save();
  req.flash("success", "새로운 지도를 추가하는데 성공하였습니다!");
  res.redirect(`/support/${newMap._id}`);
};

module.exports.showMap = async (req, res) => {
  const map = await Maplist.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!map) {
    req.flash("error", "지도를 찾을 수 없습니다!");
    return res.redirect("/support");
  }
  res.render("support/sShow", { map });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const map = await Maplist.findById(id);
  if (!map) {
    req.flash("error", "지도를 찾을 수 없습니다!");
    return res.redirect("/support");
  }
  res.render("support/edit", { map });
};

module.exports.updateMap = async (req, res) => {
  const { id } = req.params;
  const map = await Maplist.findByIdAndUpdate(id, { ...req.body.map });
  req.flash("success", "성공적으로 지도를 갱신하였습니다!");
  res.redirect(`/support/${map._id}`);
};

module.exports.deleteMap = async (req, res) => {
  const { id } = req.params;
  const map = await Maplist.findByIdAndDelete(id);
  req.flash("success", "지도를 성공적으로 삭제했습니다!");
  res.redirect("/support");
};
