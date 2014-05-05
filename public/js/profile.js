var user;
var next_feed_url;
$(document).ready(function() {
	$("#top_bar").hide();
	next_feed_url=null;

	$("#right_bar .side_button").hide();
	// Back bar -- window.back for pages, 
	// 	Goes back to individual picture for individual pictures
	$("#left_bar li:last-of-type").click(function(){
		parent.history.back();
	});

	// Home button 
	$("#left_bar li:first-of-type").click(function(){
		window.location.href="/";
	});

	// Scrolls down
	$("#bottom_bar").click(function(){
		if(meta("type")=="feed"){
			getMoreFeed(next_feed_url);
		}
		scrollVertical(200);
	});

	// Scrolls up when top bar clicked
	$("#top_bar").click(function(){
		scrollVertical(-200);
	});

	// Dwell for top bar
	$("#top_bar").dwell(1000, true);
	
	// Dwell for links on home page
	$(".side_button_nav").on("mouseenter", ".description_link", function(e){
		$(this).find("a").dwell(1000, true);
	});
	// Binds back bar with dwell click
	$("#left_bar li").dwell(1000, true);
	// Dwell for bottom bar
	$("#bottom_bar").dwell(1000, true);
	// Dwell for next bar
	$("#right_bar .side_button:first-of-type").dwell(1000, true);
});

/*
* start
* 
* start is executed once the document is ready (equivalent to $('document').ready()), and
* the FB object is loaded. All document functions should be defined in this document,
* and functionality should start within this function.
*/
function start(FB) {
	var id = meta("user_id");
	if(id==""){
		id="me";
	}
	console.log('Welcome to profile.js!');
	console.log('start has been called with FB object: ' + FB);
	FB.api("/me", function(response) {
		// var id = response.id;
		user = response;
		console.log('Doing this in profile.js, ' + response.name + '.');
		if(id!="me"&&id!=user.id){
			$("#status_div").hide();
		}
	});

	show_user_photos(id);
	var type = meta("type");
	if(type=="about"){
		getAbout(id);
		$("#about").show();
	}else if(type=="feed"){
		get_feed(id);
	}else{
		$("#nav_tabs").show();
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

// Displays user photo
function show_user_photos(id) {
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
		if(response.cover!=undefined){
			$("#user_info").prepend("<div class='cover'><img src='"+response.cover.source+"'></div>");
		}else{
			$("#user_info").prepend("<div class='cover'><p style='float:right'>This user does not have a cover photo</p></div>");
		}
	});
}

// Gets user profile feed
function get_feed(id) {
	$("#feed").show();
	FB.api("/"+id+"/feed", function(response) {
		console.log("feeds ************************");
		console.log(response);
		display_feed(response.data);
		if(response.paging!=undefined&&response.paging.next!=undefined){
			next_feed_url=response.paging.next;
		}
	});
}

// Gets more posts from user feed
function getMoreFeed(url) {
	$.get(url, function(response) {
		display_feed(response.data);
		if(response.paging!=undefined){
			next_feed_url=response.paging.next;
		}else{
			next_feed_url=null;
		}

	});
}

// Shows user feed 
function display_feed (data) {
	for(var x in data){
		if(data[x].type!="link"){
			var str = "<div class='post_container'>"
			str+= "<span class='from_post'>Posted by "+data[x].from.name+"</span>";
			if(data[x].type=="photo"){
				str+="<img src='"+data[x].picture+"'>"
			}
			if(data[x].story!=undefined){
				str+="<p>"+data[x].story+"</p><hr>";
			}
			if(data[x].message!=undefined){
				str+="<p>"+data[x].message+"</p><hr>";
			}
			str+="</div>"
			$("#feed").append(str);
		}
	}
}

// Shows about information for user
function getAbout(id){
	$("#nav_tabs").hide();
	$("#about").show();
	FB.api("/"+id+"?fields=gender,location,work,about,bio,birthday,education,email,hometown,quotes,relationship_status,religion,significant_other", function(response) {
		// Shows gender info
		if(response.gender!=undefined){
			$("#basic").append("<div class='info_container'><span class='info_topic'>Gender</span> <span class='info_data'>"+response.gender+"</span></div>");
		}

		// Shows birthday info
		if(response.birthday!=undefined){
			var bday_arr = response.birthday.split("/");
			var bday=getMonth(bday_arr[0],0)+" "+bday_arr[1];
			if(bday_arr.length>=3){
				bday+=", "+bday_arr[2];
			}
			$("#basic").append("<div class='info_container'><span class='info_topic'>Birthday </span><span class='info_data'>"+bday+"</span></div>");
		}

		// Shows location info
		if(response.location!=undefined){
			$("#basic").append("<div class='info_container'><span class='info_topic'>Location </span><span class='info_data'>"+response.location.name+"</span></div>");
		}

		// Shows relationship_status info
		if(response.relationship_status!=undefined){
			if(response.significant_other!=undefined){
				$("#basic").append("<div class='info_container'><span class='info_topic'>Relationship Status </span><span class='info_data'>"+response.relationship_status+" with "+response.significant_other.name+"</span></div>");

			}else{
				$("#about").append("<div class='info_container'><span class='info_topic'>Relationship Status </span><span class='info_data'>"+response.relationship_status+"</span></div>");

			}
		}

		// Shows work info
		if(response.work!=undefined){
			var str = "<div class='info_container'>Work<hr> ";
			for(var x in response.work){
				var startDate = "";//;
				if(response.work[x].start_date!=undefined){
					var arr=response.work[x].start_date.split("-");
					startDate+=getMonth(arr[1],0)+" "+arr[0];
				}
				if(response.work[x].end_date!=undefined){
					var arr=response.work[x].end_date.split("-");
					startDate+=" to "+getMonth(arr[1],0)+" "+arr[0];
				}
				str+="<span class='info_topic'>"+response.work[x].employer.name+"</span><span class='info_data'> "+startDate+"</span><br>";
			}
			str+="</div>";
			$("#work").append(str);
		}

		// Shows education info
		if(response.education!=undefined){
			var str = "<div class='info_container'>Education<hr> ";
			for(var x in response.education){
				var schoolType = "";
				if(response.education[x].type!=undefined){
					schoolType=" ~ "+response.education[x].type;
				}
				var year = "";
				if(response.education[x].year!=undefined){
					year=" ~ "+response.education[x].year.name;
				}
				var major = "";
				if(response.education[x].concentration!=undefined){
					major=" ~ Major ";
					for(var y in response.education[x].concentration){
						major+=" ~ "+response.education[x].concentration[y].name;
					}
				}
				str+="<span class='info_topic'>"+response.education[x].school.name+"</span><span class='info_data'>"+schoolType+major+year+"</span><br>";
			}
			str+="</div>";
			$("#education").append(str);
		}

		// Shows quote info
		if(response.quotes!=undefined){
			console.log();
			var arr = response.quotes.split("\n");
			var str = "<div class='info_container'>Quotes<hr> "
			for(var x in arr){
				if(arr[x]!=""){
					str+="<span class='info_data'>"+arr[x]+"</span><br>"
				}
			}
			str+="</div>";
			$("#quotes").append(str);
		}
	});
}

// Returns the name of the month given the month number, 
//	in one of 2 formats
function getMonth(mon,format){
	var months = {
		"01":["January", "Jan"],
		"02":["February","Feb"],
		"03":["March", "Mar"],
		"04":["April", "Apr"],
		"05":["May", "May"],
		"06":["June", "Jun"],
		"07":["July","Jul"],
		"08":["August","Aug"],
		"09":["September","Sept"],
		"10":["October", "Oct"],
		"11":["November","Nov"],
		"12":["December","Dec"]
	}
	if(months[mon]!=undefined){
		return months[mon][format];
	}else{
		return "";
	}
}

// Gets meta data by name from html page
function meta(name) {
    var tag = document.querySelector('meta[name=' + name + ']');
    if (tag != null)
        return tag.content;
    return '';
}