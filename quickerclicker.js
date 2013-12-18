$(function(){
	QuickerClicker = new Backbone.Marionette.Application();

	QuickerClicker.addRegions({
		main: "#quickerclicker"
	});

	QuickerClicker.ClickOMeter = Backbone.Model.extend({
		initialize: function(){
			var self = this;
			self.startTimer();
		},

		defaults: {
			clicksPerSecond: 0.0,
			numberOfClicks: 0,
			updateSpeedInMilliseconds: 100,
			timeToLiveInMilliseconds: 30000,
			numberOfMillisecondsRemaing: 30000
		},

		registerClick: function(){
			if (this.get("numberOfMillisecondsRemaing") > 0){
				this.set("numberOfClicks", this.get("numberOfClicks") + 1);
			}
		},

		resetToDefaults: function(){
			this.set(this.defaults);
		},

		startTimer: function(){
			var self = this;
			if (self.get("timerInterval") == undefined){
				self.resetToDefaults();
				self.set("timerInterval", setInterval(function(){ self.update(); }, self.get("updateSpeedInMilliseconds")));
			}
		},

		stopTimer: function(){
			var self = this;
			if (self.get("timerInterval") != undefined){
				clearInterval(self.get("timerInterval"));
				self.set("timerInterval", undefined);
			}
			this.trigger("gameOver");
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

		QuickerClicker.main.show(clickOMeterView);
	});

	QuickerClicker.start();
});
