module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "로그인을 해야 합니다");
    return res.redirect("/login");
  }
  next();
};
