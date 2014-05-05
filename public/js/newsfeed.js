var user;

var feedItems = [];

var nextFeedLink;
var previousFeedLink;

var currentItemIndex = 0;
var currentItemID = 0;

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
	// var w = (window.innerWidth * .6).toString();
	// var h = (window.innerHeight * .6).toString();



	$('#left_bar li:last-of-type').dwell(1000, true);
		$('#left_bar li:last-of-type').click(function(){
		parent.history.back();
		// alert('clicked');
	});
	$('#left_bar li:first-of-type').dwell(1000, true);
		$('#left_bar li:first-of-type').click(function(){
		window.location.href="/";
		// alert('clicked');
	});
	$('#like').dwell(1000, true);
		$('#left_bar').click(function(){
		parent.history.back();
		// alert('clicked');
	})		
	$('#comment').dwell(1000, true);
		$('#left_bar li:last-of-type').click(function(){
		parent.history.back();
		// alert('clicked');
	})	




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
		console.log(newsfeed);

		nextFeedLink = newsfeed.paging.next;
		previousFeedLink = newsfeed.paging.previous;

		feedItems = newsfeed.data;
		console.log(feedItems);
		renderItem(currentItemIndex);
	}

	function renderNext() {
		currentItemIndex = 0;
		request("GET", nextFeedLink, "", renderNewsfeed, "Couldn't load next feed.");
	}

	function renderPrevious(feedItems) {
		currentItemIndex = 0;
		request("GET", previousFeedLink, "", renderNewsfeed, "Couldn't load previous feed.");
	}

	function request(type, url, body, callback, message) {
		var req = new XMLHttpRequest();
		req.open(type, url, true);

		req.addEventListener('load', function(e) {
			if(req.status == 200) {
				var content = req.responseText;
				callback(JSON.parse(content));
			}
			else {
				alert(message);
			}
		});

		req.send(body);
	}

	function renderItem(index) {
		var item = feedItems[index];
		console.log("Rendering item " + index);
		console.log(item);
		currentItemID = (item.object_id) ? item.object_id : item.id;

		if(item.from) {
			var from_id = item.from.id
			var from_name = item.from.name
			var from_photo;

			FB.api("/" + from_id + "/picture",{"type": "large"}, function(response) {
				if (response && !response.error) {
					from_photo = response.data.url;
					$('#from_photo').html("<img src='" + from_photo + "'/>");
					$('#from_name').html(from_name);
				}
				else {
			    	console.log("Error fetching profile picture.");
			      	console.log(response);
			    }
			});
		}

		var story = (item.story) ? item.story : "";
		var description = (item.description) ? item.description : "";
		var message = (item.message) ? item.message : "";
		var picture = (item.picture) ? item.picture : "";
		
		if(picture.endsWith("_s.jpg")) {
			picture = picture.substring(0, picture.length - 5) + "n.jpg";
		}

		console.log('PICTURE '+picture);

		$("#from").html(from.name);
		$("#story").html(story);
		$("#description").html(description);
		$("#message").html(message);
		$("#image").html("<img id='inner_img' src='" + picture + "'>");



		//dynamically formats image
		// var w = '600px';
		// var h = '480px';
		var w = (window.innerWidth * .6).toString()+'px';
		var h = (window.innerHeight * .4).toString()+'px';
		// var w2 = (window.innerWidth * .4).toString()+'px';
		var h2 = (window.innerHeight * .6).toString()+'px';

		$('#from').css('height', h2);
		$('#image > img').css('max-height', h);
		$('#from').css('width', w);
		$('#image > img').css('max-width', w);
		console.log('heigt: '+h);

		// if(picture){
		// 	$('#image > img').css('min-height', h2);
		// 	$('#image > img').css('min-width', w2);
		// }
		
	}

	$('#like').click(function(e) {
		e.preventDefault();
		var postID = currentItemID;
		FB.api("/" + postID + "/likes", "POST", function(response) {
			if(response && !response.error) {
				console.log("Succesfully liked post " + postID);
				console.log(response);
			} else {
				console.log("Error in liking.");
				console.log(response);
			}
		})
	});

	$('.next').dwell(1000, true);
	$('.next').click(function(e) {
		e.preventDefault();
		currentItemIndex = (currentItemIndex + 1) % 25;

		if(currentItemIndex == 0) {
			// Get next 25 posts
			renderNext();
		} else {
			renderItem(currentItemIndex);
		}
	});

	$('.previous').dwell(1000, true);
	$('.previous').click(function(e) {
		e.preventDefault();
		currentItemIndex = (currentItemIndex - 1);

		if(currentItemIndex < 0) {
			renderPrevious();
		} else {
			renderItem(currentItemIndex);
		}
	});

	$('#refresh').dwell(1000, true);
	$('#refresh').click(function(e) {
		e.preventDefault();
		currentItemIndex = 0;
		refreshNewsfeed();
	});

	String.prototype.endsWith = function(suffix) {
    	return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};
}