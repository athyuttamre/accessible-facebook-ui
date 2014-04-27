/*
This sets up the dwell click, there are a couple different methods of calling dwell click and there
is some sugar in here to support those.  The dwell_script.js has details of how to make the calls. 
It's probably bad if you're looking at this file, so let me know if you're having a hard time.
*/


(function($){
var timeout;
$.fn.dwell = function(delay, click, new_color){
	if (typeof delay === "boolean"){
		click = delay;
	}
	if (typeof delay !== "number")
		delay = 1000;
	//error check
	if (new_color === undefined)
		new_color = '#4860a5';
	console.log(new_color);

	

	//when we want to act like regular clicks make links respond on dwellclick events
	if (click)
		$('a').bind('dwellClick', function(){window.location.href = $(this).attr('href');
	});

	return this.each(function(){
		var original_color = $(this).css('background-color');
		$(this).mouseout(function(e){
			if (timeout){
				$target = $(e.target);
				clearTimeout(timeout);
				$target.stop();
				//return to original color/ style
			}	
			$target.css("background-color",original_color);
		});
		$(this).mouseover(function(e){
			$target = $(e.target);
			$target.css("background-color",original_color);
			$target.animate({
			    backgroundColor: new_color
			  }, delay, function() {
			 });
			$target.css("background-color",original_color);
			timeout = setTimeout(function(){
				$target.trigger('dwellClick');
				if (click){
					$target.trigger('click');
				}
			},delay);
		});
		$(this).css("background-color",original_color);
		
	});
};
 
//add some sugar
$.extend({
	'dwell' : function(delay, click){
		$('body').dwell(delay, click);
	}
});
$.fn.dwellClick = function(fn){
	return this.each(function(){
		$(this).dwell(true);
	});
}; 
})(jQuery);