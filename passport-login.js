
var express = require('express')
	, passport = require('passport')
	, util = require('util')
	, FacebookStrategy = require('passport-facebook').Strategy;

var FACEBOOK_APP_ID = '610602015680966';
var FACEBOOK_APP_SECRET = '1a0eb427f36d45a0e81e3bb52c7a1245';

var app = express();

// Path module -- setting up static files
var path = require('path'); // Using path module to easily serve static files and favicon

app.use(express.static(path.join(__dirname, 'public'))); // Tell Express where to find static JS and CSS files
app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico'))); // Tell Express where to find favicon

app.use(express.bodyParser());

// Setting up Templating Engine
var engines = require('consolidate');
app.engine('html', engines.hogan); // Tell Express to run .html files through Hogan
app.set('views', __dirname + '/views'); // Tell Express where to find templates

// ========== Passport START ==========

app.configure(function() {
	// Initialize passport! (use passport.session middleware)
		/// for persistent login sessions
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
});

// Passport session steup
passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

// Use FacebookStrategy 
passport.use(new FacebookStrategy({
	clientID: FACEBOOK_APP_ID,
	clientSecret: FACEBOOK_APP_SECRET,
	callbackURL: "http://localhost:8080/auth/facebook/callback"
	},
	function(accessToken, refreshToken, profile, done) {
		process.nextTick(function() {
			return done(null, profile);
		});
	}
));
// =========== Passport END ===========

app.get('/', function(req, res) {
/////
	console.log('Successfully redirected to / after logging in!');
	
	res.render('index.html');
});

// Redirects to facebook.com/login
app.get('/auth/facebook', 
	passport.authenticate('facebook'),
	function(req, res) {

	});
// Gets called after user logins from facebook.com
app.get('/auth/facebook/callback',
	passport.authenticate('facebook', {failureRedirect:'/login'}),
	function(req, res) {
		res.redirect('/');
	});

app.listen(8080);



