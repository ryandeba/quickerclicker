$(function(){
	QuickerClicker = new Backbone.Marionette.Application();

	QuickerClicker.addRegions({
		main: "#quickerclicker"
	});

	QuickerClicker.ClickOMeter = Backbone.Model.extend({

		defaults: {
			countdownTimeInSeconds: 3,
			countdownActive: false,
			gameActive: false,
			clicksPerSecond: 0.0,
			numberOfClicks: 0,
			updateSpeedInMilliseconds: 50,
			timeToLiveInMilliseconds: 15000,
			numberOfMillisecondsRemaing: 0,
			millisecondsToFirstClick: undefined,
			millisecondsOfFastestClick: undefined,
			mostRecentClickEpoch: undefined
		},

		registerClick: function(){
			if (this.get("numberOfMillisecondsRemaing") > 0){

				this.set("numberOfClicks", this.get("numberOfClicks") + 1);
				if (this.get("millisecondsToFirstClick") == undefined){
					this.set("millisecondsToFirstClick", new Date().getTime() - this.get("dateTimerStart").getTime());
				}

				var thisClickEpoch = new Date().getTime();
				if (this.get("mostRecentClickEpoch") != undefined){
					var speedOfThisClickInMilliseconds = thisClickEpoch - this.get("mostRecentClickEpoch");
					if (
						this.get("millisecondsOfFastestClick") == undefined
						|| speedOfThisClickInMilliseconds < this.get("millisecondsOfFastestClick")
					){
						this.set("millisecondsOfFastestClick", speedOfThisClickInMilliseconds);
					}
				}
				this.set("mostRecentClickEpoch", thisClickEpoch);

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

			self.set("gameActive", true);

			var countdownTimeout = function(){
				self.set("countdownTimeInSeconds", self.get("countdownTimeInSeconds") - 1);
				if (self.get("countdownTimeInSeconds") > 0){
					setTimeout(countdownTimeout, 1000);
				} else {
					self.set("countdownActive", false);
					self.set("timerStartEpoch", new Date().getTime());
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
				self.set("gameActive", false);
				self.trigger("gameOver");
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

		events: {
			"click .js-start-game": "startGame"
		},

		attributes: {
			"id": "clickometer"
		},

		getTemplate: function(){
			if (this.model.get("gameActive")){
				return "#clickometer-template";
			}
			return "#menu-template";
		},

		startGame: function(){
			this.model.start();
		}

	});

	QuickerClicker.Achievement = Backbone.Model.extend({
	});

	QuickerClicker.Achievements = Backbone.Collection.extend({
		model: QuickerClicker.Achievement
	});

	QuickerClicker.on("initialize:after", function(){
		$(document).on("click", function(e){
			if (e.originalEvent != undefined){
				clickOMeter.registerClick();
			}
		});

		QuickerClicker.main.show(clickOMeterView);
	});

	var clickOMeter = new QuickerClicker.ClickOMeter();
	var clickOMeterView = new QuickerClicker.ClickOMeterView({
		attributes: {
			"class": "row"
		},

		model: clickOMeter
	});

	QuickerClicker.start();
});
