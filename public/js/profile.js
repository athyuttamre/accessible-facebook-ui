var user;

$(document).ready(function() {
	$("#top_bar").hide();
	
	$("#frame").scroll(function() {
		if($("#frame").scrollTop()==0){
			$("#top_bar").hide();
			// console.log("scroll0");
		}else{
			$("#top_bar").show();

		}
	});


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
	var id = meta("user_id");
	if(id==""){
		id="me";
	}
	var id = "Sydney.Sprinkle";
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
		if(id!="me"&&id!=user.id){
			console.log(id=="me");
			$("#status_div").hide();
			// $("#nav_tabs ul").prepend("<li><div class='side_button_nav'><div class='description'>Post Status</div><div class='description_link'><a href='/status'><img src='/images/page_framework/RightButton.svg'></a></div></div></li>")
		}
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

function getAbout(id){
	$("#nav_tabs").hide();
	$("#about").show();
	FB.api("/"+id+"?fields=gender,location,work,about,bio,birthday,education,email,hometown,quotes,relationship_status,religion,significant_other", function(response) {
		// Shows gender info
		if(response.gender!=undefined){
			$("#about").append("<div class='info_container'><span class='info_topic'>Gender</span> <span class='info_data'>"+response.gender+"</span></div>");
		}

		// Shows birthday info
		if(response.birthday!=undefined){
			var bday_arr = response.birthday.split("/");
			var bday=getMonth(bday_arr[0],0)+" "+bday_arr[1];
			if(bday_arr.length>=3){
				bday+=", "+bday_arr[2];
			}
			$("#about").append("<div class='info_container'><span class='info_topic'>Birthday </span><span class='info_data'>"+bday+"</span></div>");
		}

		// Shows location info
		if(response.location!=undefined){
			$("#about").append("<div class='info_container'><span class='info_topic'>Location </span><span class='info_data'>"+response.location.name+"</span></div>");
		}

		// Shows relationship_status info
		if(response.relationship_status!=undefined){
			if(response.significant_other!=undefined){
				$("#about").append("<div class='info_container'><span class='info_topic'>Relationship Status </span><span class='info_data'>"+response.relationship_status+" with "+response.significant_other.name+"</span></div>");

			}else{
				$("#about").append("<div class='info_container'><span class='info_topic'>Relationship Status </span><span class='info_data'>"+response.relationship_status+"</span></div>");

			}
		}

		// Shows work info
		if(response.work!=undefined){
			var str = "<div class='info_container'>Work<br> ";
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
			$("#about").append(str);

		}

		// Shows education info
		if(response.education!=undefined){
			var str = "<div class='info_container'>Education<br> ";
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
					major="~ Major ";
					for(var y in response.education[x].concentration){
						major+=" ~ "+response.education[x].concentration[y].name;
					}
				}
				str+="<span class='info_topic'>"+response.education[x].school.name+"</span><span class='info_data'>"+schoolType+major+year+"</span><br>";
			}
			str+="</div>";
			$("#about").append(str);
		}

		if(response.quotes!=undefined){
			$("#about").append("<div class='info_container'><span class='info_topic'>Quotes </span><span class='info_data'>"+response.quotes+"</span></div>");

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

	return months[mon][format];
}

// Gets meta data by name from html page
function meta(name) {
    var tag = document.querySelector('meta[name=' + name + ']');
    if (tag != null)
        return tag.content;
    return '';
}