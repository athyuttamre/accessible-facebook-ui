var user;
var scope = 'publish_actions read_stream user_photos user_friends friends_photos friends_about_me user_about_me friends_location user_location';
$('document').ready(function() {
	queueAdd(start)
});

function start() {
	console.log('start was called in loginPage.js...');
	FB.getLoginStatus(function(response) {
		if(response.status === 'connected') {
			console.log('Logged in, redirecting to index...');
			console.log('////////////////////////////////\n');
			redirect('index');
		} else {
			console.log('User not logged in. Waiting for authorization.');
		}
	});
}

$('button').dwell(1000, true);
$('#loginButton').click(function() {
	FB.login(function(response) {
		if (response.authResponse) {
			user = response;
			console.log('Welcome, ' + user.name);
			redirect('index');
		} else {
			// The person cancelled the login dialog
			console.log('User cancelled connection.');
		}
	}, {scope: scope});
});