$(function(){
	QuickerClicker = new Backbone.Marionette.Application();

	QuickerClicker.addRegions({
		main: "#quickerclicker"
	});

	QuickerClicker.ClickOMeter = Backbone.Model.extend({
		initialize: function(){
		},

		defaults: {
			countdownTimeInSeconds: 3,
			countdownActive: false,
			clicksPerSecond: 0.0,
			numberOfClicks: 0,
			updateSpeedInMilliseconds: 100,
			timeToLiveInMilliseconds: 30000,
			numberOfMillisecondsRemaing: 0,
			timeToFirstClick: undefined,
			fastestClick: undefined
		},

		registerClick: function(){
			if (this.get("numberOfMillisecondsRemaing") > 0){
				this.set("numberOfClicks", this.get("numberOfClicks") + 1);
				if (this.get("timeToFirstClick") == undefined){
					this.set("timeToFirstClick", this.get("dateTimerStart").getTime() - new Date().getTime());
				}
			}
		},

		resetToDefaults: function(){
			this.set(this.defaults);
			return this;
		},

		start: function(){
			var self = this;
			if (self.get("timerInterval") == undefined){
				self.resetToDefaults();
				self.startCountdown();
			}
		},

		startTimer: function(){
			var self = this;
			self.set("dateTimerStart", new Date());
			self.set("numberOfMillisecondsRemaing", self.get("timeToLiveInMilliseconds"));
			self.set("timerInterval", setInterval(function(){ self.update(); }, self.get("updateSpeedInMilliseconds")));
		},

		startCountdown: function(){
			var self = this;

			var countdownTimeout = function(){
				self.set("countdownTimeInSeconds", self.get("countdownTimeInSeconds") - 1);
				if (self.get("countdownTimeInSeconds") > 0){
					setTimeout(countdownTimeout, 1000);
				} else {
					self.set("countdownActive", false);
					self.startTimer();
				}
			}

			self.set("countdownActive", true);
			setTimeout(countdownTimeout, 1000);
		},

		stopTimer: function(){
			var self = this;
			if (self.get("timerInterval") != undefined){
				clearInterval(self.get("timerInterval"));
				self.set("timerInterval", undefined);
			}
		},

		update: function(){
			var self = this;
			if (self.get("numberOfMillisecondsRemaing") <= 0){
				self.stopTimer();
			}
			self.set("numberOfMillisecondsRemaing", self.get("numberOfMillisecondsRemaing") - self.get("updateSpeedInMilliseconds"));
			self.set("clicksPerSecond", self.getClicksPerSecond());
		},

		getClicksPerSecond: function(){
			var numberOfClicks = this.get("numberOfClicks");
			var millisecondsPassed = this.get("timeToLiveInMilliseconds") - this.get("numberOfMillisecondsRemaing");
			return numberOfClicks / millisecondsPassed * 1000;
		}

	});

	QuickerClicker.ClickOMeterView = Backbone.Marionette.ItemView.extend({
		initialize: function(){
			this.listenTo(this.model, "change", this.render);
		},

		attributes: {
			"id": "clickometer"
		},

		template: "#clickometer-template"
	});

	QuickerClicker.on("initialize:after", function(){
		var clickOMeter = new QuickerClicker.ClickOMeter();

		var clickOMeterView = new QuickerClicker.ClickOMeterView({
			model: clickOMeter
		});

		$("html").on("click", function(){
			clickOMeter.registerClick();
		});

		$(document).on("click", ".js-start", function(e){
			e.preventDefault();
			clickOMeter.start();
		});

		QuickerClicker.main.show(clickOMeterView);
	});

	QuickerClicker.start();
});
