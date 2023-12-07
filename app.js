var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


//export libraries
var config = require('./config/globals');
var mongoose = require('mongoose');

//import authentication related modules
const passport = require("passport");
const session = require("express-session");
const User = require("./models/user");
var githubStrategy = require("passport-github2").Strategy;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var teamsRouter = require('./routes/teams');

var app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//configure passport and session 
app.use(session({
  secret: "fall2023jsframeworks",
  resave: false,
  saveUninitialized: false
}));

//configure local strategy
passport.use(User.createStrategy());
//configure oauth strategy
passport.use(new githubStrategy({
  clientID: config.github.clientId,
  clientSecret: config.github.clientSecret,
  callbackURL: config.github.callbackURL
},
  async (accessToken, refreshToken,profile, done ) => {
    const user = await User.findOne({oauthId: profile.id});
    if (user){
      return done(null, user);
    }else{
      const newUser = new User({
        username: profile.username,
        oauthId: profile.id,
        oauthProvider: "GitHub",
        created: Date.now()
      });
      const savedUser = await newUser.save();
      return done(null,savedUser);
    }
  }
));

//set passport to write/read user data to/from session object
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

//routing config
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/teams', teamsRouter);

//config mongoose
mongoose
.connect(config.db, {useNewUrlParser: true, useUnifiedTopology: true}) //connect
.then((message)=>{
  console.log('Connection Successfully!');
}) // do something after connecting
.catch((err) => {
  console.log('Error while connecting!' + err);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
