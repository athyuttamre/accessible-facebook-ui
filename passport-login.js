
var express = require('express')
	, passport = require('passport')
	, util = require('util')
	, FB = require('fb');
var FacebookStrategy = require('passport-facebook').Strategy;

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

var FB_ACCESS_TOKEN = '';


/* profileFields INFO:
Portable Contacts schema for profileFields
http://wiki.portablecontacts.net/w/page/17776141/schema 
You also need permissions in permissions=[] array below.*/

// Use FacebookStrategy 
passport.use(new FacebookStrategy({
	clientID: FACEBOOK_APP_ID,
	clientSecret: FACEBOOK_APP_SECRET,
	callbackURL: "http://localhost:8080/auth/facebook/callback"
	// profileFields: ['id', 'name', 'displayName', 'photos']
	},
	function(accessToken, refreshToken, profile, done) {
		process.nextTick(function() {
			FB_ACCESS_TOKEN = accessToken;
			FB.setAccessToken(accessToken);

			return done(null, profile);
		});
	}
));

// =========== Passport END =============

// =========== Express START ============
app.get('/', function(req, res) {
/////
	console.log('Successfully redirected to / after logging in!');
	
	res.render('index.html');
});

// ==================== TEST ================
app.get('/name', function(req, res) {
	FB.setAccessToken(FB_ACCESS_TOKEN);
	console.log("FB_ACCESS_TOKEN: " + FB_ACCESS_TOKEN);

	FB.api('/me/photos', function(res) {
		console.log("/photos: " + res.source + ", " + res.url + ", " + res.message);
		console.log('/name RESPONSE: ' + JSON.stringify(res));
	});

/*	var body = "Hello World!";
	FB.api('/me/feed', 'post', {message: body}, function(response) {
		if (!response || response.error) {
			console.log("Error occurred: " + JSON.stringify(response.error));
		} else {
			console.log("Posted status update: " + body);
			console.log("POST ID: " + response.id);
		}
	});*/
})
// =========================================

// Redirects to facebook.com/login
var permissions = ['user_status', 'user_about_me', 'user_likes', 
		'user_photos', 'publish_actions', 'read_stream'];

app.get('/auth/facebook', 
	passport.authenticate('facebook', /*{display: 'popup'}, */{scope: permissions }),
	function(req, res) {
	});

// Gets called after user logins from facebook.com
app.get('/auth/facebook/callback',
	passport.authenticate('facebook', {failureRedirect:'/login'}),
	function(req, res) {
		res.redirect('/');
	});

app.listen(8080);

// =========== Express END ===========

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, callback) {
  if (req.isAuthenticated()) { return callback(); }
  res.redirect('/login')
}

