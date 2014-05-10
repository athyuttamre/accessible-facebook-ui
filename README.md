Accessible Facebook UI
====================

An accessible reimplementation of Facebook's core functions, designed to work with eye-tracking technology.

### Contents
- Intro
- Global Features
	- Server
	- HTML File Instructions
	- Dwell
- Login
- Homepage
- Newsfeed
- Messaging
- Status
- Profile
- Photos
- Logout
- Future Features
- Bugs
- Credits

### Intro
This ReadMe explains the Accessible Facebook UI app by feature. First, it explains all global features that apply to multiple sections. Then, it explains each page's functionality. Finally, it explains potential future features, bugs, and credits.

### Global Features

### Server

- / (/index)
	- index.html - Home page
	- First page that is loaded (will redirect to /login if first time)
- Login
	- login.html - Login page
	- Redirects here from any page if login.js says user not logged in
- Messaging
	- messaging.html
- Status
	- status.html
- Profile
	- profile.html
- Newsfeed
	- newsfeed.html
- Notifications
	- notifications.html
- Search
	- search.html

### HTML File Instructions

- Load CSS files in the <head>
- Load JS files at the bottom
- In the JS files, keep this order: 
	1. JQuery
	2. The JS file for this particular page. For index.html, this would be index.js. Copy the start function from
	     index.js, and put all functionality within this. This is exactly like how you would use $('document').ready()
	     in a normal project. Except here you're writing all your code in the 'start' method.
	3. login.js, this is for testing whether or not the user is logged in. If yes, your code above will be executed,
		if not, the user will be redirected.
	4. main.js, where the FB object is fetched, and the 'start' function from your file above is called. If you want to 
		modify main.js, please talk to Atty and work on this together.

### Dwell
For the moment, the only important thing for you guys is, when you do want to create any kind of clickable function 
including for buttons and divs, instead of using onclick in the html, use .click in the js.  For the moment, you will need to add $(foo).dwell(1000, true) to enable dwell click on anything, but this should be abstracted out to main.js.

So the js should look like this:
window.onload = function() {
	$(foo).dwell(1000, true);
	$(foo).click(function(){
		alert('dwell clicked');
	})
};

### Login

### Homepage
- /index.html is the homepage for the chat application.
- It is written using the Raphael.js library which allows for vector drawing.

### Future Features
- Chat only 
- Compose a new message
- 
- instant messaging only so you only see the messages you only get in a certain session.

### Bugs
- Blurry photos for Chat
- If internet times out while loading Chat, Chat will never load. Can be fixed by refreshing.

### Credits

and add <script type="text/javascript" src="js/dwell_gist.js"></script>  to the html
For more, see the dwell example

ADDED TO DWELL
Dwell will now change the background color of the clicked element.  It takes a color as an optional third argument, it defaults to 'facebook blue'.
<script src="http://code.jquery.com/ui/1.10.4/jquery-ui.js"></script> must be added to get the color change properties

