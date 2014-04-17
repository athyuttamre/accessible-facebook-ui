// Initializing Server
var express = require('express');
var app = express();
var path = require('path'); // Using path module to easily serve static files and favicon

// Setting up Templating Engine
var engines = require('consolidate');
app.engine('html', engines.hogan); // Tell Express to run .html files through Hogan
app.set('views', __dirname + '/views'); // Tell Express where to find templates

// Setting up static files and favicon
app.use(express.static(path.join(__dirname, 'public'))); // Tell Express where to find static JS and CSS files
app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico'))); // Tell Express where to find favicon

app.use(express.bodyParser());

// GET request for Login Page
app.get('/login', function(request, response) {
	console.log('GET request for login.html');
	response.render('login.html');
});

// GET request for Home Page
app.get('/', function(request, response) {
	console.log('GET request for index.html')
});

// GET request for Newsfeed
app.get('/newsfeed', function(request, response) {
	console.log('GET request for newsfeed.html')
});

// GET request for Profile
app.get('/profile', function(request, response) {
	console.log('GET request for profile.html')
});

// GET request for Search
app.get('/search', function(request, response) {
	console.log('GET request for search.html')
});

// GET request for Status
app.get('/status', function(request, response) {
	console.log('GET request for status.html')
});

// GET request for Notifications
app.get('/notifications', function(request, response) {
	console.log('GET request for notifications.html')
});

// GET request for Messaging
app.get('/messaging', function(request, response) {
	console.log('GET request for messaging.html')
});
