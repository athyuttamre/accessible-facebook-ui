Accessible Facebook UI
====================

An accessible reimplementation of Facebook's core functions, designed to work with eye-tracking technology.


### Server

- / (/index)
	- index.html - Home page
	- First page that is loaded (will redirect to /login if first time)
- /login
	- login.html - Login page
	- Redirects here from any page if login.js says user not logged in
- /messaging
	- messaging.html
- /status
	- status.html
- /profile
	- profile.html
- /newsfeed
	- newsfeed.html
- /notifications
	- notifications.html
- /search
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

and add <script type="text/javascript" src="js/dwell_gist.js"></script>  to the html
For more, see the dwell example

ADDED TO DWELL
Dwell will now change the background color of the clicked element.  It takes a color as an optional third argument, it defaults to 'facebook blue'.
<script src="http://code.jquery.com/ui/1.10.4/jquery-ui.js"></script> must be added to get the color change properties

### ATTY and MICHAEL To-Do

- Implement SimplePost with new architecture
- server.js basic template
- login.js function (with functions for other js files to call for -login info)
- Links to each of the functionality pages from the homepage, no GUI
	-- i.e. link to Status page, simplepost functionality
- Create .html files for each page (can just be stubs)
- Side bars (copy and paste two divs + center div)


