var express = require('express');
var router = express.Router();
var passport = require('passport');
var passportLocal = require('passport-local');
var passportHttp = require('passport-http')

function verifyCredentials(username, password, done){
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
};

// cookie based - session token
passport.use(new passportLocal.Strategy(verifyCredentials));

// header that has username and password comes with every request - constantly authenticate. "Authorization": "Basic YXNkZjphc2Rm" and for fun: atob('YXNkZjphc2Rm'); >> asdf: asdf;
passport.use(new passportHttp.BasicStrategy(verifyCredentials));

passport.serializeUser(function(user, done){
	done(null, user.id)
});

passport.deserializeUser(function(id, done){
	// this is where you would query the db or cache
	done(null, {id: id, name: id})
});


router.use('/api', passport.authenticate('basic', {session: false}));

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

// custom middleware::
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()){
		next();
	}
	else{
		// redirect, maybe use query string parameter
		res.send(403);
	}
};

// now express will call the ensureAuthenticated function when this endpoint gets a request.
router.get('/api/data', ensureAuthenticated ,function(req, res, next){
	res.json([
			{ mid: 'buzzz'},
			{ driver: 'orc'},
			{ fareway: 'teebird'},
			{ putter: 'aviar'}
		])
});

module.exports = router;
