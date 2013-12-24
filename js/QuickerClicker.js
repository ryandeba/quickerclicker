$(function(){
	QuickerClicker = new Backbone.Marionette.Application();

	QuickerClicker.addRegions({
		mainRegion: "#main",
		achievements: "#achievements",
		stats: "#stats",
		clickerCatcherRegion: "#clickercatcher"
	});

	var gameInProgress = false;

	var MenuView = Backbone.Marionette.View.extend({
		el: "#menu",

		events: {
			"click .js-start-game": "newGame"
		},

		newGame: function(e){
			e.preventDefault();
			QuickerClicker.vent.trigger("newGame");
		}
	});
	new MenuView();

	var ClickerCatcherView = Backbone.Marionette.View.extend({
		el: "#clickercatcher",

		events: {
			"click": "registerClick"
		},

		registerClick: function(){
			QuickerClicker.vent.trigger("clickerCatcher:click");
		}
	});
	var clickerCatcherView = new ClickerCatcherView();

	var achievements;

	QuickerClicker.on("initialize:after", function(){
		achievements = new QuickerClicker.AchievementCollection(
			[
				{
					name: "You suck!",
					description: "You do know you're supposed to click, right?",
					requirementsDescription: "0 clicks per second",
					statsMeetRequirements: function(stats){
						return stats.clicksPerSecond == 0;
					}
				},
				{
					name: "Uno",
					description: "A journey of a thousand clicks per second starts with a single click per second",
					requirementsDescription: "1 click per second",
					statsMeetRequirements: function(stats){
						return stats.clicksPerSecond == 1;
					}
				},
				{
					name: "High Five",
					description: "Slap some skin",
					requirementsDescription: "5 clicks per second",
					statsMeetRequirements: function(stats){
						return stats.clicksPerSecond == 5;
					}
				},
				{
					name: "Niner",
					description: "Niner? I barely know her!",
					requirementsDescription: "9 or more clicks per second",
					statsMeetRequirements: function(stats){
						return stats.clicksPerSecond >= 9;
					}
				}
			]
		);

		this.listenTo(this.vent, "newGame", function(){
			startCountdown();
		});
		this.listenTo(this.vent, "countdown:start", function(countdown){
			showCountdown(countdown);
		});
		this.listenTo(this.vent, "countdown:finish", function(countdown){
			startGame();
		});
		this.listenTo(this.vent, "game:start", function(game){
			showGame(game);
		});
		this.listenTo(this.vent, "game:finish", function(game){
			finishGame(game);
		});

		this.vent.trigger("newGame"); //TODO: maybe don't start it automatically?
	});

	var startCountdown = function(){
		if (gameInProgress) return false;
		gameInProgress = true;
		var countdown = new QuickerClicker.Countdown();
	};

	var showCountdown = function(countdown){
		var countdownView = new QuickerClicker.CountdownView({
			model: countdown
		});
		hideAchievements();
		QuickerClicker.mainRegion.show(countdownView);
	};

	var startGame = function(){
		var game = new QuickerClicker.Game();
	};

	var showGame = function(game){
		var gameView = new QuickerClicker.GameView({
			model: game
		});
		clickerCatcherView.$el.show();
		QuickerClicker.mainRegion.show(gameView);
	};

	var finishGame = function(game){
		clickerCatcherView.$el.hide();
		gameInProgress = false;
		achievements.tryToUnlock(game.getStats());
		showAchievements();
	};

	var hideAchievements = function(){
		QuickerClicker.achievements.reset();
	};

	var showAchievements = function(){
		var achievementsView = new QuickerClicker.AchievementCollectionView({
			collection: achievements
		});
		QuickerClicker.achievements.show(achievementsView);
	};

});
