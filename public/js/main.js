var FB;

$('document').ready(function() {
	queueAdd(getFB);
	// alert('here');
	$('button').dwell(1000, true);
	$('a').dwell(1000, true);
	$(':submit').dwell(1000, true);
});

function getFB() {
	console.log('getFB has been called in main.js...');
	checkLogin(function(givenFB) {
		FB = givenFB;
		start(FB);
	});
}