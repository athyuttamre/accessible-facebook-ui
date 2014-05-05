/*
This sets up the dwell click, there are a couple different methods of calling dwell click and there
is some sugar in here to support those.  The dwell_script.js has details of how to make the calls. 
It's probably bad if you're looking at this file, so let me know if you're having a hard time.
*/


(function($){
var timeout;
$.fn.image_dwell = function(delay, click, old_img, new_img){
	if (typeof delay === "boolean"){
		click = delay;
	}
	if (typeof delay !== "number")
		delay = 1000;
	

	//when we want to act like regular clicks make links respond on dwellclick events
	if (click)
		$('a').bind('imageDwell', function(){window.location.href = $(this).attr('href');
	});

	return this.each(function(){
		console.log('in here');
		// $(old_img).fadeOut();



		$(this).mouseout(function(e){
			alert('mouseout');
			// $(this).stop();
			// if (timeout){
			// 	$target = $(e.target);
			// 	clearTimeout(timeout);
			// 	// $(this).stop();
			// 	// $(old_img).fadeIn();
			// 	// $(new_img).fadeOut();
			// }	
			$(old_img).css('display','inline-flex');
			// $(old_img).fadeIn();
			// $(new_img).fadeOut();
			// $(this).css("background-color",original_color);
			// $(this).css('color', original_color_2);
		});
		$(this).mouseover(function(e){
			$target = $(e.target);
			$(new_img).fadeIn();
			$(old_img).fadeOut();

			// timeout = setTimeout(function(){
			// 	$target.trigger('imageDwell');
			// 	if (click){
			// 		// $target.trigger('dwell');
			// 		// $(new_img).fadeIn();
			// 		// $(old_img).fadeOut();
			// 	}
			// },delay);
		});
		
	});
};
 
//add some sugar
$.extend({
	'imageDwell' : function(delay, click){
		$('body').image_dwell(delay, click);
	}
});
$.fn.imageDwell = function(fn){
	return this.each(function(){
		$(this).image_dwell(true);
	});
}; 
})(jQuery);