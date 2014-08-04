/* global console, define, require, jQuery, window */
// TODO: Package + Banner
// TODO: License's
// TODO: Update README
// TODO: Travis
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	}
	else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {
	function time() {
		return (+new Date());
	}

	var defaultOptions = {
		startImmediately: true, //starts a timeout as soon as the timer is set up
		delay: 5000,  //the amount of time (ms) before the user is considered idle
		events: 'keydown DOMMouseScroll mousewheel ' +
						'mousemove mousedown touchstart touchmove ' +
						'MSPointerDown MSPointerMove' // activity is one of these events
	};

	var ACTIVITY_TIMER_DELAY = 1000 / 60;

	function ActivityTimer(element, delay, events) {
		this._element = element;
		this._events = events;
		this._elapsedTime = 0;
		this._remainingTime = 0;
		this._time = 0;

		this.delay = delay;
		this.idle = false;
		this.running = false;
		this.paused = false;

		this.callbacks = {
			onUserEvent: $.proxy(this.onUserEvent, this),
			onTimer: $.proxy(this.onTimer, this)
		};

		$(this._element).on(this._events, this.callbacks.onUserEvent);
		$(this._element).data("activityTimer", this);
	}

	$.extend(ActivityTimer.prototype, {

		getElapsedTime: function () {
			if (this.paused) {
				return this._elapsedTime;
			}

			return (this._time > 0 ? (time() - this._time) : 0);
		},

		getRemainingTime: function () {
			return (this._time > 0 ? (this.delay - this.getElapsedTime()) : 0);
		},

		destroy: function () {
			$(this._element).data("activityTimer", null);
			this.stop();

			$(this._element).off(this.events, this.callbacks.onUserEvent);
			this._element = null;
		},

		start: function () {
			if (this.running) {
				return;
			}
			this.running = true;

			this._time = time();
			if (this.paused) {
				this._time -= this._elapsedTime;
				this.paused = false;
			}

			this.timerID = window.setInterval(this.callbacks.onTimer,
				ACTIVITY_TIMER_DELAY);
		},

		pause: function () {
			if (!this.running) {
				return;
			}
			this.running = false;
			this._elapsedTime = this.getElapsedTime();

			this.paused = true;
			if (this.timerID) {
				window.clearInterval(this.timerID);
				this.timerID = null;
			}
		},

		stop: function () {
			if (!this.running) {
				return;
			}
			this.running = false;
			this._time = 0;

			if (this.timerID) {
				window.clearInterval(this.timerID);
				this.timerID = null;
			}
		},

		onUserEvent: function (event) {
			if (this.idle) {
				this.idle = false;
				$(this._element).trigger("activityTimer.active", this);
			}
			this._time = time();
		},

		onTimer: function () {
			if (!this.idle && (this.getElapsedTime() >= this.delay)) {
				this.idle = true;
				this._time = 0;
				$(this._element).trigger("activityTimer.idle", this);
			}
		}
	});

  $.fn.activity = function () {
		var activityTimer,
				args = Array.prototype.slice.call(arguments, 0),
				options = {};

		// destroy idle timer's
		if (($.type(args[0]) === "string") &&
				(args[0] === "destroy")) {
			$.each(this, function (index, element) {
					activityTimer = $(element).data("activityTimer");
					if (activityTimer) {
						activityTimer.destroy();
					}
				});

			return this;
		}

		// first arg is a number
		if ($.type(args[0]) === "number") {
			options = {delay: args[0]};
		}
		// first arg is an options object
		else if ($.type(args[0]) === "object") {
			options = args[0];
		}

		// we have a options object
		if (args.length > 1 && ($.type(args[1]) === "object")) {
			options = $.extend(options, args[1]);
		}

		// setup or re-create idle timer's
		options = $.extend(defaultOptions, options);
		$.each(this, function (index, element) {
			activityTimer = $(element).data("activityTimer");
			if (activityTimer) {
				activityTimer.destroy();
			}
			activityTimer = new ActivityTimer(element, options.delay, options.events);
			if (options.startImmediately) {
				activityTimer.start();
			}
		});

		return this;
  };

	$.activity = function () {
		$.fn.activity.apply([document], arguments);
	};

	return $.fn.activity;
}));
