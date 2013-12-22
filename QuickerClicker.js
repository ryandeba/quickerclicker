$(function(){
	var app = new Backbone.Marionette.Application();

	app.addRegions({
		mainRegion: "#quickerclicker",
		clickerCatcherRegion: "#clickercatcher"
	});

	var clickerCatcher = new QuickerClicker.ClickerCatcher();
	var clickerCatcherView = new QuickerClicker.ClickerCatcherView({
		model: clickerCatcher
	});

	var achievements = new QuickerClicker.AchievementCollection([
		{
			name: "test",
			description: "this is a test",
			statsMeetRequirements: function(){
				return true;
			}
		}
	]);

	app.newGame = function(){
		var game = new QuickerClicker.Game();
		var gameView = new QuickerClicker.GameView({
			model: game
		});

		this.listenTo(clickerCatcher, "click", function(){game.addClick();});

		this.listenTo(game, "gameOver", this.onGameEnd);

		this.mainRegion.show(gameView);
		this.clickerCatcherRegion.show(clickerCatcherView);
	};

	app.onGameEnd = function(game){
		this.stopListening(clickerCatcher);
		this.clickerCatcherRegion.reset();
	};

	app.on("initialize:after", function(){
		this.newGame();
	});

	app.start();
});
