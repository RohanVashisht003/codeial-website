const express = require("express");
const app = express();
const path = require("path");
const port = 8000;
const expressLayouts = require("express-ejs-layouts");

app.use(express.static("./assets"));
app.use(expressLayouts);

// extract style and script from subpages into layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// use express router
app.use("/", require("./routes"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error ${err}`);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
