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

        var counts = [];
        var last = "";
        var count = 0;
        const timeout = 10;

        async function start() {
            while(parseInt(document.querySelector(".left").textContent.split(": ")[1]) > 0) {
                var d = document.querySelector(".problem").textContent;
                count++;
                if(last !== d) {
                    if(last !== "")
                        counts.push({"problem": last, "time": count * timeout});
                    last = d;
                    count = 0;
                }
                await new Promise(r => setTimeout(r, timeout));
            }
            counts.sort((a,b)=>a.time-b.time);
            console.log(counts);
            var array = [];
            for(var k of counts) array.push(k.time);
            getStandardDeviation(array);
        }

        function getStandardDeviation (array) {
            const n = array.length
            const mean = array.reduce((a, b) => a + b) / n
            const std = Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
            console.log(`mean: ${mean}, std: ${std}`);
        }


        var timer = setInterval(async () => {
            if(document.querySelector(".left") && parseInt(document.querySelector(".left").textContent.split(": ")[1]) > 0) {
                console.log("started!");
                clearInterval(timer);
                await start();
                console.log("done!");
            }
        }, 500);
})();
