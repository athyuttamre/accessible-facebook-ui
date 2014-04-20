var FB;

$('document').ready(function() {
	queueAdd(getFB);
});

function getFB() {
	console.log('getFB has been called in scripts.js...');
	isLoggedIn(function(givenFB) {
		FB = givenFB;
		start(FB);
	});
}