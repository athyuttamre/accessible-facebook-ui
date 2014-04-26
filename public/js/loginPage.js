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

function loginToFacebook() {
	FB.login(function(response) {
		if (response.authResponse) {
			console.log('Welcome, ' + response.name);
			redirect('index');
		} else {
			// The person cancelled the login dialog
			console.log('User cancelled connection.');
		}
	}, {scope: 'publish_actions read_stream'});
}