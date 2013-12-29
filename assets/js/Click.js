$(function(){
	QuickerClicker.Click = Backbone.Model.extend({
		initialize: function(){
			this.set("timeCreated", new Date().getTime());
		}
	});

	QuickerClicker.ClickCollection = Backbone.Collection.extend({
		model: QuickerClicker.Click,

		getFastestClick: function(){
			var fastestClickInMilliseconds = undefined;
			var timeOfPreviousClick = undefined;
			this.each(function(click){
				if (timeOfPreviousClick != undefined){
					var speedOfThisClick = click.get("timeCreated") - timeOfPreviousClick;
					fastestClickInMilliseconds = fastestClickInMilliseconds == undefined ? speedOfThisClick : fastestClickInMilliseconds;
					fastestClickInMilliseconds = fastestClickInMilliseconds < speedOfThisClick ? fastestClickInMilliseconds : speedOfThisClick;
				}
				timeOfPreviousClick = click.get("timeCreated");
			});
			return fastestClickInMilliseconds;
		}
	});
});
