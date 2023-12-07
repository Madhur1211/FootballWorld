var express = require('express');
var router = express.Router();
var User = require("../models/user");
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: ' Football World ', user: req.user });
});



/* GET handler for /register*/
router.get('/register', function(req, res, next){
  res.render('register', {title: 'Register'})
})

//post register
router.post('/register', (req,res, next)=>{
  //create a new user based on the information collected in the form
  User.register(
    new User({username : req.body.username}),
    req.body.password,
    (err, newUser)=> {
      req.login(newUser, (err) => {res.redirect("/teams/teams");});
    }
  );
});

/* GET handler for /login*/
router.get('/login', function(req, res, next){
  let messages = req.session.messages || [];
  req.session.messages;
  res.render("login", {title: "Login", messages: messages});
});

//post login
router.post('/login',passport.authenticate(
  "local",
  {
    successRedirect: "/teams/teams",
    failureRedirect:"/login",
    failureMessage: "Invalid Authentication"
  }
));

//Get handler for logout
router.get('/logout',function(req,res,next){
  req.logOut((err) => {
    res.redirect("/login")
  });
});

//get handler for github
router.get('/github', passport.authenticate('github', {scope: ["user.email"]}));

//get handler for github/callback
router.get('/github/callback',
  passport.authenticate("github", { failureRedirect: "/login"}),
  (req, res, next) =>{
    res.redirect("/teams/teams");
  }
)

module.exports = router;
