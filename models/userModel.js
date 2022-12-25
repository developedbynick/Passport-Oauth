const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lower: true,
  },
  password: String,
  provider: {
    type: String,
    enum: {
      values: ["google", "facebook", "github"],
      message: "{VALUE} is not a valid provider",
    },
  },
  providerId: String,
});

userSchema.pre("validate", function (next) {
  if (!this.isNew) return next();
  // Was user created via third party ie.(Google, Twitter, Github)
  if (this.provider) {
    this.password = undefined;
    return next();
  }
  // Was password specified, with this request
  if (!this.password) return next({ message: "Password is required" });
});
module.exports = mongoose.model("User", userSchema);
