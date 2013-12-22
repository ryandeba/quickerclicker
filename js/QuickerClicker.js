$(function(){
	var app = new Backbone.Marionette.Application();

	app.addRegions({
		mainRegion: "#quickerclicker",
		clickerCatcherRegion: "#clickercatcher"
	});

	var achievements = new QuickerClicker.AchievementCollection([
		{
			name: "test",
			description: "this is a test",
			statsMeetRequirements: function(stats){
				return true;
			}
		}
	]);

	var gameHistory = new QuickerClicker.GameCollection();

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
		$(".js-start-game").hide();
		startCountdown();
	};

	var startGame = function(){
		var game = new QuickerClicker.Game();
		var gameView = new QuickerClicker.GameView({
			model: game
		});

		var clickerCatcher = new QuickerClicker.ClickerCatcher();
		var clickerCatcherView = new QuickerClicker.ClickerCatcherView({
			model: clickerCatcher
		});

		app.listenTo(clickerCatcher, "click", function(){game.addClick();});

		app.listenTo(game, "gameOver", onGameEnd);

		app.mainRegion.show(gameView);
		app.clickerCatcherRegion.show(clickerCatcherView);
	};

	var onGameEnd = function(game){
		gameHistory.add(game);
		app.clickerCatcherRegion.reset();
		$(".js-start-game").show();
	};

	var unlockAchievements = function(){
	};

	app.on("initialize:after", function(){
		$(document).on("click", ".js-start-game", function(e){
			e.preventDefault();
			newGame();
		});

		this.listenTo(gameHistory, "add", unlockAchievements);
	});

	app.start();
});
