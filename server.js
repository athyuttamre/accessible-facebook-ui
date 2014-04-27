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

// GET request for Framework Page
app.get('/framework', function(request, response) {
	console.log('GET request for page_framework.html');
	response.render('page_framework.html');
})

// GET request for Login Page
app.get('/login', function(request, response) {
	console.log('GET request for login.html');
	response.render('login.html');
});

// GET request for Newsfeed
app.get('/newsfeed', function(request, response) {
	console.log('GET request for newsfeed.html');
	response.render('newsfeed.html');
});

// GET request for Profile about page
app.get('/profile/about', function(request, response) {
	console.log('GET request for profile.html');
	response.render('profile.html', {type:"about"});
});

// GET request for Profile
app.get('/profile', function(request, response) {
	console.log('GET request for profile.html');
	response.render('profile.html');
});

// GET request for Search
app.get('/search', function(request, response) {
	console.log('GET request for search.html');
	response.render('search.html');
});

// GET request for Status
app.get('/status', function(request, response) {
	console.log('GET request for status.html');
	response.render('status.html');
});

// GET request for Notifications
app.get('/notifications', function(request, response) {
	console.log('GET request for notifications.html');
	response.render('notifications.html');
});

// GET request for Messaging
app.get('/messaging', function(request, response) {
	console.log('GET request for messaging.html');
	response.render('messaging.html');
});

// GET request for pictures 
app.get('/photos/photos', function(request, response) {
	console.log('GET request for photos.html');
	response.render('photos.html', {page:"photos"});
});

// GET request for pictures 
app.get('/photos/photos_tagged', function(request, response) {
	console.log('GET request for photos.html');
	response.render('photos.html', {page:"photos_tagged", id:"undefined"});
});

// GET request for albums
app.get('/photos/albums/:album_id', function(request, response) {
	console.log('GET request for photos.html');
	response.render('photos.html', {page:"albums", id:request.params.album_id});
});

// GET request for pictures 
app.get('/photos/albums', function(request, response) {
	console.log('GET request for photos.html');
	response.render('photos.html', {page:"albums"});
});

// GET request for pictures 
app.get('/photos', function(request, response) {
	console.log('GET request for photos.html');
	response.render('photos.html', {page:"home"});
});

// GET request for Home Page
app.get('/', function(request, response) {
	console.log('GET request for index.html');
	response.render('index.html');
});

app.listen(8080, function() {
	console.log('Accessible Facebook UI listening on Port 8080...')
});