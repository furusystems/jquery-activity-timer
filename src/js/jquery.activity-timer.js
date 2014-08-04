/* global console, define, require, jQuery, window */
// TODO: tests
// TODO: Travis + Karma
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
		this.element = element;
		this.delay = delay;
		this.events = events;
		this.time = 0;
		this.elapsedTime = 0;
		this.remainingTime = 0;
		this.running = false;
		this.paused = false;

		this.callbacks = {
			onUserEvent: $.proxy(this.onUserEvent, this),
			onTimer: $.proxy(this.onTimer, this)
		};

		$(this.element).on(this.events, this.callbacks.onUserEvent);
		$(this.element).data("activityTimer", this);
	}

	$.extend(ActivityTimer.prototype, {

		getElapsedTime: function () {
			if (this.paused) {
				return this.elapsedTime;
			}

			return (this.time > 0 ? (time() - this.time) : 0);
		},

		getRemainingTime: function () {
			return (this.time > 0 ? (this.delay - this.getElapsedTime()) : 0);
		},

		destroy: function () {
			$(this.element).data("activityTimer", null);
			this.stop();
			$(this.element).off(this.events, this.callbacks.onUserEvent);
			this.element = null;
		},

		start: function () {
			if (this.running) {
				return;
			}
			this.running = true;

			this.time = time();
			if (this.paused) {
				this.time -= this.elapsedTime;
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
			this.elapsedTime = this.getElapsedTime();

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
			this.time = 0;

			if (this.timerID) {
				window.clearInterval(this.timerID);
				this.timerID = null;
			}
		},

		onUserEvent: function (event) {
			if (this.idle) {
				this.idle = false;
				$(this.element).trigger("activityTimer.active");
			}
			this.time = time();
		},

		onTimer: function () {
			if (!this.idle && (this.getElapsedTime() >= this.delay)) {
				this.idle = true;
				this.time = 0;
				$(this.element).trigger("activityTimer.idle");
			}
		}
	});

  $.fn.activity = function (options) {
		var activityTimer;

		// destroy idle timer's
		if (($.type(options) === "string") &&
				(options === "destroy")) {
			$.each(this, function (index, element) {
					activityTimer = $(element).data("activityTimer");
					if (activityTimer) {
						activityTimer.destroy();
					}
				});

			return this;
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
