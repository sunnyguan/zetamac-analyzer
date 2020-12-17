// popup.js

document.body.onload = function () {
  chrome.storage.sync.get(["url", "token"], function (items) {
    if (!chrome.runtime.error) {
      document.getElementById("saved-url").innerText = items.url;
      document.getElementById("saved-token").innerText = items.token;
    }
  });
}

document.getElementById("set").onclick = function () {
  var url = document.getElementById("url").value;
  var token = document.getElementById("token").value;
  chrome.storage.sync.set({ "url": url, "token": token }, function () {
    if (chrome.runtime.error) {
      console.log("Runtime error.");
    } else {
      document.getElementById("info").innerText = "Saved!";
      setTimeout(() => {
        document.getElementById("info").innerText = "";
        window.close();
      }, 1000)
    }
  });
  chrome.tabs.query({ active: true, currentWindow: true }, function (arrayOfTabs) {
    var code = 'window.location.reload();';
    chrome.tabs.executeScript(arrayOfTabs[0].id, { code: code });
  });
}
