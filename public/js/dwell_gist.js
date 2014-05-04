/*
This sets up the dwell click, there are a couple different methods of calling dwell click and there
is some sugar in here to support those.  The dwell_script.js has details of how to make the calls. 
It's probably bad if you're looking at this file, so let Abby know if you're having a hard time.
*/


(function($){
var timeout;
$.fn.dwell = function(delay, click, new_color, new_color_2){
	if (typeof delay === "boolean"){
		click = delay;
	}
	if (typeof delay !== "number")
		delay = 1000;
	//error check
	if (new_color === undefined)
		new_color = '#4860a5';
	if(new_color_2 === undefined)
		new_color_2 = 'white';
	// console.log(new_color);
	console.log(this.attr('id'));
	

	//when we want to act like regular clicks make links respond on dwellclick events
	if (click)
		$('a').bind('dwellClick', function(){window.location.href = $(this).attr('href');
	});

	return this.each(function(){
		console.log('this '+this);
		var original_color = $(this).css('background-color');
		var original_color_2 = $(this).css('color');
		$(this).mouseout(function(e){
			$(this).stop();
			if (timeout){
				$target = $(e.target);
				clearTimeout(timeout);
				$(this).stop();
				$(this).css("background-color",original_color);
				$(this).css('color', original_color_2);
			}	
			$(this).css("background-color",original_color);
			$(this).css('color', original_color_2);
		});
		$(this).mouseover(function(e){
			$target = $(e.target);
			$(this).css("background-color",original_color);

				$(this).animate({
				    backgroundColor: new_color
				  }, delay, function() {
				 });
				$(this).animate({
				    color: new_color_2
				  }, delay, function() {
				 });			
				$(this).css("background-color",original_color);



			timeout = setTimeout(function(){
				$target.trigger('dwellClick');
				if (click){
					$target.trigger('click');
					$(this).css("background-color",original_color);
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