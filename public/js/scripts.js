var FB;

$('document').ready(function() {
	queueAdd(getFB);
});

function getFB() {
	console.log('getFB has been called...');
	isLoggedIn(start);
}

function start(givenFB) {
	FB = givenFB;
	console.log('start has been called with FB object: ' + FB);
	FB.api('/me', function(response) {
			       console.log('Doing this in script.js, ' + response.name + '.');
			     });
}