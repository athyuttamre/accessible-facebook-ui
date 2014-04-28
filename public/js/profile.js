var user;

$(document).ready(function() {
	// Binds thumbnail picture image with click event
	$("#mainPhoto").on("click", ".photos", function(e){
		console.log("clicked");
		var data = $(this).attr("data-all").split(",");
		if(data.length<3){
			goToPic(data[0].trim(),data[1].trim());
		}else{
			goToPic(data[0].trim(),data[1].trim(),data[2].trim());
		}
	});

	// Back bar -- window.back for pages, 
	// 	Goes back to individual picture for individual pictures
	$("#left_bar").click(function(){
	});

	// Scrolls down
	$("#bottom_bar").click(function(){
		scrollVertical(200);
	});
	// Goes to next picture if looking at individual pictures when TOP 
	//	view bar on right is clicked 
	$("#right_bar .side_button:first-of-type").click(function(){
		
	});

	// Scrolls up when top bar clicked
	$("#top_bar").click(function(){
		scrollVertical(-200);
	});

	// 	TODO This is where you want to add funcionality for commenting 
	//		and liking things
	$("#right_bar .side_button:last-of-type").on("click", function(){
		// alert("LOLOLOOLOL");
	});

	// Dwell for top bar
	// $("#top_bar").dwell(1000, true);
	// // Enables dwell click for dynamically generated html folders
	// $("#frame").on("mouseenter", ".innerfolder", function(e){
	// 	$(this).dwell(1000, true);
	// });

	// // Dwell clicks when user mouses over image thumbnail
	// $(".inner_folder").on("mouseenter", ".photos", function(e){
	// 	$(this).dwell(1000,true);
	// });
	
	// // Binds back bar with dwell click
	// $("#left_bar").dwell(1000, true);
	// // Dwell for bottom bar
	// $("#bottom_bar").dwell(1000, true);
	// // Dwell for next bar
	// $("#right_bar .side_button:first-of-type").dwell(1000, true);
});

/*
* start
* 
* start is executed once the document is ready (equivalent to $('document').ready()), and
* the FB object is loaded. All document functions should be defined in this document,
* and functionality should start within this function.
*/
function start(FB) {
	var id = meta("id");
	if(id==""){
		id="me";
	}
	// var id = "Sydney.Sprinkle";
	// var id = "elyse.mcmanus";
	// var id = "zachariah.u.medeiros";
	// var id = "meghan.dushko";
	// var id = "beverly.naigles";
	// var id = "stanton.tomson";

	console.log('Welcome to profile.js!');
	console.log('start has been called with FB object: ' + FB);
	FB.api("/me", function(response) {
		// var id = response.id;
		user = response;
		console.log('Doing this in profile.js, ' + response.name + '.');
	});

	FB.api("/"+id+"/picture?type=large", function(response) {
		var url = response.data.url;
		$("#user_info").prepend("<div class='user_photo'><img src='"+url+"'></div>");
	});

	FB.api("/"+id+"?fields=cover,name_format,first_name,last_name", function(response) {
		var name = response.first_name+" "+response.last_name;
		if(response.name_format!="{first} {last}"){
			name = response.last_name+" "+response.first_name;
		}
		$("#user_info").prepend("<div class='username'>"+name+"</div>");
		$("#user_info").prepend("<div class='cover'><img src='"+response.cover.source+"'></div>");
	});

	if(meta("type")=="about"){
		getAbout(id);
	}
}

// Scrolls up or down page
function scrollVertical(num) {
    var iScroll = $("#frame").scrollTop();
    iScroll = iScroll + num;
    $("#frame").animate({
    	scrollTop: iScroll
    }, 1000);
}

function getAbout(id){
	FB.api("/"+id+"?fields=gender,location,work,about,bio,birthday,education,email,hometown,quotes,relationship_status,religion,significant_other", function(response) {
		console.log("************");
		console.log(response);
		console.log("************");

	});
}

// Gets meta data by name from html page
function meta(name) {
    var tag = document.querySelector('meta[name=' + name + ']');
    if (tag != null)
        return tag.content;
    return '';
}