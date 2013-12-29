$(function(){
	QuickerClicker.Countdown = Backbone.Model.extend({
		defaults: {
			countdownTimeInSeconds: 3
		},

		initialize: function(){
			var self = this;

			QuickerClicker.vent.trigger("countdown:start", self);
			setTimeout(function(){ self.update(); }, 1000);
		},

		update: function(){
			var self = this;

			self.set("countdownTimeInSeconds", self.get("countdownTimeInSeconds") - 1);

			if (self.get("countdownTimeInSeconds") <= 0){
				QuickerClicker.vent.trigger("countdown:finish", self);
			} else {
				setTimeout(function(){ self.update(); }, 1000);
			}
		}
	});

	QuickerClicker.CountdownView = Backbone.Marionette.ItemView.extend({
		initialize: function(){
			this.listenTo(this.model, "change", this.render);
		},

		template: "#countdown-template"
	});
});
