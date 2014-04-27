var user;
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
		renderApp();
		var name = meta("page");
		var id = meta("page_id");

		showData(name, id);
	});

	// Back bar -- window.back for pages, 
	// 	Goes back to individual picture for individual pictures
	$("#left_bar").on("click",function(){
		getPageType();
	});

	// Scrolls down
	$("#bottom_bar").on("click",function(){
		$(".loadMore").click();
	});

	// Goes to next picture if looking at individual pictures when TOP 
	//	view bar on right is clicked 
	$("#right_bar tr:first-of-type").on("click", function(){
		if(meta("one_pic")=="true"){
			var data = $("#mainPhoto img").attr("data-all");
			var data_lis = data.split(",");
			if(data_lis[0]=="albums"){
				var next = album_data[data_lis[2]]["pics"][data_lis[1]].my_next;
				// console.log(next);
				if(next==null){
					$("#mainPhoto").append(album_data[data_lis[2]].button);
					$(".loadMore").click();
				}else{
					goToPic(data_lis[0],next,data_lis[2]);
				}
			}else{
				//TODO scroll through pics for non-albums
				// var next = album_data[data_lis[2]]["pics"][data_lis[1]].my_next;
				var next = pic_data[data_lis[0]][data_lis[1]];
				console.log(next);
				console.log(data_lis);

			}
		}
	});

	// 	TODO This is where you want to add funcionality for commenting 
	//		and liking things
	$("#right_bar tr:last-of-type").on("click", function(){
		alert("LOLOLOOLOL");
	});


}

function getPageType(){
	if(meta("one_pic")=="false"){
		parent.history.back();
		return false; 
	}else{
		console.log(meta("one_pic"));
		// var data = $("#mainPhoto img").attr("data-all");
		// var data_lis = data.split(",");

	}
}

// Takes meta data and displays correct info 
function showData(name, id) {
	if(name=="photos"){
		getPhotos(user.id, "photos", pic_data.photos, "/photos", "phot");
	}else if(name=="photos_tagged"){
		getPhotos(user.id, "photos_tagged", pic_data.photos_tagged, "/photos/uploaded", "photTag");		
	}else if(name=="albums"){
		if(id!="undefined"){
			getAlbums(user.id,"albums", id);
		}else{
			getAlbums(user.id,"albums");
		}
	}
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
function renderApp() {
	console.log('renderApp was called');
	$('body').addClass('app_page');

	// var id = "/Sydney.Sprinkle";
	// var id = "/lunar.eclipse.71";
	var id =user.id;
	// var id = "/beverly.naigles";
	// var id = "/athyuttamre";
	// var id = "/arcyqwertyx";
	// var id = "/zachariah.u.medeiros";
	// var id = "/ham.hamington.5";
	$("#pic_container > div:not(#folders)").hide();
	$("#folders").empty();
	$("#folders").append("<div id='phot' class='innerfolder'><a href='/photos/photos'><img src='/images/folder.png'>Photos</a></div>");
	$("#folders").append("<div id='photTag' class='innerfolder'><a  href='/photos/photos_tagged'><img src='/images/folder.png'>Tagged Photos</a></div>");
	$("#folders").append("<div id='alb' class='innerfolder'><a href='/photos/albums'><img src='/images/folder.png'>Albums</a></div>");
}

// Displays albums 
// Executed when "Albums" folder in nav bar is clicked 
function showAlbum(name){
	var next = pic_data.albums.next;
	var data = pic_data.albums.data;
	$("#mainPhoto").empty();
	$("#mainPhoto").show();

	$('#mainPhoto').append(pic_data.albums.loadMore);
	for(var x in data){
		$("#mainPhoto").append("<div class='innerfolder'><a href='/photos/albums/"+x+"'><img src='/images/folder.png'>"+data[x].name+"</a></div>");
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
		$("#mainPhoto").append("<a class='photos' onclick='goToPic(\""+name+"\", \""+arr[x].id+"\")'><img src='"+arr[x].picture+"' data-all='"+arr[x].id+"'></a>");
	}
}

// Gets photos from FB api 
function getPhotos(id, toAppend, data, toUpload, toHide){
	FB.api(id+toUpload, function(response) {
		if(response!=undefined && response.data.length>0){
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
			$("#"+toHide).hide();
			checkFull();
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
			$("#alb").hide();
			checkFull();
		}
		if(albId.length>0){
			showAlbum(toAppend);
			goToAlbum(albId);
		}else{
			showAlbum(toAppend);
		}
	});
}

// Checks if a given folder is empty (of the 3 at top of page)
// If empty, it takes it out, and if all of them are empty (the user had no pictures)
//	 displays a message saying the user has no photos
function checkFull(){
	var full = $("#phot").is(":visible");
	var full2 = $("#photTag").is(":visible");
	var full3 = $("#alb").is(":visible");
	if(!full&&!full2&&!full3){
		$("#container").append("<div>This user has no photos</div>");
	}
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
				$("#mainPhoto").append("<a class='photos' onclick='goToPic(\"albums\", \""+arr[x].id+"\",\""+dataID+"\")'><img src='"+arr[x].picture+"' data-all='"+arr[x].id+"'></a>");
				$(".no_photos").hide();
			}
			album_data[data.id]=obj;
		});
	}else{
		$("#mainPhoto").append(album_data[dataID].button);
		for(var x in album_data[dataID]["pics"]){
			$("#mainPhoto").append("<a class='photos' onclick='goToPic(\"albums\", \""+album_data[dataID]["pics"][x].id+"\",\""+dataID+"\")'><img src='"+album_data[dataID]["pics"][x].picture+"' data-all='"+album_data[dataID]["pics"][x].id+"'></a>");
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
	changeMeta("one_pic", "true");
	var data = pic_data[fold]["data"][id];
	if(folderID!=undefined){
		data = album_data[folderID].pics[id];
	}
	$("#mainPhoto").empty();
	$("#mainPhoto").show();
	$("#mainPhoto").append("<img src='"+data.source+"' data-all='"+fold+","+id+","+folderID+"'>");

	// Adds comments to picture 
	var comment = "<div class='comment_container'>";
	if(data.comments!=undefined){
		for(var x in data.comments.data){
			comment+="<div class='comment_div'><span class='name'>"+data.comments.data[x].from.name+"</span> <span class='comment'>"+data.comments.data[x].message+"</span></div>";
		}
		if(data.comments.paging.next!=undefined){
			loadComments("#pictures > .comment_container",data.comments);
		}
		comment+="</div>";	
		$("#mainPhoto").append(comment);
	}
}

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
				// TODO HERE
				if(meta("one_pic")=="false"){
					$("#mainPhoto").append("<a class='photos' onclick='goToPic(\"albums\", \""+response.data[pic].id+"\",\""+dataID+"\")'><img src='"+response.data[pic].picture+"' data-all='"+response.data[pic].id+"'></a>");
				}
			}
			if(response.paging!=undefined && response.paging.next!=undefined){
				album_data[dataID].next=response.paging.next;
			}else{
				album_data[dataID].next=null;
				$("#mainPhoto > .loadMore").html("DONENANANA");
			}
			if(meta("one_pic")=="true"){
				$("#right_bar tr:first-of-type").click();
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
			$("#mainPhoto").append("<div class='comment_div'><span class='name'>"+response.data[pic].from.name+"</span> <span class='comment'>"+response.data[pic].message+"</span></div>");
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
	if(toAppend!="photos"&&toAppend!="photos_tagged"){
		nextPage = album_data[dataID].next;
	}
	if(nextPage!=undefined&&nextPage!=null){
		$.get(nextPage,function (response){
			for(var pic in response.data){
				if(toAppend=="photos"||toAppend=="photos_tagged"){	
					pic_data[toAppend].data[response.data[pic].id]=response.data[pic];
					$("#mainPhoto").append("<a class='photos' onclick='goToPic(\""+toAppend+"\", \""+response.data[pic].id+"\")'><img src='"+response.data[pic].picture+"' ></a>");
				}else{
					album_data[dataID]["pics"][response.data[pic].id]=response.data[pic];
					$("#mainPhoto").append("<a class='photos' onclick='goToPic(\"albums\", \""+response.data[pic].id+"\",\""+toAppend+"\")'><img src='"+response.data[pic].picture+"' data-all='"+response.data[pic].id+"'></a>");
				}
			}
			if(response.paging!=undefined&&response.paging.next!=undefined){
				if(toAppend=="photos"||toAppend=="photos_tagged"){	
					pic_data[toAppend].next=response.paging.next;
				}else{
					album_data[dataID].next=response.paging.next;
				}
			}else{
				$("#mainPhoto.loadMore").html("DONENANANA");
			}			
		},"json");
	}else{
		$("#mainPhoto > .loadMore").html("DONENANANA");
	}
}