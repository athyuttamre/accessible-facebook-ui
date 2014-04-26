var FB;

$('document').ready(function() {
	queueAdd(getFB);
});

function getFB() {
	console.log('getFB has been called in main.js...');
	checkLogin(function(givenFB) {
		FB = givenFB;
		start(FB);
	});
}