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
			});

	function renderLogin() {
		console.log('renderLogin was called');
		$('body').removeClass('app_page');
		$('body').addClass('login_page');

		var loginButton = document.createElement('button');
		loginButton.setAttribute('id', 'loggerButton');
		loginButton.setAttribute('onclick', 'loginToApp()');
		loginButton.innerHTML = 'Login to Facebook';

		$('#container').append(loginButton);
	}
	
	var pic_data = {"photos":{"next":null,"data":{},"num":0,"loadMore":null},"albums":{"next":null,"data":{},"num":0,"loadMore":null},"photos_tagged":{"next":null,"data":{},"num":0,"loadMore":null}};
	var album_data = {};

	//Renders the app when the user is logged in
	function renderApp() {
		console.log('renderApp was called');

		//Removing Login Page elements
		$('body').removeClass('login_page');
		$('body').addClass('app_page');

		$('#loggerButton').remove();

		// var id = "/Sydney.Sprinkle";
		// var id = "/lunar.eclipse.71";
		var id ="/elyse.mcmanus";
		// var id = "/athyuttamre";
		// var id = "/arcyqwertyx";
		// var id = "/zachariah.u.medeiros";
		$("#pic_container > div:not(#folders)").hide();
		$("#folders").empty();
		$("#folders").append("<div id='phot' class='innerfolder'><a onclick='showPics(\"photos\")'><img src='folder.png'>Photos</a></div>");
		$("#folders").append("<div id='photTag' class='innerfolder'><a  onclick='showPics(\"photos_tagged\")'><img src='folder.png'>Tagged Photos</a></div>");
		$("#folders").append("<div id='alb' class='innerfolder'><a onclick='showPics(\"albums\")'><img src='folder.png'>Albums</a></div>");

		getAlbums(id,"albums");
		getPics(id,"photos");
		getPicsTagged(id,"photos_tagged");
	}

	function showPics(name){
		$("#pic_container > div").hide();
		$("#"+name).show();
		$("#"+name).parent().show();
		$("#"+name).next().hide();
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
					$('#'+toAppend).append("<div class='innerfolder'><a onclick='goToAlbum(\""+arr[x].id+"\")'><img src='folder.png'>"+arr[x].name+"</a></div>");
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
		$("#pic_container > div").hide();
		$("#albums").hide();
		$("#album_container").show();
		$("#individual_album").show();
		var data = pic_data.albums.data[dataID];
		$("#individual_album").html("<p>No photos in this album</p>");
		
		if(album_data[data.id]==undefined){
			FB.api(dataID+'/photos', function(response) {
				// console.log("HIHIHIHIHIHIHI");
				// console.log(response);
				// console.log("HIHIHIHIHIHIHI");
				var arr = response.data;
				var next = null;
				if(response.paging!=undefined){
					next = response.paging.next;
				}
				var obj = {"next":next,"pics":{},"button":"<button class='loadMore' onclick='loadAlbumPosts(\""+dataID+"\")'>Load More</button>"}
				$('#individual_album').empty();
				$('#individual_album').append("<button class='loadMore' onclick='loadAlbumPosts(\""+dataID+"\")'>Load More</button>");
				for(var x in arr){
					obj["pics"][arr[x].id]=arr[x];
					$('#individual_album').append("<img src='"+arr[x].picture+"' data-all='"+arr[x].id+"'>");
				}
				album_data[data.id]=obj;
			});
		}else{
			$('#individual_album').show();
			$('#individual_album').empty();
			$('#individual_album').append("<button class='loadMore' onclick='loadAlbumPosts(\""+dataID+"\")'>Load More</button>");	
			for(var x in album_data[dataID]["pics"]){
				$('#individual_album').append("<img src='"+album_data[dataID]["pics"][x].picture+"' data-all='"+album_data[dataID]["pics"][x].id+"'>");
			}

		}
	}

	function getPicsTagged(id,toAppend){
		FB.api(id+'/photos/uploaded', function(response) {
			// console.log("*$*$*$*$*$*$*$*#*#*$*$*#*#*$*$*$*#**#**$");
			// console.log(response);
			// console.log("*$*$*$*$*$*$*$*#*#*$*$*#*#*$*$*$*#**#**$");
			if(response!=undefined && response.data.length>0){
				var arr = response.data;
				var next = response.paging.next;
				pic_data.photos_tagged.next=next;
				pic_data.photos_tagged.loadMore="<button class='loadMore' onclick='loadPosts(\"photos_tagged\")'>Load More</button>"
				$('#'+toAppend).append("<button class='loadMore' onclick='loadPosts(\"photos_tagged\")'>Load More</button>");
				for(var x in arr){
					pic_data.photos_tagged.data[arr[x].id]=arr[x];
					$('#'+toAppend).append("<img src='"+arr[x].picture+"' data-all="+arr[x].id+">");
				}
			}else{
				$("#photTag").hide();
				checkFull();
				// $('#'+toAppend).append("<p>This user has not tagged any pictures</p>");
			}
		});
	}

	function goToPic(fold, id){
		$(".inner_folder").hide();
		$("#pictures").show();
		var data = pic_data[fold]["data"][id];
		console.log(data);
		$("#pictures").empty();
		$("#pictures").append("<img src='"+data.source+"'>");

		var comment = "<div class='comment_container'>";
		for(var x in data.comments.data){
			// console.log(data.comments[x]);
			comment+="<div class='comment_div'><span class='name'>"+data.comments.data[x].from.name+"</span> <span class='comment'>"+data.comments.data[x].message+"</span></div>";
		}
		if(data.comments.paging.next!=undefined){
			loadComments("#pictures > .comment_container",data.comments);
		}
		comment+="</div>";	
		$("#pictures").append(comment);
	}

	function getPics(id,toAppend) {
		FB.api(id+'/photos', function(response) {
			// console.log("*#****************************");
			// console.log(response);
			// console.log("*FFF****************************");
			if(response!=undefined && response.data.length>0){
				var arr = response.data;
				var next = response.paging.next;
				pic_data.photos.next=next;
				pic_data.photos.loadMore="<button class='loadMore' onclick='loadPosts(\"photos\")'>Load More</button>";
				$('#'+toAppend).append("<button class='loadMore' onclick='loadPosts(\"photos\")'>Load More</button>");
				var picPrev = null;
				for(var x in arr){
					arr[x].my_previous=picPrev;
					if(picPrev!=null){
						pic_data.photos.data[picPrev].my_next=arr[x].id;
					}
					picPrev=arr[x].id;

					pic_data.photos.data[arr[x].id]=arr[x];
					$('#'+toAppend).append("<a class='photos' onclick='goToPic(\"photos\", \""+arr[x].id+"\")'><img src='"+arr[x].picture+"' data-all='"+arr[x].id+"'></a>");
				}
			}else{
				$("#phot").hide();
				checkFull();
				// $('#'+toAppend).append("<p>No photos of this user</p>");
			}
		});
	}

	function loadAlbumPosts(dataID){
		var nextPage = album_data[dataID].next;
		// album_data[data.id]=obj
		// obj["pics"][arr[x].id]=arr[x];

		if(nextPage!=undefined&&nextPage!=null){
			$.get(nextPage,function (response){
				// console.log("!@!@!@!@!@!@!@!@!@!@!@!@!@");
				// console.log(response);
				// console.log("!@!@!@!@!@!@!@!@!@!@!@!@!@");
				for(var pic in response.data){
					album_data[dataID]["pics"][response.data[pic].id]=response.data[pic];
					$("#individual_album").append("<img src='"+response.data[pic].picture+"' data-all='"+response.data[pic].id+"'>");
				}
				if(response.paging!=undefined && response.paging.next!=undefined){
					album_data[dataID].next=response.paging.next;
					// $("#individual_album > .loadMore").show();
				}else{
					album_data[dataID].next=null;
					$("#individual_album > .loadMore").html("DONENANANA");
				}
				
			},"json");
		}else{
			$("#individual_album > .loadMore").html("DONENANANA");
		}
	}

	function loadComments(toAppend, data){
		console.log(data);
		// pic_data[fold]["data"][id][comments][paging]
		// pic_data[fold]["data"][id][comments][data]
		$.get(data.paging.next,function (response){
			for(var pic in response.data){
				data.data.push(response.data[pic]);
				$(toAppend).append("<div class='comment_div'><span class='name'>"+response.data[pic].from.name+"</span> <span class='comment'>"+response.data[pic].message+"</span></div>");
				// pic_data[fold]["data"][id]["comments"]["data"].push(response.data[pic]);
			}
			// pic_data[fold]["data"][id]["comments"]["paging"].next=response.paging.next;		
			data.paging.next=response.paging.next;
			if(response.paging.next!=undefined){
				loadComments(toAppend,data);
			}
		},"json");
	}


	function loadPosts(toAppend){
		alert(toAppend);
		// alert(nextPage);
		// alert(JSON.stringify(pic_data));
		var nextPage = pic_data[toAppend].next;
		// alert(toAppend);
		// console.log("!!!!!!!!!!!!!!!!!!!!!!!!");
		// console.log(pic_data);
		// console.log("!!!!!!!!!!!!!!!!!!!!!!!!");
		// alert($("container > img:first-child").attr("src"));
		$.get(nextPage,function (response){
			// console.log("!@!@!@!@!@!@!@!@!@!@!@!@!@");
			// console.log(response);
			// console.log("!@!@!@!@!@!@!@!@!@!@!@!@!@");
			for(var pic in response.data){
				// <a class='photos' onclick='goToPic(\"photos\", \""+arr[x].id+"\")'>
				if(toAppend=="photos"){
					
					$("#"+toAppend).append("<a class='photos' onclick='goToPic(\""+toAppend+"\", \""+response.data[pic].id+"\")'><img src='"+response.data[pic].picture+"' ></a>");
				}else{
					$("#"+toAppend).append("<img src='"+response.data[pic].picture+"' data-all="+response.data[pic]+">");
				}
			}
			if(response.paging!=undefined){
				pic_data[toAppend].next=response.paging.next;
			}else{
				$("toAppend.loadMore").html("DONENANANA");
			}
			
		},"json");
	}
>>>>>>> 5f78a8a7f1c5a5294f1842814b2c02ed11f15c74
}