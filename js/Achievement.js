$(function(){
	QuickerClicker.Achievement = Backbone.Model.extend({
		defaults: {
			name: "",
			description: "",
			unlocked: false,
			statsMeetRequirements: function(stats){
				return false;
			},

			tryToUnlock: function(stats){
				this.set("unlocked", this.statsMeetRequirements(stats));
			}
		}
	});

	QuickerClicker.AchievementCollection = Backbone.Collection.extend({
		model: QuickerClicker.Achievement
	});
});
