const express = require("express");
const env = require('./config/environment');
const logger = require('morgan');
const cookieParser = require("cookie-parser");
const app = express();
require('./config/view-helpers')(app);
const path = require("path");
const port = env.codeial_main_port || 8000;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
// used for session cookies
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-stratergy");
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-stratergy');
const MongoStore = require("connect-mongo");
const sassMiddleWare = require("node-sass-middleware");
const flash = require('connect-flash');
const customMware = require('./config/middleWare');

// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);

chatServer.listen(5000,(err)=>{
  if(err){
    console.log("error",err);
  }
  else{
    console.log("Working fine on port", 5000);
  }
});

if(env.name == 'development'){
  app.use(sassMiddleWare({
    src: path.join(__dirname,env.asset_path,'/scss'),
    dest: path.join(__dirname,env.asset_path,'/css'),
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
  }));
}

// app.use(sassMiddleWare({

//   src:'./assets/scss',
//   dest:'./assets/css',
//   debug:true,
//   outputStyle:'extended',
//   prefix:'/css'


// }));
// const path =require('path')



app.use(express.urlencoded());

app.use(cookieParser());


// accessing static files
// app.use(express.static("./assets"));
app.use(express.static(env.asset_path));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options))

// using ejs layouts
app.use(expressLayouts);

// extract style and script from subpages into layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// setting up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session({
  name: "codeial",
  // TODO change the secret before deployement in production mode
  secret: env.session_cookie_key,
  saveUninitialized: "false",
  resave: "false",
  cookie: {
    maxAge: (1000 * 60 * 100),
  },
  store: MongoStore.create({
      mongoUrl: `mongodb://localhost/${env.db}`,
      autoRemove: "disabled",
    },
    function (err) {
      console.log(err || "connect-mongo setup OK");
    }
  ),
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

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