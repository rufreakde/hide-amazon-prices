
var regex = new RegExp(/([0-9]+,[0-9]+&nbsp;[€$])/, "gm")
var regex_cleanup = new RegExp(/(<p class="price-hidden">)([0-9]+,[0-9]+&nbsp;[€$])(<\/p>)/, "gm")
var extensionEnabled = true;
var created = false;

function setEnabled(boolean) {
    extensionEnabled = boolean;
}

chrome.runtime.sendMessage({ provide_enabled: "extensionEnabled" }, function (response) {
    extensionEnabled = response.enabled;
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        setEnabled(request.enabled);

        if (request.enabled == true) {
            sendResponse({ setting: "enabled" });
            createOverlay();
            hide_price();
        }
        else {
            sendResponse({ setting: "disabled" });
            overlay_off();
            show_price();
        }
    });

function overlay_on() {
    createOverlay();
    document.getElementById("hide-overlay").style.display = "block";
}

function overlay_off() {
    createOverlay();
    document.getElementById("hide-overlay").style.display = "none";
}

function hide_price() {
    var dom_body_string = document.body.innerHTML;
    document.body.innerHTML = dom_body_string.replace(regex, "<p class=\"price-hidden\">$1</p>")
}

function show_price() {
    var dom_body_string = document.body.innerHTML;
    document.body.innerHTML = dom_body_string.replace(regex_cleanup, "$2") // group 2 is price and group 1 is the css inline code
}

function createOverlay() {
    if (!document.getElementById("hide-overlay")) {
        var newDiv = document.createElement("div");
        newDiv.setAttribute("id", "hide-overlay");
        document.childNodes[1].appendChild(newDiv)
    }
}


function startObserving() {
    // OBSERVER FOR CHANGES
    // Select the node that will be observed for mutations
    const targetNode = document.childNodes[1];

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function (mutationsList, observer) {
        if (extensionEnabled) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // TODO find out when something is clicked that destroyed the price stuff!
                }
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
}

createOverlay();

document.addEventListener('DOMContentLoaded', (event) => {
    if (extensionEnabled) {
        hide_price();
        overlay_off();
        // startObserving(); TODO
    }
});

document.addEventListener('readystatechange', (event) => {
    if (extensionEnabled) {
        if (document.readyState != 'complete') {
            overlay_on();
        }
    }
});


