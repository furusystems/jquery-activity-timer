jQuery Activity Timer Plugin
============================

![Build Status](https://travis-ci.org/furusystems/jquery-activity-timer.svg?branch=master)

## About

This is Plugin is inspired and influenced by the "[jQuery Idle Timer Plugin](http://github.com/thorst/jquery-idletimer)".
however it takes a different approach in the implementation of a solution for the problem.
 
The original solution uses a an approach where all the methods and properties on the _idle timer plugin_ is accessed through the `$.fn.idleTimer` plugin function see [usage](https://github.com/thorst/jquery-idletimer#usage). While the _activity timer plugin_ only uses the `$.fn.activity` function to setup or destroy the activity timer(s), and still allow to chain functions after calling the `$.fn.activity` function. 
  It also exposes an `ActivityTimer` object available trough `$(element).data('activityTimer')` for the `element` that `$(element).activity(props)` was called with. This `activityTimer` object is where the main difference lies since one would use this object to `pause/stop/start` the timer or access the properties such as `elapsedTime`, `remainingTime`.


If you want to use this more experimental implementation you are welcome, otherwise i would recommend to stick with the [jQuery Idle Timer Plugin](http://github.com/thorst/jquery-idletimer)", which is the original implementation and more maintained.


## Installation

Either download the latest version [here](https://github.com/furusystems/jquery-activity-timer/releases/latest). Or install it using [bower](http://bower.io) i.e.

	$ bower install --save jquery-activity-timer



## API

The API describes the ActivityTimer type and the jQuery plugin interface

### jQuery Plugin


#### Setup activity for either an element or selector.
	
	1. $(element|selector).activity()         // use default options
	2. $(element|selector).activity(delay),   // specify timeout delay
	3. $(element|selector).activity(delay,    // specify timeout delay and options
	4. $(element|selector).activity(options)  // specify using options only

The delay is a number in ms before the idle event should trigger.
The following options can be specified:

	{
		// starts a timeout as soon as the timer is set up
		startImmediately: true,
		
		// the amount of time (ms) before the user is considered idle
		delay: 5000,
		
		 // activity is one of these events
		events: 'keydown DOMMouseScroll mousewheel ' + 
		        'mousemove mousedown touchstart touchmove' +
		        'MSPointerDown MSPointerMove'
	}

The values specified are the default values.


#### Bind to the activity events
	
	// listen to the activity idle event
	$(element|selector).on('activity.idle, function (event, activityTimer) { 
		console.log("element has gone idle", activityTimer.idle);
	});
	
	// listen to the activity active event
	$(element|selector).on('activity.active, function (event, activityTimer) { 
		console.log("element is active again", activityTimer.active);
	});	
	
The event parameter is an instance of jQuery.Event.
While the activityTimer parameter is an instance of ActivityTimer.

*NOTE:* _if you bind an listener to both the document and another element at the same time, 
make sure to stop propagation of the event. The same is true if you are adding activity timer to elements that already have parent element that has an activity timer_ i.e.

	$(document).activity()
	$("#id").activity()

	$(document).on("activity.idle", function (event, activityTimer) {
		// ...
	});
		
	$("#id").on("activity.idle", function (event, activityTimer) {
		if (event) {
			event.stopPropagation(); // otherwise it would bubble up to the document listener above.
		}
	});
	

#### Access the activityTimer object

	$(element|selector).data("activityTimer")
	
#### Destroy the activity timer.

	$(element|selector).activity("destroy") 
	$(element|selector).data("activityTimer").destroy()

Will stop and destroy the activity time for the given element and/or selector if there is an activityTimer assigned to it.

#### Document wrapper function

	$.activity()
	$.activity(delay)
	$.activity(delay, options)
	$.activity(options)
	$.activity("destroy")
	
The `$.activity` function automatically wraps and call `$.fn.activity` function with the given arguments.


### ActivityTimer


This ActivityTimer Prototype is not directly available through the window, but only as activityTimer object that have been setup and bound to an element via `$.fn.activity` function. To access the `activityTimer` for an element use the `$.fn.data` function i.e.:

	var activityTimer = $(element|selector).data("activityTimer")

#### Properties

	delay:Number - The amount of the ms before the idle event should be triggered (read/write)
	active:Bool  - Inidicates wether the object is active  (read only)
	idle:Bool    - Inidicates wether the object is idle    (read only)
	running:Bool - Inidicates wether the object is running (read only)
	paused:Bool  - Inidicates wether the object is paused  (read only)


#### Methods
	
	start():Void   - Will start the timer unless it already is already running.
	pause():Void   - Will pause the timer, and store the remainingTime for when the timer resumes. 
	                 Use the start method to resume an paused timer.
	stop():Void    - Will stop the timer.
	                 Use the start method to start an stopped timer.
	                 	                             
	destroy():Void - Will stop and destroy and remove all references the object is holding onto making it available for gc.
	                 Trying to use an activityTimer where the `destroy` method has been called will result into errors.
	
	getElapsedTime():Number   - Returns the time in ms since the last activity
	getRemainingTime():Number - Returns the time before the next idle event is to be triggered, 
	                            unless there is activity which will reset the remainingTime.
	                            
## Changelog

* `v 0.0.5` - Documentation; `activityTimer.active` property.
* `v 0.0.4` - Initial Release

	                 





