document.addEventListener("DOMContentLoaded", function () {
    let timer;
    let timeLeft = 25 * 60; // 25 minutes in seconds
    let isRunning = false;
    let userPoints = 0; // Points for productivity

    const startButton = document.getElementById("start-timer");
    const statusMessage = document.getElementById("status-message");
    const pointsDisplay = document.getElementById("points-display"); // Added for displaying points

    const lofiMusic = document.getElementById("lofi-music");
    const volumeControl = document.getElementById("volume-control");

    // Load user points from storage
    chrome.storage.sync.get(["productivityPoints"], function (data) {
        userPoints = data.productivityPoints || 0;
        pointsDisplay.textContent = `🏆 Points: ${userPoints}`;
    });

    // Update volume when slider changes
    volumeControl.addEventListener("input", function () {
        lofiMusic.volume = volumeControl.value;
    });

    startButton.addEventListener("click", function () {
        if (!isRunning) {
            isRunning = true;
            startButton.textContent = "Working... ⏳";
            lofiMusic.play();
            startTimer();
        }
    });

    function startTimer() {
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timer);
                notifyBreak();
                completeSession();
            }
        }, 1000);
    }

    function updateDisplay() {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        statusMessage.textContent = `Focus Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function notifyBreak() {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "assets/icon48.png",
            title: "Break Time! 🤠",
            message: "Great job, partner! Take a 5-minute break before the next session."
        });
    }

    function completeSession() {
        isRunning = false;
        timeLeft = 25 * 60;
        startButton.textContent = "Start Focus Session";
        statusMessage.textContent = "Focus session complete! 🎉";

        // Award points for completing a session
        userPoints += 10;
        chrome.storage.sync.set({ productivityPoints: userPoints }, function () {
            pointsDisplay.textContent = `🏆 Points: ${userPoints}`;
        });

        lofiMusic.pause();
        lofiMusic.currentTime = 0; // Restart music from the beginning next time
    }

    // "Wrangle My Tabs" Button - Categorizing Tabs
    document.getElementById("group-tabs").addEventListener("click", function () {
        chrome.tabs.query({}, function (tabs) {
            let categories = {
                "Work": [],
                "Shopping": [],
                "Entertainment": [],
                "Social Media": [],
                "Other": []
            };

            // URL Matching for Categorization
            tabs.forEach(tab => {
                let url = tab.url;

                // Skip invalid URLs (prevents blank tab groups)
                if (!url || url.startsWith("chrome://") || url.startsWith("about:") || url.startsWith("edge://")) {
                    return;
                }

                if (url.includes("docs.google.com") || url.includes("notion.so") || url.includes("github.com")) {
                    categories["Work"].push(tab.id);
                } else if (url.includes("amazon.com") || url.includes("ebay.com") || url.includes("etsy.com")) {
                    categories["Shopping"].push(tab.id);
                } else if (url.includes("youtube.com") || url.includes("netflix.com") || url.includes("hulu.com")) {
                    categories["Entertainment"].push(tab.id);
                } else if (url.includes("facebook.com") || url.includes("twitter.com") || url.includes("instagram.com")) {
                    categories["Social Media"].push(tab.id);
                } else {
                    categories["Other"].push(tab.id);
                }
            });

            // Create tab groups only if there are valid tabs in the category
            for (let category in categories) {
                if (categories[category].length > 0) {
                    chrome.tabs.group({ tabIds: categories[category] }, function (groupId) {
                        chrome.tabGroups.update(groupId, {
                            title: category,  // Assigns name to the group
                            color: getCategoryColor(category)  // Assigns a fixed color
                        });
                    });
                }
            }

            alert("Tabs have been wrangled into categories! 🤠");
        });
    });

    // Assign Fixed Colors to Each Tab Group
    function getCategoryColor(category) {
        const colors = {
            "Work": "blue",
            "Shopping": "red",
            "Entertainment": "yellow",
            "Social Media": "green",
            "Other": "gray"
        };
        return colors[category] || "gray";
    }
});
