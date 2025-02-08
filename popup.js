document.getElementById("start-timer").addEventListener("click", function() {
    alert("Focus session started! 🤠 Get to work, partner!");
});

document.getElementById("group-tabs").addEventListener("click", function() {
    chrome.tabs.query({}, function(tabs) {
        alert(`You have ${tabs.length} tabs open! Time to wrangle 'em up!`);
    });
});