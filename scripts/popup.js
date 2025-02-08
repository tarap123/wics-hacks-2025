document.getElementById("start-timer").addEventListener("click", function() {
    alert("Focus session started! 🤠 Get to work, partner!");
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

                if (url.includes("docs.google.com") || url.includes("notion.so") || url.includes("github.com")) {
                    categories["Work"].push(tab);
                } else if (url.includes("amazon.com") || url.includes("ebay.com") || url.includes("etsy.com")) {
                    categories["Shopping"].push(tab);
                } else if (url.includes("youtube.com") || url.includes("netflix.com") || url.includes("hulu.com")) {
                    categories["Entertainment"].push(tab);
                } else if (url.includes("facebook.com") || url.includes("twitter.com") || url.includes("instagram.com")) {
                    categories["Social Media"].push(tab);
                } else {
                    categories["Other"].push(tab);
                }
            });

            // Create tab groups
            for (let category in categories) {
                if (categories[category].length > 0) {
                    chrome.tabs.group({
                        tabIds: categories[category].map(tab => tab.id)
                    }, function(groupId) {
                        chrome.tabGroups.update(groupId, {
                            title: category,
                            color: getCategoryColor(category)
                        });
                    });
                }
            }

            alert("Tabs have been wrangled into categories! 🤠");
        });
    });
});

// Assign Colors to Tab Groups
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



