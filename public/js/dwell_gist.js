/*
This sets up the dwell click, there are a couple different methods of calling dwell click and there
is some sugar in here to support those.  The dwell_script.js has details of how to make the calls. 
It's probably bad if you're looking at this file, so let me know if you're having a hard time.
*/


(function($){
var timeout;
$.fn.dwell = function(delay, click){
	if (typeof delay === "boolean"){
		click = delay;
	}
	if (typeof delay !== "number")
		delay = 1000;
 
	//when we want to act like regular clicks make links respond on dwellclick events
	if (click)
		$('a').bind('dwellClick', function(){window.location.href = $(this).attr('href');
	});

	return this.each(function(){
		$(this).mouseout(function(e){
			if (timeout){
				clearTimeout(timeout);
			}
		});
		$(this).mouseover(function(e){
			timeout = setTimeout(function(){
				$target = $(e.target);
				$target.trigger('dwellClick');
				if (click){
					$target.trigger('click');
				}
			},delay);
		});
		
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