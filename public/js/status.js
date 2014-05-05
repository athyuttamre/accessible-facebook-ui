var user;

/*
* start
* 
* start is executed once the document is ready (equivalent to $('document').ready()), and
* the FB object is loaded. All document functions should be defined in this document,
* and functionality should start within this function.
*/
function start(FB) {
	console.log('Welcome to status.js!');
	console.log('start has been called with FB object: ' + FB);
	FB.api('/me', function(response) {
				user = response;
				console.log('Doing this in status.js, ' + response.name + '.');
			});

	$('textarea, input').dwell(1000, true, 'white', 'black');
	// $('textarea, input').click(function(e){
	// 	$('textarea, input').focus();
	// });
	$('#right_bar').dwell(1000, true);
	$('#right_bar').click(function(){
		$('#statusForm').submit();
	})
	// $('#right_bar').image_dwell(1000, true, '.RightButton', '.WhiteRightButton');
	// $(':submit').dwell(1000, true);
	// fade_arrows('#right_bar', '.RightButton', '.WhiteRightButton');
	$('#statusForm').submit(function(e) {
		e.preventDefault();
		var body = $('#statusInput').val();
		FB.api('/me/feed', 'post', { message: body }, function(response) {
		  	if (!response || response.error) {
		    	console.log('Error occured, could not post.');
		  	} else {
		  		console.log('Posted status update: ' + body);
		    	console.log('Post ID: ' + response.id);
		  	}
		});
		$('#statusForm')[0].reset();
	})
}

function fade_arrows(cont, img1, img2){
	// $(img2).css('display', 'none');
	$(cont).mouseout(function(e){
			// alert('mouseout');
			// $(img1).
		});
	$(cont).mouseenter(function(e){
			alert('mousein');
			$(img2).fadeIn();
		});	

}