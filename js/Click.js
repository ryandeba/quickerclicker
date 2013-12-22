$(function(){
	QuickerClicker.Click = Backbone.Model.extend({
		initialize: function(){
			this.set("timeCreated", new Date().getTime());
		}
	});

	QuickerClicker.ClickCollection = Backbone.Collection.extend({
		model: QuickerClicker.Click
	});
});
