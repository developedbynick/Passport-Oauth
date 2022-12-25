const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");

module.exports = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/users/google/redirect",
  },
  async function (_, __, profile, done) {
    const { id, provider, emails } = profile;
    // Attempt to find user with the provider id and the provider
    let user = await User.findOne({ providerId: id, provider });
    if (user) return done(null, user);
    // Create user
    user = await User.create({
      email: emails[0].value,
      provider,
      providerId: id,
      name: profile.displayName,
    });
    // Returning with the user
    return done(null, user);
  }
);
