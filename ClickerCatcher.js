$(function(){
	QuickerClicker.ClickerCatcher = Backbone.Model.extend({
	});

	QuickerClicker.ClickerCatcherView = Backbone.Marionette.ItemView.extend({
		attributes: {
			style: "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(50,50,50,.1);"
		},

		events: {
			"click": "clickHandler"
		},
		
		template: "#clickercatcher-template",

		clickHandler: function(){
			this.model.trigger("click");
		}
	});
});
