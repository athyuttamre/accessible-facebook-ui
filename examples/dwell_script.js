var timeout;

window.onload = function() {
	/*
	To set up dwell click for a specific id use the following call:
		$('#id').dwell(time to dwell for, whether you want normal click enabled too)
	The goal is to abstract these into the script so you'll never have to see them.
	*/ 

	//with an id
	$('#dwell').dwell(1000, true, 'green');
	//with an element
	$('a').dwell(1000, true);
	//with a class
	$('.aclass').dwell(1000, true);

	//then add normal jquery click stuff!
	//for a div
	$('#dwell').click(function(){
		alert('dwell clicked');
	})
	//for a button
	$('.aclass').click(function(){
		alert('dwell clicked a button');
	})


};


