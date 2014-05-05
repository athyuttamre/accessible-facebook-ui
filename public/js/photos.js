var user;
var curr_pic;
var first_photo=null;
var pause = false;
$(document).ready(function() {
	// Hides right side bar nav buttons
	$("#right_bar li").hide();

	// Hides top side bar nav button since user already at top of page
	$("#top_bar").hide();

	// Hides bottom nav button if at bottom of page
	$("#frame").scroll(function() {
		if($("#frame").scrollTop()==0){
			$("#top_bar").hide();
		}else{
			$("#top_bar").show();
		}
		var container = $('#frame');
        var height = container.height();
        var scrollHeight = container[0].scrollHeight;
        var st = container.scrollTop();
        if(st >= scrollHeight - height){
			$("#bottom_bar").hide();
        }else{
			$("#bottom_bar").show();
		}
	});

	// Shows comment form for pictures
	$("#right_bar li:nth-of-type(2)").on("click", function(){
		// Hides everything in the frame
		$("#main_container:not(#keyboard_container)").hide();
		// Hides all right side bar content (like, comment, next functionality)
		$("#right_bar li:not(#keyboard_container)").hide();
		// Appends new right side bar content for submitting form
		$("#right_bar ul").append("<li id='tmp_button'><div class='side_button'><img src='/images/page_framework/RightButton.svg'><p>Submit</p></div></li>");
		// Appends form in new div
		// $("#dialog").show();
		$("#comment_form").show();

		//ADDED THIS BIT RIGHT HERE!!!!!
		$.getScript( "/js/keyboard.js", function() {
			console.log( "Load was performed." );
		});
	});

	// Binds "submit" button on right bar to submitting comment form
	$("#right_bar").on("click","#tmp_button",function(e){
		// $("#form_button").click();
		$("#form_button").click();

	});

	// Submits comments on a picture and returns page back to 
	//	previous state
	// $("#frame").on("click","#form_button",function(){

	$('#comment_form').submit(function(e) {
		e.preventDefault();
		var body = $('#form_input').val();
		$('#comment_form textarea').html('');
		FB.api("/"+curr_pic+"/comments", "post", {message:body},  function(response) {
			console.log(response);
		});
		$("#main_container").show();
		$("#keyboard_container").remove();
		$("#comment_form").hide();

		$("#tmp_button").remove();
		$("#right_bar li").show();
	});

	// Binds thumbnail picture image with click event
	$('#mainPhoto').dwell(1000, true, 'white', 'white');
	$("#mainPhoto").on("click", ".photos", function(e){
		if(!pause){
			var data = $(this).attr("data-all").split(",");
			if(data.length<3){
				// Goes to "Photo" / "Tagged Photos" pic
				goToPic(data[0].trim(),data[1].trim());
			}else{
				// Goes to "Albums" pic
				goToPic(data[0].trim(),data[1].trim(),data[2].trim());
			}
		}
	});

	// Home button
	$("#left_bar li:first-of-type").click(function(){
		window.location.href="/";
	});

	// Back bar -- window.back for pages, 
	// 	Goes back to individual picture for individual pictures
	$("#left_bar li:nth-of-type(2)").click(function(){
		getPageType();
	});

	// $("#left_bar li:last-of-type").click(function(){
	// 	pause = !pause;
	// 	console.log("PAUSED CHANGED "+pause);
	// 	if(pause){
	// 		$("#left_bar li:last-of-type p").text("Unpause Main Content");
	// 	}else{
	// 		$("#left_bar li:last-of-type p").text("Pause Main Content");
	// 	}
	// });

	// Scrolls down
	$("#bottom_bar").click(function(){
		$(".loadMore").click();
		scrollVertical(300);
	});

	// Goes to next picture if looking at individual pictures when TOP 
	//	nav bar on right is clicked (the one that sayd "next")
	$("#right_bar li:first-of-type").click(function(){
		// If one picture is being displayed, as opposed to an album
		if(meta("one_pic")=="true"){
			var data = $("#mainPhoto img").attr("data-all");
			var data_lis = data.split(",");
			// Get next picture in the list
			if(data_lis[0]=="albums"){
				var next = album_data[data_lis[2]]["pics"][data_lis[1]].my_next;
				if(next==null){
					// Loads more photos if there are any
					//	"next" is null if there are more pics to be loaded
					$("#mainPhoto").append(album_data[data_lis[2]].button);
					$(".loadMore").click();
				}else{
					goToPic(data_lis[0],next,data_lis[2]);
				}
			}else{
				var next = pic_data[data_lis[0]]["data"][data_lis[1]].my_next;
				if(next==null){
					// Loads more photos if there are any
					//	"next" is null if there are more pics to be loaded
					$("#mainPhoto").append(pic_data[data_lis[0]].loadMore);
					$(".loadMore").click();
				}else{
					goToPic(data_lis[0],next,data_lis[1]);
					
				}
			}
		}
	});

	// Scrolls up when top bar clicked
	$("#top_bar").click(function(){
		scrollVertical(-300);
	});

	// *DWELL*
	// ***************KEYBOARD START
	$('textarea, input').dwell(1000, true, 'white', 'black');
	// $('#frame').dwell(1000, true, $('#frame').css('background-color'));
	// $('#frame').click(function(){
		// $('textarea').blur();
	// })
	$('#right_bar').mouseenter(function(){
		$('textarea').blur();
		console.log('lol');
	});
	// ***************KEYBOARD END
	// Keyboard dwelling
	//	This is where you like things
	// $("#frame").on("mouseenter", ".innerfolder", function(e) {
	// 	console.log("click adfdsf");
	// 	if(pause){
	// 		return false;
	// 	}
	// 	$(this).dwell(1000, true);
	// });

	// $("#frame").on("click", ".innerfolder", function(e) {
	// 	e.preventDefault();
	// 	console.log("click adfdsf");
	// 	if(pause){
	// 		return false;
	// 	}
	// 	// $(this).dwell(1000, true);
	// });
	

	$("#right_bar li:last-of-type").on("click", function(){
		FB.api("/"+curr_pic+"/likes", "post",  function(response) {
		});
	});
	// Dwell for comment submit button 
	$("#right_bar").on("mouseenter", "#tmp_button", function(){
		$(this).dwell(1000,true);
	});
	// Dwell for top bar
	$("#top_bar").dwell(1000, true);
	// Enables dwell click for dynamically generated html folders
	$("#main_container").on("mouseenter", ".innerfolder", function(e){
		if(!pause){
			console.log("it's here 2 ");
			$(this).dwell(1000, true);
		}
	});

	$(".folders").on("click", ".innerfolder", function(e){
		console.log("hahah here ");
		if(!pause){
			var data = $(this).attr("data-all");
			console.log("DATA DDD "+data);
			window.location.href=data;
		}
	});

	// Dwell clicks when user mouses over image thumbnail
	$("#mainPhoto").on("mouseenter", ".photos", function(e){
		if(!pause){
			$(this).dwell(1000, true);
		}
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
	console.log('Welcome to messaging.js!');
	console.log('start has been called with FB object: ' + FB);
	FB.api('/me', function(response) {
		user = response;
		console.log('Doing this in messaging.js, ' + response.name + '.');
		
		var name = meta("page");
		var id =meta("user_id");
		if(id==""){
			id="/me"
		}
		// Displays top bar with user photo and cover picture
		show_user_photos(id);
		// Gets photos depending on what folder user is in
		renderApp(id);
		// Displays photos
		showData(name, id);
	});
}

// Scrolls up or down page
function scrollVertical(num) {
    var iScroll = $("#frame").scrollTop();
    iScroll = iScroll + num;
    $("#frame").animate({
    	scrollTop: iScroll
    }, 1000);

}

// Gets info on whether there is a single photo being viewed or not
function getPageType(){
	// If comment box is visible
	// if($("#dialog").is(":visible")){
	if($("#comment_form").is(":visible")){
		$("#main_container").show();
		$("#keyboard_container").remove();
		$("#comment_form").hide();
		$("#tmp_button").remove();
		$("#right_bar li").show();
	// If only one picture is not being displayed
	}else if(meta("one_pic")=="false"&&first_photo==null){
		parent.history.back();
		return false; 
	}else{
		var data = $("#mainPhoto img").attr("data-all");
		var data_lis = data.split(",");
		if(data_lis[0]=="albums"){
			var prev = album_data[data_lis[2]]["pics"][data_lis[1]].my_previous;
			curr_pic=prev;
			// If current picture is first one clicked on to enter into 
			//	single photo viewing
			if(data_lis[1]==first_photo){
				changeMeta("one_pic", "false");
				first_photo=null;
				window.location.reload();
				return false;
			}
			// If first picture in album
			if(prev==null){
				window.location.reload();
				return false;
			}else{
				// Goes to previous picture otherwise
				goToPic(data_lis[0],prev,data_lis[2]);
			}
		}else{
			var prev = pic_data[data_lis[0]]["data"][data_lis[1]].my_previous;
			curr_pic=prev;
			// If current picture is first one clicked on to enter into 
			//	single photo viewing
			if(data_lis[1]==first_photo){
				changeMeta("one_pic", "false");
				first_photo=null;
				window.location.reload();
				return false;
			}
			// If first picture in album
			if(prev==null){
				window.location.reload();
				return false;
			}else{
				// Goes to previous picture otherwise
				goToPic(data_lis[0],prev,data_lis[1]);
			}
		}
	}
}

// Takes meta data and displays correct info based on what album the 
//	user is in
function showData(name, id) {
	if(name=="photos"){
		getPhotos(id, "photos", pic_data.photos, "/photos", "phot");
		$("#phot").css("color","black");
		$("#phot").css("background-color","white");
	}else if(name=="photos_tagged"){
		getPhotos(id, "photos_tagged", pic_data.photos_tagged, "/photos/uploaded", "photTag");	
		$("#photTag").css("color","black");
		$("#photTag").css("background-color","white");	
	}else if(name=="albums"){
		var pageid = meta("page_id");
		if(pageid!=""){
			getAlbums(id,"albums", pageid);
		}else{
			$("#alb").css("color","black");
			$("#alb").css("background-color","white");
			getAlbums(id,"albums");
		}
	}
}

// Displays user profile picture and cover photo
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

// Gets meta data by name from html page
function meta(name) {
    var tag = document.querySelector('meta[name=' + name + ']');
    if (tag != null)
        return tag.content;
    return '';
}

// Global variable to store picture info and album info
var pic_data = {"photos":{"next":null,"data":{},"num":0,"loadMore":null},"albums":{"next":null,"data":{},"num":0,"loadMore":null},"photos_tagged":{"next":null,"data":{},"num":0,"loadMore":null}};

// Global variable to store picture info albums
var album_data = {};

// Loads the preliminary info on the page when user first enters
// Function that shows folders at top bar
function renderApp(id) {
	console.log('renderApp was called');
	$("#folders").append("<button id='phot' class='innerfolder' data-all='/"+id+"/photos/photos'>Photos</button>");
	$("#folders").append("<button id='photTag' class='innerfolder' data-all='/"+id+"/photos/photos_tagged'>Tagged Photos</button>");
	$("#folders").append("<button id='alb' class='innerfolder' data-all='/"+id+"/photos/albums'>Albums</button>");
	// $("#folders").append("<div id='phot' class='innerfolder'><a href='/"+id+"/photos/photos'>Photos</a></div>");
	// $("#folders").append("<div id='photTag' class='innerfolder'><a  href='/"+id+"/photos/photos_tagged'>Tagged Photos</a></div>");
	// $("#folders").append("<div id='alb' class='innerfolder'><a href='/"+id+"/photos/albums'>Albums</a></div>");
}

// Checks to see if nav bars should be displayed or not
function checkBars(){
	if(meta("one_pic")=="false"){
		$("#right_bar").hide();
	}else{
		$("#right_bar").show();
	}
}

// Displays albums 
// Executed when "Albums" folder in nav bar is clicked 
function showAlbum(name,id){
	var next = pic_data.albums.next;
	var data = pic_data.albums.data;
	$("#mainPhoto").empty();
	$("#mainPhoto").show();

	$('#mainPhoto').append(pic_data.albums.loadMore);
	for(var x in data){
		$("#mainPhoto").append("<button class='innerfolder'><a href='/"+id+"/photos/albums/"+x+"'>"+data[x].name+"</a></button>");

		// $("#mainPhoto").append("<button class='innerfolder' data-all='/"+id+"/photos/albums/"+x+"'>"+data[x].name+"</button>");
	}
}

// Displays thumbnail photos for a given folder 
function showPics(name){
	var data = pic_data[name];
	var arr = pic_data[name].data;
	$("#mainPhoto").empty();
	$("#mainPhoto").show();
	$("#mainPhoto").append(data.loadMore);
	for(var x in arr){
		$("#mainPhoto").append("<button class='photos' data-all='"+name+", "+arr[x].id+"'><img src='"+arr[x].picture+"' data-all='"+arr[x].id+"'></button>");
	}
}

// Gets photos from FB api 
function getPhotos(id, toAppend, data, toUpload, toHide){
	FB.api(id+toUpload, function(response) {
		if(response!=undefined && response.data!=undefined && response.data.length>0){
			var arr = response.data;
			var next = response.paging.next;
			data.next=next;
			data.loadMore="<button class='loadMore' style='display:none' onclick='loadPosts(\""+toAppend+"\")'>Load More</button>";
			var firstID = arr[0].id;
			if(next!=null||next!=undefined){
				firstID = null;
			}
			var prevID = null;
			for(var x in arr){
				arr[x].my_previous = prevID;
				arr[x].my_next = firstID;
				
				if(prevID!=null){
					data.data[prevID].my_next=arr[x].id;
				}
				prevID=arr[x].id;
				data.data[arr[x].id]=arr[x];
			}
		}else{
			$("#container_inner").append("<div>This user has no photos in this album.</div>");
		}
		showPics(toAppend);
	});
}

// Displays albums when album page is loaded
function getAlbums(id,toAppend,albId){
	FB.api(id+'/albums', function(response) {
		if(response.data.length>0){
			var arr = response.data;
			var next = response.paging.next;
			pic_data.albums.next=next;
			if(next==undefined){
				pic_data.albums.loadMore="<button class='loadMore' style='display:none' onclick='loadPosts(\"albums\")'>DONENANANA</button>";
			}else{
				pic_data.albums.loadMore="<button class='loadMore' style='display:none' onclick='loadPosts(\"albums\")'>Load More</button>";
			}
			for(var x in arr){
				pic_data.albums.data[arr[x].id]=arr[x];
			}
		}else{
			$("#container_inner").append("<div>This user has no photos in this album.</div>");
		}
		if(albId!=undefined&& albId.length>0){
			showAlbum(toAppend,id);
			goToAlbum(albId);
		}else{
			showAlbum(toAppend,id);
		}
	});
}

// Displays pictures from a specific album 
function goToAlbum(dataID) {
	$("#mainPhoto").empty();
	$("#show").empty();
	var data = pic_data.albums.data[dataID];
	$("#mainPhoto").html("<p class='no_photos'>No photos in this album</p>");
	if(album_data[data.id]==undefined){
		FB.api(dataID+'/photos', function(response) {
			var arr = response.data;
			var next = null;
			if(response.paging!=undefined){
				next = response.paging.next;
			}
			var obj = {"next":next,"pics":{},"button":"<button class='loadMore' style='display:none' onclick='loadAlbumPosts(\""+dataID+"\")'>Load More</button>"}
			$('#mainPhoto').append(obj.button);
			var firstID=arr[0].id;
			if(next!=null||next!=undefined){
				firstID = null;
			}
			var prevID = null;
			for(var x in arr){
				arr[x].my_previous = prevID;
				arr[x].my_next = firstID;
				if(prevID!=null){
					obj["pics"][prevID].my_next=arr[x].id;
				}
				prevID = arr[x].id;
				obj["pics"][arr[x].id]=arr[x];
				$("#mainPhoto").append("<button class='photos'  data-all='albums,"+arr[x].id+","+dataID+"'><img src='"+arr[x].picture+"' data-all='"+arr[x].id+"'></button>");
				$(".no_photos").hide();
			}
			album_data[data.id]=obj;
		});
	}else{
		$("#mainPhoto").append(album_data[dataID].button);
		for(var x in album_data[dataID]["pics"]){
			$("#mainPhoto").append("<button class='photos' data-all='albums, "+album_data[dataID]["pics"][x].id+","+dataID+"'><img src='"+album_data[dataID]["pics"][x].picture+"' data-all='"+album_data[dataID]["pics"][x].id+"'></button>");
			$(".no_photos").hide();
		}
	}
}

// Changes the value in a meta tag
function changeMeta(name, toChange){
	$("meta[name="+name+"]").attr("content", toChange);
}

// Displays photo individually with comments and like data
function goToPic(fold, id, folderID){
	$("#frame").animate({
    	scrollTop: 500
    }, 1000);

	$("#left_bar li:last-of-type").hide();
	
   if(first_photo==null&&meta("one_pic")=="false"){
		first_photo=id;
		changeMeta("one_pic", "true");

	}else if(first_photo==id){
		changeMeta("one_pic","false");
	}
	curr_pic=id;
	$("#right_bar li").show();
	var data = pic_data[fold]["data"][id];
	if(folderID!=undefined&&fold=="albums"){
		data = album_data[folderID].pics[id];
	}
	$("#mainPhoto").empty();
	$("#mainPhoto").show();
	$("#mainPhoto").append("<img class='main_image' src='"+data.source+"' data-all='"+fold+","+id+","+folderID+"'>");

	// Adds comments to picture 
	var comment = "<ul class='comment_container'>";
	if(data.comments!=undefined){
		for(var x in data.comments.data){
			comment+="<li class='comment_div'><span class='name'> "+data.comments.data[x].from.name+"</span>"+data.comments.data[x].message+"</li>";
		}
		comment+="</ul>";	
		$("#mainPhoto").append(comment);
		if(data.comments.paging.next!=undefined){
			loadComments(".comment_container",data.comments);
		}
	}else{
		$("#pictures > .comment_container").append("<li style='margin-left:1em'>There are no comments on this photo</li>");
	}
}

// Gets first or last picture in the linked list of pictures
// 	used to add to list when downloading new pictures
function getFirstLast(list,firstLast){
	for(var x in list){
		if(list[x][firstLast]==null){
			return list[x].id;
		}
	}
	return null;
}

// Displays individual pictures for albums
function loadAlbumPosts(dataID){
	var nextPage = album_data[dataID].next;
	if(nextPage!=undefined&&nextPage!=null){
		$.get(nextPage,function (response){
			var prevID = getFirstLast(album_data[dataID]["pics"],"my_next");
			var firstID = getFirstLast(album_data[dataID]["pics"], "my_previous");
			for(var pic in response.data){
				if(firstID==null){
					firstID=response.data[pic].id;
				}
				response.data[pic].my_previous = prevID;
				response.data[pic].my_next = firstID;
				if(prevID!=null){
					album_data[dataID]["pics"][prevID].my_next = response.data[pic].id;
				}
				album_data[dataID]["pics"][response.data[pic].id]=response.data[pic];
				prevID = response.data[pic].id;
				if(meta("one_pic")=="false"){
					$("#mainPhoto").append("<button class='photos' data-all='albums, "+response.data[pic].id+","+dataID+"'><img src='"+response.data[pic].picture+"' data-all='"+response.data[pic].id+"'></button>");
				}
			}
			if(response.paging!=undefined && response.paging.next!=undefined){
				album_data[dataID].next=response.paging.next;
			}else{
				album_data[dataID].next=null;
				$("#mainPhoto > .loadMore").html("DONENANANA");
			}
			if(meta("one_pic")=="true"){
				$("#right_bar .side_button:first-of-type").click();
			}
		},"json");
	}else{
		$("#mainPhoto > .loadMore").html("DONENANANA");
	}
}

// Displays comments for a given picture
function loadComments(toAppend, data){
	$.get(data.paging.next,function (response){
		for(var pic in response.data){
			data.data.push(response.data[pic]);
			$(toAppend).append("<div class='comment_div'><span class='name'> "+response.data[pic].from.name+"</span> "+response.data[pic].message+"</div>");
		}
		data.paging.next=response.paging.next;
		if(response.paging.next!=undefined){
			loadComments(toAppend,data);
		}
	},"json");
}

// Displays individual pictures 
function loadPosts(toAppend){
	var nextPage = pic_data[toAppend].next;
	if(nextPage!=undefined&&nextPage!=null){
		$.get(nextPage,function (response){
			var prevID = getFirstLast(pic_data[toAppend].data,"my_next");
			var firstID = getFirstLast(pic_data[toAppend].data,"my_previous");
			for(var pic in response.data){
				if(firstID==null){
					firstID=response.data[pic].id;
				}
				response.data[pic].my_previous = prevID;
				response.data[pic].my_next = firstID;
				if(prevID!=null){
					pic_data[toAppend]["data"][prevID].my_next=response.data[pic].id;
				}
				pic_data[toAppend].data[response.data[pic].id]=response.data[pic];
				prevID = response.data[pic].id;
				if(meta("one_pic")=="false"){
					$("#mainPhoto").append("<button class='photos' data-all='"+toAppend+", "+response.data[pic].id+"'><img src='"+response.data[pic].picture+"' ></button>");
				}
			}
			if(response.paging!=undefined&&response.paging.next!=undefined){
				pic_data[toAppend].next=response.paging.next;
			}else{
				$("#mainPhoto.loadMore").html("DONENANANA");
				pic_data[toAppend].next=null;
			}
			if(meta("one_pic")=="true"){
				$("#right_bar .side_button:first-of-type").click();
			}			
		},"json");
	}else{
		$("#mainPhoto > .loadMore").html("DONENANANA");
	}
}