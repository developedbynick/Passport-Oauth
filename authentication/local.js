const LocalStrategy = require("passport-local").Strategy;
const capitalize = require("capitalize");
const User = require("../models/userModel");

/**
 *
 * @param {String} email
 * @param {String} password
 * @param {Function} done
 */

const verifyFunction = async function (email, password, done) {
  // Finding user with that email and password.
  const user = await User.findOne({ email: email.toLowerCase() });
  // Checking if the user is falsy
  if (!user || !user?.password === password) return done("Incorrect email or password", false);
  // Checking if user was created using a 3rd party
  if (user?.provider) {
    const provider = capitalize(user.provider);
    return done(`Please login with ${provider}`, false);
  }
  // Checking the password
  //   The user is authenticated
  return done(null, user);
};
module.exports = new LocalStrategy({ usernameField: "email" }, verifyFunction);
