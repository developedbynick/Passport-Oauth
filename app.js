const express = require("express");
require("./authentication/passport-config");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const authRouter = require("./routes/authRoutes");
const app = express();

const store = new MongoStore({
  collectionName: "authentication-sessions",
  mongoUrl: process.env.MONGO,
});

// Middleware functions
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    name: "SID",
    secret: [process.env.SESSION_SECRET],
    store,
    cookie: {
      maxAge: 1000 * 24 * 60 * 60,
      secure: process.env.NODE_ENV !== "development",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use("/api/users", authRouter);

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    const { user } = req;
    const markup = `<p style="font-size:16px;font-family:'cascadia code'">Hello there <b>${user.name}(${user.email}) 😊</b></p>`;
    return res.send(markup);
  }
  res.send(
    `Hello There. Please login to get a nicer greeting 😊. Session ID: ${req.sessionID}`
  );
});

app.use((err, req, res, next) => {
  console.log(err);
  res.json({
    message: err.message || err,
    route: `${req.protocol}://${req.get("host")}/${req.url.slice(1)}`,
  });
});
module.exports = app;
