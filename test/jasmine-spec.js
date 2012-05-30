describe("Evenuts", function () {
	beforeEach(function () {
		Eventus = Eventus;
	});
	afterEach(function () {
		Eventus.events = {};
	})
	describe("Adding an event and a callback function", function () {
		var	callBack = function () {};
		beforeEach(function () {
			Eventus.on('newEvent', callBack);
		});
		it("Should add the event", function () {
			expect(Eventus.events['newEvent']).toBeDefined();
		});
		it("Should add the callback function to the new event", function () {
			expect(typeof Eventus.events['newEvent'][0].fn).toBe('function');
		});
	});
	describe("Adding 3 callbacks to the same event", function () {
		beforeEach(function () {
			Eventus.on('newEvent', function callback1 () {});
			Eventus.on('newEvent', function callback2 () {});
			Eventus.on('newEvent', function callback3 () {});
		});
		it("Should add callback number 1 to the event", function () {
			expect(typeof Eventus.events['newEvent'][0].fn).toBe('function');
		});
		it("Should add callback number 2to the event", function () {
			expect(typeof Eventus.events['newEvent'][1].fn).toBe('function');
		});
		it("Should add callback number 3 to the event", function () {
			expect(typeof Eventus.events['newEvent'][2].fn).toBe('function');
		});
	});
	describe("Adding an event without a callback function", function () {
		it("Should not add the new event", function () {
			Eventus.on('newEvent');
			expect(Eventus.events['newEvent']).not.toBeDefined();
		});
	});
	describe("Removing an event", function () {
		it("Removes the entire event and associated callbacks", function () {
			Eventus.on('newEvent');
			Eventus.off('newEvent');
			expect(Eventus.events['newEvent']).not.toBeDefined();
		});
	});
	describe("Removing a callback when multiple callbacks are registered", function () {
		var callBack1 = function () {},
			callBack2 = function () {},
			callBack3 = function () {},
			callBack4 = function () {};
		beforeEach(function () {
			Eventus.on('newEvent', callBack1);
			Eventus.on('newEvent', callBack2);
			Eventus.on('newEvent', callBack3);
			Eventus.on('newEvent', callBack4);
			Eventus.off('newEvent', callBack2);
		});
		it("Removes the callback function", function () {
			expect(Eventus.events['newEvent'][1].fn).not.toBeDefined();
		});
		it("Does not remove the event", function () {
			expect(Eventus.events['newEvent']).toBeDefined();
		});
	});
	describe("Firing an event", function () {
		var data = {name: 'Joe'},
			expectedData;
		beforeEach(function () {
			callBack = function (data) { expectedData = data; };
			Eventus.on('newEvent', callBack);
		});
		afterEach(function () {
			callBack = null;
			Eventus.off('newEvent', callBack);
		});
		describe("With data", function () {
			it("Does not throw an error", function () {
				expect(function () {
					Eventus.fire('newEvent', data);
				}).not.toThrow();
			});
			it("Passes the same data to the callback", function () {
				Eventus.fire('newEvent', data);
				expect(data).toEqual(expectedData);
				expect(expectedData.name).toBe('Joe');
			});
		});
		describe("Without data", function () {
			it("Does not throw an error", function () {
				expect(function () {
					Eventus.fire('newEvent');
				}).not.toThrow();
			});
		});
	});
	describe("Firing an event without a callback", function () {
		var callBack = null;
		it("Throws an error", function () {
			Eventus.on('newEvent', callBack);
			expect(function () {
				Eventus.fire('newEvent');
			}).toThrow({
				name: "CallbackError",
				message: "Cannot call null callback"
			});
		});
	});
	describe("Return 'PAUSE' in a callback", function () {
		var functions = {},
			cB1Fired = false, cB2Fired = false, cB3Fired = false, cB4Fired = false,
			callBack1 = function () { cB1Fired = true; },
			callBack2 = function () { cB2Fired = true; return 'PAUSE'; },
			callBack3 = function () { cB3Fired = true; },
			callBack4 = function () { cB4Fired = true; };
		it("Stops all subsequent callbacks from firing", function () {
			Eventus.on('newEvent', callBack1);
			Eventus.on('newEvent', callBack2);
			Eventus.on('newEvent', callBack3);
			Eventus.on('newEvent', callBack4);
			Eventus.fire('newEvent');
			expect(cB1Fired).toBe(true);
			expect(cB2Fired).toBe(true);
			expect(cB3Fired).toBe(false);
			expect(cB4Fired).toBe(false);
		});
	});
});