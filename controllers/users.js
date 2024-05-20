const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.createRegister = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    console.log(registeredUser);
    req.flash("success", "환영합니다");
    res.redirect("/support");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "환영합니다");
  const redirectUrl = res.locals.returnTo || "/support";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "로그아웃 하였습니다");
    res.redirect("/support");
  });
};
