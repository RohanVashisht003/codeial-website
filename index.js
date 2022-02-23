const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");

// used for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-stratergy");
const MongoStore = require("connect-mongo");

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static("./assets"));
app.use(expressLayouts);

// extract style and script from subpages into layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// setting up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    name: "codeial",
    // TODO change the secret before deployement in production mode
    secret: "blabla",
    saveUninitialized: "false",
    resave: "false",
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create(
      {
        mongoUrl: "mongodb://localhost/codeial_development",
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongo setup OK");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
// use express router
app.use("/", require("./routes"));

// for starting server
app.listen(port, function (err) {
  if (err) {
    console.log(`Error ${err}`);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
