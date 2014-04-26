var user;

var feedItems = [];
var currentItemIndex = 0;

/*
* start
* 
* start is executed once the document is ready (equivalent to $('document').ready()), and
* the FB object is loaded. All document functions should be defined in this document,
* and functionality should start within this function.
*/
function start(FB) {
	console.log('Welcome to newsfeed.js!');
	console.log('start has been called with FB object: ' + FB);
	FB.api('/me', function(response) {
				user = response;
				console.log('Doing this in newsfeed.js, ' + response.name + '.');
			});

	refreshNewsfeed();

	function refreshNewsfeed() {
		FB.api('/me/home', function(response) {
			if(response && !response.error) {
				renderNewsfeed(response);
			} else {
				console.log('Error: could not retrieve newsfeed');
			}
		});
	}

	function renderNewsfeed(newsfeed) {
		feedItems = newsfeed.data;
		console.log(feedItems);
		renderItem(currentItemIndex);
	}

	function renderItem(index) {
		var item = feedItems[index];
		console.log("Rendering item " + index + ": " + item);
		var from = (item.from) ? item.from : "";
		var story = (item.story) ? item.story : "";
		var description = (item.description) ? item.description : "";
		var message = (item.message) ? item.message : "";

		$(".from").html(from.name);
		$(".story").html(story);
		$(".description").html(description);
		$(".message").html(message);
	}

	$('#next').click(function(e) {
		e.preventDefault();
		currentItemIndex = (currentItemIndex + 1) % 25;
		renderItem(currentItemIndex);
	});

	$('#previous').click(function(e) {
		e.preventDefault();
		currentItemIndex = (currentItemIndex - 1);

		if(currentItemIndex < 0) {
			currentItemIndex = 0;
			refreshNewsfeed();
		} else {
			renderItem(currentItemIndex);
		}
	});

	$('#refresh').click(function(e) {
		e.preventDefault();
		currentItemIndex = 0;
		refreshNewsfeed();
	});
}