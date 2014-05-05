// Info about queues and calling FB object outside fbAsyncInit from:
// http://stackoverflow.com/questions/12743356/how-to-call-fb-api-outside-window-fbasyncinit/12746422#12746422

var FB; // to avoid error "undeclared variable", until FB gets initialized

var myQueue = new Array();

function queueAdd(f) {
  if (FB == undefined)
    myQueue.push(f);
  else
    f();
}

function processQueue() {
  console.log('Processing queue...');
  var f;
  while(f = myQueue.shift())
    f();
}

// Load the SDK (Software Development Kit) asynchronously
(function(d){
	console.log('////////// LOADING FB //////////');
	console.log('Loading Facebook SDK asynchronously');
	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement('script'); js.id = id; js.async = true;
	js.src = "//connect.facebook.net/en_US/all.js";
	ref.parentNode.insertBefore(js, ref);
}(document));

//window.fbAsyncInit is called only after the Facebook SDK is completely loaded client-side.
//The SDK is loaded above.
window.fbAsyncInit = function() {
	//Initializing the FB object with out App ID and other details;
	console.log('Running FB.init()...');
	FB.init({
		appId      : '610602015680966',
		status     : true, // check login status
		cookie     : true, // enable cookies to allow the server to access the session
		xfbml      : true  // parse XFBML
	});

	processQueue();

	//Facebook Login Status can be checked two ways: 1. Deliberately asking for the login status, using
	//the getLoginStatus() method, or always listening for changes in login status, using the Event.subscribe
	//method (the next one).
	
	//Each time the page is loaded, we deliberately ask for login status once using getLoginStatus. If it is connected
	//the statements in the next method's connected section will be executed. If not, then we must render the login
	//page.

	// FB.getLoginStatus(function(response) {
	// 	if(response.status === 'connected') {
	// 		console.log('Logged in!');
	// 	}
	// 	else if(response.status == 'not_authorized' || response.status == 'unknown') {
	// 		console.log('Not logged in!');
	// 	}
	// });

	//Using the Event.subscribe method, we are always listening to changes in authorization status.
	// Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
  	// for any authentication related change, such as login, logout or session refresh. This means that
  	// whenever someone who was previously logged out tries to log in again, the correct case below 
  	// will be handled.
	FB.Event.subscribe('auth.authResponseChange', function(response) {
		// Here we specify what we do with the response anytime this event occurs.
		if (response.status === 'connected') {
			// The response object is returned with a status field that lets the app know the current
      			// login status of the person. In this case, we're handling the situation where they 
      			// have logged in to the app.
			console.log('Login status: app connected to Facebook');
		} else if (response.status === 'not_authorized') {
			// In this case, the person is logged into Facebook, but not into the app, so we call
		        // renderLogin() to render the login page through which users may log in.
			console.log('Login status: user logged in but app not authorized; proceeding to ask for permission');
		} else {
			// In this case, the person is not logged into Facebook, so we call the renderLogin() 
		        // function to render the login page through which users may log in. Note that at this 
		        // stage there is no indication of whether they are logged into the app. 
		        // If they aren't then they'll see the Login dialog right after they log in to Facebook. 
			console.log('Login status: user logged out. Login button is visible.');
		}
	});
};

function checkLogin(callback, params) {
	console.log('isLoggedIn was called...');
	FB.getLoginStatus(function(response) {
		if(response.status === 'connected') {
			console.log('Logged in, returning FB object...');
			console.log('////////////////////////////////\n');
			callback(FB);
		} else {
			console.log('Not logged in, asking to login...');
			redirect('login');		
		}
	});
}

function performLogout() {
	FB.logout(function(response) {
			console.log('User logged out.');
			redirect('login');
		});
}

// Goto
//
// Takes user to specified page, keeping previous page in
// session history; similar to user clicking link
function goto(page) {
	if(page === 'index') {
		// When goto command is issued for 'index', we goto to root
		page = ''; 
	}
	var gotoURL = 'http://' + window.location.hostname + ':' + location.port + '/' + page;
	console.log('Redirecting to ' + gotoURL);
	window.location.href = gotoURL;
}

// Redirect
//
// Takes user to specified page, NOT keeping previous page
// in session history; similar to HTTP redirect
function redirect(page) {
	if(page === 'index') {
		// When redirect command is issued for 'index', we redirect to root
		page = ''; 
	}
	var redirectURL = 'http://' + window.location.hostname + ':' + location.port + '/' + page;
	console.log('Redirecting to ' + redirectURL);
	window.location.replace(redirectURL);
}