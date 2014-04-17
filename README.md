Accessible Facebook UI
====================

An accessible reimplementation of Facebook's core functions, designed to work with eye-tracking technology.


### To-Do

- Implement SimplePost with new architecture
- server.js basic template
- login.js function (with functions for other js files to call for -login info)
- Links to each of the functionality pages from the homepage, no GUI
	-- i.e. link to Status page, simplepost functionality
- Create .html files for each page (can just be stubs)
- Side bars (copy and paste two divs + center div)


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
