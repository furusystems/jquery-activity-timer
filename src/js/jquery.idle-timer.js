/* global console, define, require, jQuery, window */
// TODO: handle mouse move
// TODO: tune demo page
// TODO: tests
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
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
		events: 'mousemove keydown DOMMouseScroll mousewheel' +
						'mousedown touchstart touchmove' +
						'MSPointerDown MSPointerMove' // activity is one of these events
	};

	function IdleTimer (element, delay, events) {
		this.element = element;
		this.delay = delay;
		this.events = events;
		this.time = 0;
		this.running = false;
		this.paused = false;

		this.callbacks = {
			onUserEvent: $.proxy(this.onUserEvent, this),
			onTimeout: $.proxy(this.onTimeout, this)
		};

		$(this.element).on(this.events, this.callbacks.onUserEvent);
		$(this.element).data("idleTimer", this);
	}

	$.extend(IdleTimer.prototype, {

		getElapsedTime: function () {
			return (this.time > 0 ? (time() - this.time) : 0);
		},

		getRemainingTime: function () {
			return (this.time > 0 ? (this.delay - this.getElapsedTime()) : 0);
		},

		destroy: function () {
			$(this.element).data("idleTimer", null);
			this.stop();
			$(this.element).off(this.events, this.callbacks.onUserEvent);
			this.element = null;
		},

		start: function () {
			if (this.running) {
				return;
			}
			this.running = true;
			if (this.paused) {
				this.paused = false;
				setTimeout(this.callbacks.onTimeout, this.remainingTime);
			}
			else {
				setTimeout(this.callbacks.onTimeout, this.delay);
			}
			this.time = time();
		},

		pause: function () {
			if (!this.running) {
				return;
			}
			this.running = false;
			this.paused = true;
			this.remainingTime = this.getRemainingTime();

			if (this.timeoutID) {
				clearTimeout(this.timeoutID);
				this.timeoutID = null;
			}
		},

		stop: function () {
			if (!this.running) {
				return;
			}
			this.running = false;
			this.time = 0;

			if (this.timeoutID) {
				clearTimeout(this.timeoutID);
				this.timeoutID = null;
			}
		},

		onUserEvent: function (event) {
			if (this.timeoutID) {
				clearTimeout(this.timeoutID);
				this.timeoutID = null;
			}

			if (this.idle) {
				this.idle = false;

				$(this.element)
					.trigger("idleTimer.active");
			}

			if (this.running) {
				this.timeoutID =
					setTimeout(this.callbacks.onTimeout, this.delay);
				this.time = time();
			}
		},

		onTimeout: function () {
			if (!this.idle) {
				this.idle = true;
				$(this.element)
					.trigger("idleTimer.idle");
			}

			this.timeoutID =
				setTimeout(this.callbacks.onTimeout, this.delay);
			this.time = time();
		}
	});

  $.fn.idleTimer = function (options) {
		var idleTimer;

		// destroy idle timer's
		if (($.type(options) === "string") &&
				(options === "destroy")) {

					$.each(this, function (index, element) {
							idleTimer = $(element).data("idleTimer");
							if (idleTimer) {
								idleTimer.destroy();
							}
					});

					return this;
				}

		// setup or re-create idle timer's
		options = $.extend(defaultOptions, options);
		$.each(this, function (index, element) {
			idleTimer = $(element).data("idleTimer");
			if (idleTimer) {
				idleTimer.destroy();
			}

			idleTimer = new IdleTimer(element, options.delay, options.events);
			if (options.startImmediately) {
				idleTimer.start();
			}
		});

		return this;
  };

	$.idleTimer = function () {
		$.fn.idleTimer.apply([document], arguments);
	};
}));
