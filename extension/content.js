(function () {
	window.save = 0;
	setInterval(function () {
		secondsHTML = document.getElementsByClassName("left")[0].innerHTML;
		var seconds = parseInt(secondsHTML.match(/\d+/g).map(Number));

		scoreHTML = document.getElementsByClassName("correct")[0].innerHTML;
		var score = parseInt(scoreHTML.match(/\d+/g).map(Number));

		// debug
		// console.log(`seconds: ${seconds}, score: ${score}`);

		var save = (seconds === 0) && (window.save === 0);
		if (save) {
			window.save = 1;
			chrome.storage.sync.get(["url", "token"], items => {
				if (!chrome.runtime.error) {
					console.log("GAME COMPLETED");
					console.log("Score: ", score);
					console.log("Seconds: ", seconds);
					console.log(`Saving to ${items.url} with token ${items.token}`);

					fetch(items.url, {
						method: "POST",
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ 
							"score": score,
							"token": items.token
						})
					}).then(res => res.json())
						.then(res => {
							console.log(res)
							console.log(`Saved results to ${items.url}`);
						}).catch(err => {
							console.error(err);
							console.log("Could not save successfully!");
						})
				}
			});
		}
	}, 300);
})();
