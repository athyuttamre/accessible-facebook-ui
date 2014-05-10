
// Set in converse.on('set_chat_box_view'), emitted on ChatBoxView.initialize
var chatBoxView;

/* Abby's start() method from abby_js.js.
Creates listeners for created elements. */
function styleStart() {
var id='';
	//View full convo
	$('.side_button').on('click', function(){
		// frame
		$('.side_button').hide();
		$('.border-div').hide();
		$('.chatbox').hide();
		$('.chat-message').show();
		$(this).parent().css('display', 'block');
		id = $(this).parent().attr('id');
		// alert($(this).parent());

		//buttons
		$('#compose_button').show();
		$('#back_full_convo').show();
	})
	$('#back_full_convo').on('click', function(){
		$('.side_button').show();
		$('.border-div').show();
		$('.chatbox').show();
		$('.chat-message').hide();

		$('#compose_button').hide();
		$('#back_full_convo').hide();

	})

	// alert('set up');
	//Compose Reply	
	$('#compose_button').on('click',function(){
		$('.chat-message').hide();
		$('.chat-textarea').show();
		$('.sendXMPPMessage').css('height', '200px');
		$('.sendXMPPMessage').css('width', '200px');

		//
		$('#compose_button').hide();
		$('#back_full_convo').hide();
		$('#back_reply').show();
		$('#post_button').show();	
	})

	$('#back_reply').on('click', function(){
		// $('.chatbox').show();

		$('.chat-message').show();
		$('.chat-textarea').hide();
		$('.chatbox').hide();
		$('.sendXMPPMessage').css('height', '0');
		$('.sendXMPPMessage').css('width', '0');

		// $(this).parent().css('display', 'block');
		$('#'+id).css('display', 'block');
		console.log('#'+id);

		//burrons
		$('#compose_button').show();
		$('#back_full_convo').show();
		$('#back_reply').hide();
		$('#post_button').hide();			
	});

	/* Posting a message */

	//Post button click
	$('#post_button').on('click', function(){
		console.log('Posting message (emitting keypress event)');
		var e = jQuery.Event("keypress", {keyCode: 13});
		e.which = 13; 
		$('textarea.chat-textarea').trigger(e);
	});

	// Catches event triggered by Post button click
	$('textarea.chat-textarea').keypress(function(e){
		chatBoxView.keyPressed(e);
	});	
}

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
/*	FB.api('/me', function(response) {
				user = response;
				console.log('Doing this in messaging.js, ' + response.name + '.');
			});*/
	// Initialize Converse.js on start(), and pass in FB object 
	startConverse(FB);



	//Frame stuff
	// Scrolls down
	$("#bottom_bar").click(function(){
		if(!shouldPause("bar")){
			$(".loadMore").click();
			scrollVertical(300);
		}
	});
	// Scrolls up when top bar clicked
	$("#top_bar").click(function(){
		if(!shouldPause("bar")){
			scrollVertical(-300);
		}
	});

	// styleStart(); //ADDED FRIDAY 3:30
}

/* Initialize Converse.js; pass it valid FB object on start() */
function startConverse(FB) {
	require(['converse'], function (converse) {
        converse.initialize({
            allow_otr: true,
            auto_list_rooms: false,
            auto_subscribe: false,
//// I added this connection manager from Punjab
            // bosh_service_url: "localhost:5280",
            // bosh_service_url: 'https://bind.opkode.im',

        	// Please use this connection manager only for testing purposes 
            bosh_service_url: 'https://bind.conversejs.org/',

            debug: true ,
            hide_muc_server: false,
            i18n: locales['en'], // Refer to ./locale/locales.js to see which locales are supported
            prebind: false,
            show_controlbox_by_default: true,
            xhr_user_search: false,
            FB: FB
        });
//////
		// .chat-message (<div> message object)
		converse.on('show_new_message', function(e, message_package) {
			console.log('CAUGHT -- show_new_message Event CAUGHT!!');
			// console.log('-----------------');
			// console.log(message);
			// $(message).show();
			// $(message).css('border', '3px red solid');
			// console.log('-----------------');

			var message = message_package['message'];
			var box_id = message_package['box'].$el[0].id;

			// console.log(message);
			// console.log('box_id: ' + box_id);

			// alert(message_package.sender);
			// refactor2(message_package[message], message_package[sender]);
			refactor2(message, box_id);
		});
		// .chat-box (box id)
		converse.on('new_chat_box', function(e, boxID) {
			console.log('CAUGHT -- new_chat_box Event Caught');
			console.log(boxID);
			// refactor2(boxID);
		});

		/* Receives instance of ChatBoxView when it is initialized */
		converse.on('set_chat_box_view', function(e, obj) {
			console.log('CAUGHT -- set_key_pressed Event');
			chatBoxView = obj;
		});

    });
}

// console.log('setting up rendered rooms');
var count=0;
var rendered_rooms = {};
var rendered_array = [];

function refactor2(message, id){
		console.log('HERE');
		console.log($(message));

	if(count === 0){
		
		//And get ourselves set up
	    $(".chat-content").before("<br>");
		$('.chatbox').after('<div class="border-div"></div>');
		$('.border-div:first').css('display', 'none');
		$('.border-div:last').css('display', 'none');
		count++;
   }

	// var message = $.trim($(content).html());
	// var txt = "<ul class='txt'><li class='name'> " + name + " </li><li class='message'> "+ message +" <li></ul>";

	// $(box).children('div.chat-head.chat-head-chatbox').after(right_bar_button);
	// $(box).children('div.chat-head.chat-head-chatbox').after(txt);		

// for each chatbox       	
	$('.chatbox').each(function(){
		var thisID = $(this).attr('id');
		if( rendered_rooms[thisID] == undefined ){
			//Let's hide some stuff we don't need
			$('.chat-title').hide();
			$('.chat-content').hide();	
			$('#controlbox').hide();	

			// console.log(thisID);
			// Get our info
			var name = $.trim($(this).children('.chat-head').text());
			// var message = $.trim($(this).children('.chat-content').html());
			var cb_id = $.trim($(this).attr('id'));
			// var txt = "<ul class='txt'><li class='name'> " + name + " </li><li class='message'> "+ message +" <li></ul>";
			var create_list = "<ul class='txt' id='" +cb_id+"-ul'><li class='name'> " + name + " </li></ul>";
			var right_bar_button='';

			//Add our next button
			if(name != 'ContactsRooms'){
				right_bar_button = "<div class='side_button' id='"+cb_id+"-button'><img src='../images/page_framework/RightButton.svg'><p>View</p> </div>";	
			}
			
			// console.log('pic '+pic);
			$(this).children('div.chat-head.chat-head-chatbox').after(right_bar_button);
			$(this).children('div.chat-head.chat-head-chatbox').after(create_list);		

			//say room has been rendere
			rendered_rooms[thisID] = true;	
		}


		// var name = $.trim($(this).children('.chat-head').text());
		// var message = $.trim($(this).children('.chat-content').html());
		// id = $.trim($(this).attr('id')) + '-button';
		// var txt = "<ul class='txt'><li class='name'> " + name + " </li><li class='message'> "+ message +" <li></ul>";
		// var right_bar_button='';	
		$('#'+id+'-ul').append(message);
		console.log($('#'+id+'-ul'));	



		styleStart();
			

  });


}


// Determines which clickable content should be paused when called
function shouldPause(item){
	var currName = $("#left_bar li:last-of-type p").text();
	// "Unpause" is shown if everything is paused 
	if(currName.search("Unpause")>=0){
		return true;
		// "Pause all" is shown if only main content is paused
	}else if(currName.search("Pause All")>=0){
		if(item=="main"){
			return true;
		}else{
			return false;
		}
	}
	// "Pause main" is shown if nothing is paused 
	return false;
}
// Scrolls up or down page
function scrollVertical(num) {
    var iScroll = $("#frame").scrollTop();
    iScroll = iScroll + num;
    $("#frame").animate({
    	scrollTop: iScroll
    }, 1000);

}


