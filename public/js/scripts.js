var FB;

var dwellTime = 1000;

$('document').ready(function() {
	queueAdd(getFB);

/////////// rough
	// $('button, a').dwell(1000, true);

	// $('.notdwell').notDwell();
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