$(function(){
	var GAME_LENGTH_IN_MILLISECONDS = 5000;

	QuickerClicker.Game = Backbone.Model.extend({
		initialize: function(){
			var currentTime = new Date().getTime();
			this.set("millisecondsUntilGameOver", GAME_LENGTH_IN_MILLISECONDS);
			this.set("timeStarted", currentTime);
			this.set("percentOfTimeRemaining", 100);
			this.set("clicks", new QuickerClicker.ClickCollection());
			this.set("clicksPerSecond", 0);

			this.update();

			this.listenTo(QuickerClicker.vent, "clickerCatcher:click", this.addClick);
			QuickerClicker.vent.trigger("game:start", this);
		},

		getStats: function(){
			return {
				clicksPerSecond: parseFloat(this.get("clicksPerSecond").toFixed(2)),
				fastestClickInMilliseconds: this.getFastestClickInMilliseconds(),
				millisecondsToFirstClick: this.getMillisecondsToFirstClick()
			}
		},

		getMillisecondsToFirstClick: function(){
			if (this.get("clicks").length == 0) return undefined;
			return this.get("clicks").at(0).get("timeCreated") - this.get("timeStarted");
		},

		getFastestClickInMilliseconds: function(){
			return this.get("clicks").getFastestClick();
		},

		addClick: function(){
			this.get("clicks").add({});
		},

		update: function(){
			var self = this;

			var currentTime = new Date().getTime();
			var millisecondsUntilGameOver = GAME_LENGTH_IN_MILLISECONDS - (currentTime - this.get("timeStarted"));
			millisecondsUntilGameOver = millisecondsUntilGameOver < 0 ? 0 : millisecondsUntilGameOver;
			this.set("millisecondsUntilGameOver", millisecondsUntilGameOver);

			this.set("percentOfTimeRemaining", this.get("millisecondsUntilGameOver") / GAME_LENGTH_IN_MILLISECONDS * 100);

			var millisecondsElapsed = currentTime - this.get("timeStarted");
			var clicksPerSecond = this.get("clicks").length / (millisecondsElapsed / 1000);
			this.set("clicksPerSecond", clicksPerSecond);

			if (this.get("millisecondsUntilGameOver") > 0){
				setTimeout(function(){ self.update(); }, 10);
			} else {
				QuickerClicker.vent.trigger("game:finish", self);
			}
		}
	});

	QuickerClicker.GameView = Backbone.Marionette.ItemView.extend({
		initialize: function(){
			this.listenTo(this.model, "change", this.render);
		},

		template: "#game-template"
	});

	QuickerClicker.GameCollection = Backbone.Collection.extend({
		model: QuickerClicker.Game
	});

});
