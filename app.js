var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
require('dotenv').config()


const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");


var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const mainRouter = require("./routes/main");

//Adding authentication
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const User = require("./models/user");

var app = express();
const mongoDB = process.env.MONGODB_URI;

main();
async function main() {
  try {
    await mongoose.connect(mongoDB);
  } catch (error) {
    console.log(error);
  }
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const sessionstore = MongoStore.create({mongoUrl: mongoDB})

// Passport Authentication Middleware
app.use(
  session({
    secret: process.env.MY_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionstore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const customFields = {
  usernameField: "email",
  passwordField: "password"
}

const strategy = new LocalStrategy(customFields, async(useremail, password, done) => {
  const user = await User.findOne({ email: useremail });
  console.log(user)
  if (user) {
    const passwordsMatch = await bcrypt.compare(password, user.password);
    console.log(passwordsMatch)

    if (passwordsMatch) {
      done(null, user);
    } 
    else {
      done(null, false, { message: "Incorrect Password" });
    }

  } 
  else {
    done(null, false, { message: "User was not found" });
  }

});


passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser(async(id, done) => {
  const user = await User.findById(id).exec();
  if (user) {
    done(null, user);
  } else {
    done(null, false, { message: "User was not found" });
  }
});



app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



app.use(compression());
app.use(helmet());
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 25,
});
app.use(limiter);




app.use(express.static(path.join(__dirname, "public")));

app.use("/", mainRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
