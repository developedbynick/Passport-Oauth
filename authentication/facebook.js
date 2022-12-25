const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/userModel");
const strategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/api/users/facebook/redirect",
    profileFields: ["email", "name", "displayName", "profileUrl"],
  },
  async function (_, __, profile, done) {
    // Check if user has an account
    const id = await User.exists({ email: profile.emails?.[0].value });
    // If user doesn't exist, then we create them
    if (!id) {
      const userPayload = {
        email: profile.emails?.[0].value,
        provider: profile.provider,
        providerId: profile.id,
        name: profile.displayName,
      };
      const user = await User.create(userPayload);
      return done(null, user);
    }

    // ------ User Exists ------
    const user = await User.findById(id._id);
    // if (user.provider !== profile.provider)
    //   return done(`Please login with ${user.provider}`);
    return done(null, user);
  }
);

module.exports = strategy;
