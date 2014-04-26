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

	FB.api('/me/home', function(response) {
		if(response && !response.error) {
			renderNewsfeed(response);
		} else {
			console.log('Error: could not retrieve newsfeed');
		}
	});

	function renderNewsfeed(newsfeed) {
		feedItems = newsfeed.data;
		renderItem(currentItemIndex);
	}

	function renderItem(index) {
		console.log(feedItems);
		var item = feedItems[index];
		console.log("Rendering item " + index + ": " + item);
		var from = item.from;
		var story = item.story;
		var description = item.description;
	}
}