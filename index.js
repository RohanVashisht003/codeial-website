const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static("./assets"));
app.use(expressLayouts);

// extract style and script from subpages into layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// use express router
app.use("/", require("./routes"));

// setting up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// for starting server
app.listen(port, function (err) {
  if (err) {
    console.log(`Error ${err}`);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
