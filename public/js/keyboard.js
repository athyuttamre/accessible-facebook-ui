$(document).ready(function() {
	
	var focusedBoxID = '';

	// Get keyboard HTML
	var keyboardHTML;
	$.ajax({url: '/keyboard', success: function(data) {
		console.log('Loaded keyboard...');
		keyboardHTML = data;
	}});

	// Add keyboard when input or textarea's areas in focus
	$('input, textarea').focus(function() {
		$('#keyboard_container').show();
		var id = $(this).attr('id');
		focusedBoxID = id;
		$('body').prepend(keyboardHTML);
		$('#keyboard_positioner').animate({bottom: '0px'}, 400, function() {
			$('#keyboard li').dwell(1000, true);
			initializeKeyboard(id);
		});
	});

	// Remove keyboard when focused input or textarea loses focus
	$('input, textarea').focusout(function() {
		if($(this).attr('id') == focusedBoxID) {
			$('#keyboard_positioner').animate({bottom: '-250px'}, 400, function() {
				$('#keyboard_container').remove();
				focusedBoxID = '';
			});
		}
	});

	// Make keyboard functional
	function initializeKeyboard() {
		console.log('initializeKeyboard was called with writeID ' + focusedBoxID);
		var $write = $('#' + focusedBoxID),
			shift = false,
			capslock = false;

		$('#keyboard li').click(function(){
			var $this = $(this),
				character = $this.html(); // If it's a lowercase letter, nothing happens to this variable
			
			// Shift keys
			if ($this.hasClass('left-shift') || $this.hasClass('right-shift')) {
				$('.letter').toggleClass('uppercase');
				$('.symbol span').toggle();
				
				shift = (shift === true) ? false : true;
				capslock = false;
				return false;
			}
			
			// Caps lock
			if ($this.hasClass('capslock')) {
				$('.letter').toggleClass('uppercase');
				capslock = true;
				return false;
			}
			
			// Delete
			if ($this.hasClass('delete')) {
				var html = $write.html();
				
				$write.html(html.substr(0, html.length - 1));
				return false;
			}
			
			// Special characters
			if ($this.hasClass('symbol')) character = $('span:visible', $this).html();
			if ($this.hasClass('space')) character = ' ';
			if ($this.hasClass('tab')) character = "\t";
			if ($this.hasClass('return')) character = "\n";
			
			// Uppercase letter
			if ($this.hasClass('uppercase')) character = character.toUpperCase();
			
			// Remove shift once a key is clicked.
			if (shift === true) {
				$('.symbol span').toggle();
				if (capslock === false) $('.letter').toggleClass('uppercase');
				
				shift = false;
			}
			
			// Add the character
			$write.html($write.html() + character);
		});
	}
});