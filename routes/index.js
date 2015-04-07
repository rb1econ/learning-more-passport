var express = require('express');
var router = express.Router();
// var passportLocal = require('passport-local');
// var passporthttp = require('passport-http');
// var expressSession = require('express-session');
var passport = require('passport');
var passportLocal = require('passport-local');
passport.use(new passportLocal.Strategy(function(username, password, done){
  // hooking up db later
  if(username === password){
    done(null, {id: username, name: username})
  }
  else{
    done(null, null);
  }
  // Three possible options:
  // done(null, user);
  // done(null, null);
  // done(new Error('muchos diablos errr'));
}));

passport.serializeUser(function(user, done){
	done(null, user.id)
});

passport.deserializeUser(function(id, done){
	// this is where you would query the db or cache
	done(null, {id: id, name: id})
});

/* GET home page. */
router.get('/', function(req, res, next) {
	// console.log('req.user::::::::::::::::::::::::::', req.user);
	if(req.isAuthenticated()){
		var theUser = req.user;
	}
	else{
		var theUser = "potential user";
	}
  res.render('index', { 
  	title: 'devMentor',
  	user: theUser,
  	isAuthenticated: req.isAuthenticated()
  });
});

router.get('/login', function(req,res,next){
	res.render('login', {
		title: 'Login',
	});
});

router.post('/login',passport.authenticate('local') ,function(req,res,next){
	// res.send('hola mundo, vivo en la router');
	res.redirect('/');
});

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

module.exports = router;
