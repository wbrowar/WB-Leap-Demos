// testing variables
var jq = jQuery;
var currentColor_enabled = 1;
var currentColor_H_enabled = 1;
var currentColor_S_enabled = 1;
var currentColor_L_enabled = 1;
var colorBGSlider_enabled = 1;

var currentColor_h = 200;
var currentColor_s = 50;
var currentColor_l = 50;


// Change "output" text
function output_log(new_text) {
	jq('#output').text(new_text);
}

// Get direction of "swipe" Gesture
function findSwipeDirection(x, y, z) {
	var direction = '_none';
	var x_abs = Math.abs(x);
	var y_abs = Math.abs(y);
	var z_abs = Math.abs(z);
	
	// check if z is larger than both x and y
	if (z_abs > x_abs && z_abs > y_abs) {
		// check for left
		if (z < 0) {
			direction = 'out';
		} else if (z > 0) {
			direction = 'in';
		}
	} else {
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
	}
	
	return direction;
}

// Use Gesture to change currentColor value
function updateCurrentColor(selector, x, y, z) {
	// adjust hue
	if (currentColor_H_enabled === 1 && currentColor_h >= 0 && currentColor_h <= 255) {
		currentColor_h = Math.round(currentColor_h+x);
		
		if (currentColor_h < 0) {
			currentColor_h = 0;
		}
		if (currentColor_h > 255) {
			currentColor_h = 255;
		}
	}
	// adjust saturation
	if (currentColor_S_enabled === 1 && currentColor_s >= 0 && currentColor_s <= 100) {
		currentColor_s = Math.round(currentColor_s+y);
		
		if (currentColor_s < 0) {
			currentColor_s = 0;
		}
		if (currentColor_s > 100) {
			currentColor_s = 100;
		}
	}
	// adjust lightness
	if (currentColor_L_enabled === 1 && currentColor_l >= 0 && currentColor_l <= 100) {
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
	output_log('New Color: '+currentColor_hsl);
	
	// change menu text to dark mode when background is too light
	if (currentColor_l > 70) {
		jq('body').addClass('dark_mode');
	} else {
		jq('body').removeClass('dark_mode');
	}
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
	output_log('Swipe: '+gesture_direction);
}
function updateColorBGColor() {
	jq('#color_bg_slider')
	.removeClass('is_animated')
	.removeClass('slide_anim_up')
	.removeClass('slide_anim_down')
	.removeClass('slide_anim_left')
	.removeClass('slide_anim_right');
	
	// clone then remove content – via http://css-tricks.com
	var el     = jq('#color_bg_slider'),  
      newone = el.clone(true);
			el.before(newone);
  jq("#color_bg_slider:last").remove();
  
  // match colors of slider and static elements
	jq('#color_bg_slider').css('background-color', jq('#color_bg_static').css('background-color'));
}


function setupUserInteractions() {
	// display features and subfeatures enabled on start
	if (currentColor_enabled === 1) {
		jq('#toggle_current_color').addClass('feature_enabled');
	}
	if (colorBGSlider_enabled === 1) {
		jq('#toggle_color_bg_slider').addClass('feature_enabled');
	}
	if (currentColor_H_enabled === 1) {
		jq('#toggle_current_color_H').addClass('feature_sub_enabled');
	}
	if (currentColor_S_enabled === 1) {
		jq('#toggle_current_color_S').addClass('feature_sub_enabled');
	}
	if (currentColor_L_enabled === 1) {
		jq('#toggle_current_color_L').addClass('feature_sub_enabled');
	}
	
	// toggle features
	jq('.toggle_feature').click(function () {
		var current_id = jq(this).attr('id');
		
		switch(current_id) {
			case 'toggle_current_color':
				if (currentColor_enabled === 0) {
					currentColor_enabled = 1;
					jq(this).addClass('feature_enabled');
				} else {
					currentColor_enabled = 0;
					jq(this).removeClass('feature_enabled');
				}
				break;
			case 'toggle_color_bg_slider':
				if (colorBGSlider_enabled === 0) {
					colorBGSlider_enabled = 1;
					jq(this).addClass('feature_enabled');
				} else {
					colorBGSlider_enabled = 0;
					jq(this).removeClass('feature_enabled');
				}
				break;
			case 'toggle_current_hue':
				// coming soon!
				break;
		}
		
		return false;
	});
	
	// toggle sub-features
	jq('.toggle_feature_sub').click(function () {
		var current_id = jq(this).attr('id');
		
		if (currentColor_enabled === 1) {
			switch(current_id) {
				case 'toggle_current_color_H':
					if (currentColor_H_enabled === 0) {
						currentColor_H_enabled = 1;
						jq(this).addClass('feature_sub_enabled');
					} else {
						currentColor_H_enabled = 0;
						jq(this).removeClass('feature_sub_enabled');
					}
					break;
				case 'toggle_current_color_S':
					if (currentColor_S_enabled === 0) {
						currentColor_S_enabled = 1;
						jq(this).addClass('feature_sub_enabled');
					} else {
						currentColor_S_enabled = 0;
						jq(this).removeClass('feature_sub_enabled');
					}
					break;
				case 'toggle_current_color_L':
					if (currentColor_L_enabled === 0) {
						currentColor_L_enabled = 1;
						jq(this).addClass('feature_sub_enabled');
					} else {
						currentColor_L_enabled = 0;
						jq(this).removeClass('feature_sub_enabled');
					}
					break;
			}
		
		output_log(current_id);
		}
		
		return false;
	});
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
	
	setupUserInteractions();
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