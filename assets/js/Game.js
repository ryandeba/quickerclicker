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
				this.set("clicksPerSecond", this.get("clicks").length / (GAME_LENGTH_IN_MILLISECONDS / 1000)); //set the actual clicks per second
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

	QuickerClicker.GameCollectionView = Backbone.Marionette.View.extend({
		el: "#stats",

		render: function(){
			this.renderClicksPerSecond();
			this.renderSecondsToFirstClick();
			this.renderFastestClick();
		},

		renderClicksPerSecond: function(){
			var $thisEl = this.$el.find("#clicksPerSecond")
			$thisEl.html("");

			this.collection.sortBy(function(model){ return model.get("clicksPerSecond") * -1; });

			this.collection.each(function(model){
				var modelView = "<li>" + model.get("clicksPerSecond") + "</li>";
				$thisEl.append(modelView);
			});
		},

		renderSecondsToFirstClick: function(){
			var $thisEl = this.$el.find("#secondsToFirstClick")
			$thisEl.html("");

			this.collection.sortBy(function(model){ return model.get("millisecondsToFirstClick"); });

			this.collection.each(function(model){
				var modelView = "<li>" + model.get("millisecondsToFirstClick") / 1000 + "</li>";
				$thisEl.append(modelView);
			});
		},

		renderFastestClick: function(){
			var $thisEl = this.$el.find("#fastestClick")
			$thisEl.html("");

			this.collection.sortBy(function(model){ return model.get("fastestClickInMilliseconds"); });

			this.collection.each(function(model){
				var modelView = "<li>" + model.get("fastestClickInMilliseconds") / 1000 + "</li>";
				$thisEl.append(modelView);
			});
		}
	});

});
