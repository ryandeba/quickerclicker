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

	QuickerClicker.ClickView = Backbone.Marionette.ItemView.extend({
		template: "#click-template",

		attributes: {
			"class": "animated fadeOutUp"
		},

		initialize: function(options){
			var self = this;
			self.options = options;
			setTimeout(function(){ self.$el.remove(); }, 2000);
		},

		onRender: function(){
			var self = this;

			var randomNumber = function(){
				var result = Math.floor(Math.random() * 30);
				return Math.random() > 0.5 ? result * - 1 : result;
			};

			var randomRGBValue = function(){
				return Math.floor(Math.random() * 255);
			};

			self.$el.css({
				"position": "absolute",
				"z-index": 998,
				"top": self.options.top + randomNumber(),
				"left": self.options.left + randomNumber(),
				"color": "rgb(" + randomRGBValue() + ", " + randomRGBValue() + ", " + randomRGBValue() + ")"
			});
		}
	});
});
