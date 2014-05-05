var user;

/*
* start
* 
* start is executed once the document is ready (equivalent to $('document').ready()), and
* the FB object is loaded. All document functions should be defined in this document,
* and functionality should start within this function.
*/
function start(FB) {
	console.log('Welcome to index.js!');
	console.log('start has been called with FB object: ' + FB);
	FB.api('/me', function(response) {
				user = response;
			    console.log('Doing this in index.js, ' + user.name + '.');
			    $('#welcomeMessage').text('Welcome, ' + user.name);
			});

	/*$('#logoutButton').click(function(e) {
		e.preventDefault();
		logout();
	})*/
}