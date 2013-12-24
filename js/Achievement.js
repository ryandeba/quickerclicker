$(function(){
	QuickerClicker.Achievement = Backbone.Model.extend({
		initialize: function(){
			var self = this;

			this.statsMeetRequirements = this.get("statsMeetRequirements"); //TODO: this seems kinda lame

			this.listenTo(this, "change:unlocked", function(){
				if (self.get("unlocked")){
					QuickerClicker.vent.trigger("achievement:unlocked", self);
				}
			});
		},

		defaults: {
			name: "",
			description: "",
			requirementsDescription: "",
			unlocked: false,
			statsMeetRequirements: function(stats){
				return false;
			}
		},

		tryToUnlock: function(stats){
			this.set("unlocked", this.statsMeetRequirements(stats));
		}
	});

	QuickerClicker.AchievementView = Backbone.Marionette.ItemView.extend({
		tagName: "div",

		template: "#achievement-template"
	});

	QuickerClicker.AchievementCollection = Backbone.Collection.extend({
		model: QuickerClicker.Achievement,

		tryToUnlock: function(stats){
			_.each(this.where({unlocked: false}), function(model){
				model.tryToUnlock(stats);
			});
		}
	});

	QuickerClicker.AchievementCollectionView = Backbone.Marionette.CompositeView.extend({
		attributes: {
			"class": "row"
		},

		itemView: QuickerClicker.AchievementView,

		itemViewContainer: ".js-item-views",

		template: "#achievement-collection-template"
	});
});
