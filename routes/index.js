var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: ' Hello, I am Madhur ' });
});

/* GET handler for /about*/
router.get('/about', function(req, res, next){
  res.render('about', {title: 'About Myself'})
})

/* GET handler for /projects*/
router.get('/projects', function(req, res, next){
  res.render('projects', {title: 'My Projects'})
})

/* GET handler for /contact*/
router.get('/contact', function(req, res, next){
  res.render('contact', {title: 'Contact Me'})
})

module.exports = router;
