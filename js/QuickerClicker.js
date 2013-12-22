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

	var startCountdown = function(){
		var countdown = new QuickerClicker.Countdown();
		var countdownView = new QuickerClicker.CountdownView({
			model: countdown
		});

		app.listenTo(countdown, "countdownComplete", function(){
			app.stopListening(countdown);
			startGame();
		});

		app.mainRegion.show(countdownView);
	};

	var newGame = function(){
		startCountdown();
	};

	var startGame = function(){
		var game = new QuickerClicker.Game();
		var gameView = new QuickerClicker.GameView({
			model: game
		});

		app.listenTo(clickerCatcher, "click", function(){game.addClick();});

		app.listenTo(game, "gameOver", onGameEnd);

		app.mainRegion.show(gameView);
		app.clickerCatcherRegion.show(clickerCatcherView);
	};

	var onGameEnd = function(game){
		app.stopListening(clickerCatcher);
		app.clickerCatcherRegion.reset();
	};

	app.on("initialize:after", function(){
		$(document).on("click", ".js-start-game", function(e){
			e.preventDefault();
			newGame();
		});
	});

	app.start();
});
