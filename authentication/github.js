const GithubStrategy = require("passport-github2").Strategy;
const User = require("../models/userModel");
const strategy = new GithubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/api/users/github/redirect",
    scope: "user",
  },
  async (_, __, profile, done) => {
    const providerId = profile.id;
    // Checking if the user with that providerId exists
    const userExists = await User.exists({ providerId });
    // If user with that id exists, then we return the user to be placed on the session
    if (userExists) return done(null, await User.findById(userExists._id));
    // If user does not exist, then we create an instance
    const user = await User.create({
      email: profile.emails[0].value,
      name: profile.displayName,
      provider: profile.provider,
      providerId: profile.id,
    });
    // Function ends
    return done(null, user);
  }
);

module.exports = strategy;
