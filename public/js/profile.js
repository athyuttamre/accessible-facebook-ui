var user;
/*
* start
* 
* start is executed once the document is ready (equivalent to $('document').ready()), and
* the FB object is loaded. All document functions should be defined in this document,
* and functionality should start within this function.
*/
function start(FB) {
	console.log('Welcome to profile.js!');
	console.log('start has been called with FB object: ' + FB);
	FB.api("/me", function(response) {
		var id = response.id;
		user = response;
		console.log('Doing this in profile.js, ' + response.name + '.');
	});

	FB.api("/me/picture?type=large", function(response) {
		var url = response.data.url;
		$("#user_info").prepend("<div class='user_photo'><img src='"+url+"'></div>");
	});

	FB.api("/me?fields=cover,name_format,first_name,last_name", function(response) {
		var name = response.first_name+" "+response.last_name;
		if(response.name_format!="{first} {last}"){
			name = response.last_name+" "+response.first_name;
		}
		$("#user_info").prepend("<div class='username'>"+name+"</div>");
		$("#user_info").prepend("<div class='cover'><img src='"+response.cover.source+"'></div>");
	});

	if(meta("type")=="about"){
		getAbout();
	}
}

function getAbout(){
	FB.api("/me?fields=gender,location,work", function(response) {
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