document.addEventListener("DOMContentLoaded", function() {
    let timer;
    let timeLeft = 25 * 60; // 25 minutes in seconds
    let isRunning = false;

    const startButton = document.getElementById("start-timer");
    const statusMessage = document.getElementById("status-message");

    startButton.addEventListener("click", function() {
        if (!isRunning) {
            isRunning = true;
            startButton.textContent = "Working... ⏳";
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
                resetTimer();
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

    function resetTimer() {
        isRunning = false;
        timeLeft = 25 * 60; // Reset to 25 minutes
        startButton.textContent = "Start Focus Session";
        statusMessage.textContent = "Focus session complete! 🎉";
    }
});


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("group-tabs").addEventListener("click", function() {
        chrome.tabs.query({}, function(tabs) {
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

                // Skip tabs with no valid URL (prevents blank tab groups)
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
                    chrome.tabs.group({ tabIds: categories[category] }, function(groupId) {
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
