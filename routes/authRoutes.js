const express = require("express");
const User = require("../models/userModel");
const passport = require("passport");
const router = express.Router();
router.use((req, res, next) => {
  if (req.url.includes("/login") && req.isAuthenticated()) {
    console.log("redirected");
    return res.redirect("/");
  }
  next();
});
router.post("/sign-up", async function (req, res) {
  const user = await User.create(req.body);
  res.status(201).json({ user });
});
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.send(req.user);
});

// @desc Route for google login
let authOpts = {
  scope: ["profile", "email"],
  prompt: "select_account",
  failureRedirect: "/api/users/error",
};
const googleLogin = passport.authenticate("google", authOpts);
router.get("/login/github", passport.authenticate("github")); // login for github
router.get("/login/facebook", passport.authenticate("facebook")); // login for facebook
router.get("/login/google", googleLogin); // login for google

// INFO: Oauth login redirects
// @desc This is the route that handles what happens after the user chooses their google account.
const redirectToHome = (_, res) => res.redirect("/");
router.get("/google/redirect", passport.authenticate("google"), redirectToHome);
router.get("/github/redirect", passport.authenticate("github"), redirectToHome);
router.get(
  "/facebook/redirect",
  passport.authenticate("facebook"),
  redirectToHome
);
// INFO: Logout
router.get(
  "/logout",
  (req, res, next) => {
    // req.isAuthenticated, req.user
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not logged in" });
    }
    return next();
  },
  (req, res) => {
    console.log(req.user, "logout");
    req.logout(function (err) {
      if (err) return res.status(500).json({ err: err.message || err });
      req.session.destroy();
      res.redirect("/");
    });
  }
);
module.exports = router;
