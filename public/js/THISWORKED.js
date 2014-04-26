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
	});
	
}

// Global variable to store picture info and album info
var pic_data = {"photos":{"next":null,"data":{},"num":0,"loadMore":null},"albums":{"next":null,"data":{},"num":0,"loadMore":null},"photos_tagged":{"next":null,"data":{},"num":0,"loadMore":null}};

// Global variable to store picture info albums
var album_data = {};

// Loads the preliminary info on the page when user first enters
function renderApp() {
	console.log('renderApp was called');

	//Removing Login Page elements
	// $('body').removeClass('login_page');
	$('body').addClass('app_page');

	// $('#loggerButton').remove();

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
	$("#folders").append("<div id='phot' class='innerfolder'><a onclick='showPics(\"photos\")'><img src='/images/folder.png'>Photos</a></div>");
	$("#folders").append("<div id='photTag' class='innerfolder'><a  onclick='showPics(\"photos_tagged\")'><img src='/images/folder.png'>Tagged Photos</a></div>");


	// TODO change this 
	$("#folders").append("<div id='alb' class='innerfolder'><a onclick='showAlbum(\"albums\")'><img src='/images/folder.png'>Albums</a></div>");

	getAlbums(id,"albums");
	getPhotos(id, "photos", pic_data.photos, "/photos", "phot");
	getPhotos(id, "photos_tagged", pic_data.photos_tagged, "/photos/uploaded", "photTag");
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
		$("#mainPhoto").append("<div class='innerfolder'><a onclick='goToAlbum(\""+x+"\")'><img src='/images/folder.png'>"+data[x].name+"</a></div>");
	}
}

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

function getPhotos(id, toAppend, data, toUpload, toHide){
	FB.api(id+toUpload, function(response) {
		if(response!=undefined && response.data.length>0){
			var arr = response.data;
			var next = response.paging.next;
			data.next=next;
			data.loadMore="<button class='loadMore' onclick='loadPosts(\""+toAppend+"\")'>Load More</button>";
			$('#'+toAppend).append("<button class='loadMore' onclick='loadPosts(\""+toAppend+"\")'>Load More</button>");
			var picPrev = null;
			for(var x in arr){
				arr[x].my_previous=picPrev;
				if(picPrev!=null){
					data.data[picPrev].my_next=arr[x].id;
				}
				picPrev=arr[x].id;

				data.data[arr[x].id]=arr[x];
				$('#'+toAppend).append("<a class='photos' onclick='goToPic(\""+toAppend+"\", \""+arr[x].id+"\")'><img src='"+arr[x].picture+"' data-all='"+arr[x].id+"'></a>");
			}
		}else{
			$("#"+toHide).hide();
			checkFull();
			// $('#'+toAppend).append("<p>No photos of this user</p>");
		}
	});
	
}

function getAlbums(id,toAppend){
	FB.api(id+'/albums', function(response) {
		if(response.data.length>0){
			var arr = response.data;
			var next = response.paging.next;
			pic_data.albums.next=next;
			if(next==undefined){
				pic_data.albums.loadMore="<button class='loadMore' onclick='loadPosts(\"albums\")'>DONENANANA</button>";
			}else{
				pic_data.albums.loadMore="<button class='loadMore' onclick='loadPosts(\"albums\")'>Load More</button>";
			}
			$('#'+toAppend).append(pic_data.albums.loadMore);
			for(var x in arr){
				pic_data.albums.data[arr[x].id]=arr[x];
				$('#'+toAppend).append("<div class='innerfolder'><a onclick='goToAlbum(\""+arr[x].id+"\")'><img src='/images/folder.png'>"+arr[x].name+"</a></div>");
			}
		}else{
			$("#alb").hide();
			checkFull();
		}
	});
}

function checkFull(){
	var full = $("#phot").is(":visible");
	var full2 = $("#photTag").is(":visible");
	var full3 = $("#alb").is(":visible");
	if(!full&&!full2&&!full3){
		$("#container").append("<div>This user has no photos</div>");
	}

}

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
			var obj = {"next":next,"pics":{},"button":"<button class='loadMore' onclick='loadAlbumPosts(\""+dataID+"\")'>Load More</button>"}
			// $('#individual_album').empty();
			$('#mainPhoto').append(obj.button);
			for(var x in arr){
				obj["pics"][arr[x].id]=arr[x];
				$("#mainPhoto").append("<a class='photos' onclick='goToPic(\"albums\", \""+arr[x].id+"\",\""+dataID+"\")'><img src='"+arr[x].picture+"' data-all='"+arr[x].id+"'></a>");
				$(".no_photos").hide();
			}
			album_data[data.id]=obj;
		});
	}else{
		// alert(album_data[dataID].button+" | "+dataID);
		// $('#mainPhoto').append("<button class='loadMore' onclick='loadAlbumPosts(\""+dataID+"\")'>Load More</button>");	
		$("#mainPhoto").append(album_data[dataID].button);
		for(var x in album_data[dataID]["pics"]){
			// $('#mainPhoto').append("<img src='"+album_data[dataID]["pics"][x].picture+"' data-all='"+album_data[dataID]["pics"][x].id+"'>");
			$("#mainPhoto").append("<a class='photos' onclick='goToPic(\"albums\", \""+album_data[dataID]["pics"][x].id+"\",\""+dataID+"\")'><img src='"+album_data[dataID]["pics"][x].picture+"' data-all='"+album_data[dataID]["pics"][x].id+"'></a>");
			$(".no_photos").hide();
		}
	}
}
// function goToAlbum(dataID) {
// 	$("#mainPhoto").empty();
// 	$("#show").empty();


// 	var data = pic_data.albums.data[dataID];

// 	$("#mainPhoto").html("<p class='no_photos'>No photos in this album</p>");
	
// 	if(album_data[data.id]==undefined){
// 		FB.api(dataID+'/photos', function(response) {
// 			var arr = response.data;
// 			var next = null;
// 			if(response.paging!=undefined){
// 				next = response.paging.next;
// 			}
// 			var obj = {"next":next,"pics":{},"button":"<button class='loadMore' onclick='loadAlbumPosts(\""+dataID+"\")'>Load More</button>"}
// 			// $('#individual_album').empty();
// 			$('#mainPhoto').append("<button class='loadMore' onclick='loadAlbumPosts(\""+dataID+"\")'>Load More</button>");
// 			for(var x in arr){
// 				obj["pics"][arr[x].id]=arr[x];
// 				$('#mainPhoto').append("<img src='"+arr[x].picture+"' data-all='"+arr[x].id+"'>");
// 				$(".no_photos").hide();
// 			}
// 			album_data[data.id]=obj;
// 		});
// 		// $("#mainPhoto").append("<a class='photos' onclick='goToPic(\""+name+"\", \""+arr[x].id+"\")'><img src='"+arr[x].picture+"' data-all='"+arr[x].id+"'></a>");
// 	}else{
// 		$('#mainPhoto').append("<button class='loadMore' onclick='loadAlbumPosts(\""+dataID+"\")'>Load More</button>");	
// 		for(var x in album_data[dataID]["pics"]){
// 			$('#mainPhoto').append("<img src='"+album_data[dataID]["pics"][x].picture+"' data-all='"+album_data[dataID]["pics"][x].id+"'>");
// 			$(".no_photos").hide();
// 		}

// 	}
// }

// Displays photo individually with comments and like data
function goToPic(fold, id, folderID){
	// $(".inner_folder").hide();
	// $("#pictures").show();
	// $("#pictures").empty();

	var data = pic_data[fold]["data"][id];
	if(folderID!=undefined){
		data = album_data[folderID].pics[id];
	}
	console.log(data);
	
	$("#mainPhoto").empty();
	$("#mainPhoto").show();
	$("#mainPhoto").append("<img src='"+data.source+"'>");



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

function loadAlbumPosts(dataID){
	var nextPage = album_data[dataID].next;
	// album_data[data.id]=obj
	// obj["pics"][arr[x].id]=arr[x];

	if(nextPage!=undefined&&nextPage!=null){
		$.get(nextPage,function (response){
			for(var pic in response.data){
				album_data[dataID]["pics"][response.data[pic].id]=response.data[pic];
				$("#mainPhoto").append("<img src='"+response.data[pic].picture+"' data-all='"+response.data[pic].id+"'>");
			}
			if(response.paging!=undefined && response.paging.next!=undefined){
				album_data[dataID].next=response.paging.next;
				// $("#individual_album > .loadMore").show();
			}else{
				album_data[dataID].next=null;
				$("#mainPhoto > .loadMore").html("DONENANANA");
			}
			
		},"json");
	}else{
		$("#mainPhoto > .loadMore").html("DONENANANA");
	}
}

function loadComments(toAppend, data){
	$.get(data.paging.next,function (response){
		for(var pic in response.data){
			data.data.push(response.data[pic]);
			$(toAppend).append("<div class='comment_div'><span class='name'>"+response.data[pic].from.name+"</span> <span class='comment'>"+response.data[pic].message+"</span></div>");
		}
		data.paging.next=response.paging.next;
		if(response.paging.next!=undefined){
			loadComments(toAppend,data);
		}
	},"json");
}

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
					// goToPic(fold, id, folderID)
					// goToPic(\"albums\", \""+arr[x].id+"\",\""+dataID+"\")
					$("#mainPhoto").append("<a class='photos' onclick='goToPic(\"albums\", \""+response.data[pic].id+"\",\""+toAppend+"\")'><img src='"+response.data[pic].picture+"' ></a>");

					// $("#mainPhoto").append("<img src='"+response.data[pic].picture+"' data-all='"+response.data[pic].id+"'>");
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
// function loadPosts(toAppend){
// 	var nextPage = pic_data[toAppend].next;
// 	$.get(nextPage,function (response){
// 		for(var pic in response.data){
// 			pic_data[toAppend].data[response.data[pic].id]=response.data[pic];
// 			if(toAppend=="photos"||toAppend=="photos_tagged"){	

// 				$("#mainPhoto").append("<a class='photos' onclick='goToPic(\""+toAppend+"\", \""+response.data[pic].id+"\")'><img src='"+response.data[pic].picture+"' ></a>");
// 			}else{
// 				$("#"+toAppend).append("<img src='"+response.data[pic].picture+"' data-all="+response.data[pic]+">");
// 			}
// 		}
// 		if(response.paging!=undefined){
// 			pic_data[toAppend].next=response.paging.next;
// 		}else{
// 			$("#mainPhoto.loadMore").html("DONENANANA");
// 		}
		
// 	},"json");
// }