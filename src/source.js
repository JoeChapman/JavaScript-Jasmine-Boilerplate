Eventus = {
	
	events: {},

	on: function(event, fn, context) {
		if (typeof fn === 'undefined') {
			return;
		}
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push({fn: fn, context: context});
	},

	off: function(event, fn) {
		if (!this.events[event]) {
			return;
		}
		var i, ev = this.events[event];
		for (i = 0, len = ev.length; i < len; i++) {
			if (typeof fn === 'function') {
				if (ev[i].fn === fn) {
					ev[i].fn = null;
					delete ev[i].fn;
				}
			} else {
			 	ev.splice(i, 1);
			}
		} 
	},
	
	fire: function(event, data, context) {
		if (!this.events[event]) {
			return;
		}
		var i, ev = this.events[event];
		for (i = 0, len = ev.length; i < len; i++) {
			try {
				if ('PAUSE' === ev[i].fn.call((context || ev[i].context || this), data)) {
					break;
				}
			} catch (e) {
				throw {
					name: "CallbackError",
					message: "Cannot call null callback"
				}
			}
			
		}
	}
};