// testing variables
var jq = jQuery;
var currentColor_enabled = 1;
var colorBGSlider_enabled = 1;

var currentColor_h = 200;
var currentColor_s = 50;
var currentColor_l = 50;


// Get direction of "swipe" Gesture
function findSwipeDirection(x, y, z) {
	var direction = '_none';
	var x_abs = Math.abs(x);
	var y_abs = Math.abs(y);
	
	if (x_abs > y_abs) {
		// check for left
		if (x < 0) {
			direction = 'left';
		} else if (x > 0) {
			direction = 'right';
		}
	} else {
		// check for up/down
		if (y > 0) {
			direction = 'up';
		} else if (y < 0) {
			direction = 'down';
		}
	}
	
	return direction;
}

// Use Gesture to change currentColor value
function updateCurrentColor(selector, x, y, z) {
	// adjust hue
	if (currentColor_h >= 0 && currentColor_h <= 255) {
		currentColor_h = Math.round(currentColor_h+x);
		
		if (currentColor_h < 0) {
			currentColor_h = 0;
		}
		if (currentColor_h > 255) {
			currentColor_h = 255;
		}
	}
	// adjust saturation
	if (currentColor_s >= 0 && currentColor_s <= 100) {
		currentColor_s = Math.round(currentColor_s+y);
		
		if (currentColor_s < 0) {
			currentColor_s = 0;
		}
		if (currentColor_s > 100) {
			currentColor_s = 100;
		}
	}
	// adjust lightness
	if (currentColor_l >= 0 && currentColor_l <= 100) {
		currentColor_l = Math.round(currentColor_l+z);
		
		if (currentColor_l < 0) {
			currentColor_l = 0;
		}
		if (currentColor_l > 100) {
			currentColor_l = 100;
		}
	}
	
	var currentColor_hsl = 'hsl('+currentColor_h+','+currentColor_s+'%,'+currentColor_l+'%)';
	jq(selector).css('background-color', currentColor_hsl);
}

// Animate color_bg – slide
function animateColorBGSlide(gesture_direction) {
	jq('#color_bg_slider').addClass('is_animated');
	
	switch(gesture_direction) {
		case 'up':
			jq('#color_bg_slider').addClass('slide_anim_up');
			break;
		case 'down':
			jq('#color_bg_slider').addClass('slide_anim_down');
			break;
		case 'left':
			jq('#color_bg_slider').addClass('slide_anim_left');
			break;
		case 'right':
			jq('#color_bg_slider').addClass('slide_anim_right');
			break;
	}
}
function updateColorBGColor() {
	jq('#color_bg_slider').removeClass('is_animated').removeClass('slide_anim_up').removeClass('slide_anim_down').removeClass('slide_anim_left').removeClass('slide_anim_right');
	
	// clone then remove content
	var el     = jq('#color_bg_slider'),  
      newone = el.clone(true);
			el.before(newone);
  jq("#color_bg_slider:last").remove();
  
	jq('#color_bg_slider').css('background-color', jq('#color_bg_static').css('background-color'));
}

// Create a listener that will print frame data when a new frame arrives
myListener = new Leap.Listener();
myListener.onFrame = function(controller) {
	var frame = controller.frame();
  var gestures = frame.gestures();
  
  if (gestures[0]) {
  	var gesture = gestures[0];
  	var gesture_direction = findSwipeDirection(gesture._direction.x, gesture._direction.y, gesture._direction.z); // up, right, down, left
  	
  	// change color of background images
  	if (currentColor_enabled === 1) {
  		if (gesture._state === 'update') {
				updateCurrentColor('#color_bg_static', gesture._direction.x, gesture._direction.y, gesture._direction.z);
			}
		}
  	
  	// move slide based on direction of swipe
  	if (colorBGSlider_enabled === 1) {
  		if (gesture._state === 'start') {
	  		updateColorBGColor();
  		}
  		if (gesture._state === 'stop') {
	  		animateColorBGSlide(gesture_direction);
  		}
		}
  }
}
myListener.onDisconnect = function(controller) {
	document.getElementById("output").innerHTML = 'Device disconnected.';
}
myListener.onConnect = function(controller) {
	document.getElementById("output").innerHTML = 'Device connected.';
}

// Create a controller to connect to the Leap Motion
myController = new Leap.Controller("ws://localhost:6437/");

// Enable the screenTap gesture
myController.enableGesture("swipe", true);

// Add the listener to the controller
myController.addListener(myListener);











// JS EVENTS
jq(window).load(function() {
  if (currentColor_enabled === 1) {
		updateCurrentColor('#color_bg_static', 0, 0, 0);
	}
});






/*
* BASIC LEAP SETUP WITH SWIPE GESTURE TRACKING

// Create a listener that will print frame data when a new frame arrives
myListener = new Leap.Listener();
myListener.onFrame = function(controller) {
	var frame = controller.frame();
  var gestures = frame.gestures();
  
  if (gestures[0]) {
		console.log(gestures[0]);
  }
}
myListener.onDisconnect = function(controller) {
	document.getElementById("output").innerHTML = 'Device disconnected.';
}
myListener.onConnect = function(controller) {
	document.getElementById("output").innerHTML = 'Device connected.';
}

// Create a controller to connect to the Leap Motion
myController = new Leap.Controller("ws://localhost:6437/");

// Enable the screenTap gesture
myController.enableGesture("swipe", true);

// Add the listener to the controller
myController.addListener(myListener);
*/