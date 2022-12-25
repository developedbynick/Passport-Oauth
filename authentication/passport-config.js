const passport = require("passport");
const localStrategy = require("./local");
const googleStrategy = require("./google");
const githubStrategy = require("./github");
const facebookStrategy = require("./facebook");
const User = require("../models/userModel");

passport.serializeUser((user, done) => {
  return done(null, user);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id).select("-password");
  if (!user) return done("User Does Not Exist");
  const donePayload = { _id: user.id, email: user.email, name: user.name };
  if (user.provider) return done(null, user);
  return done(null, donePayload);
});

passport.use(localStrategy);
passport.use(googleStrategy);
passport.use(githubStrategy);
passport.use(facebookStrategy);
