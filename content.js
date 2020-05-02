
const myStyleElement = document.createElement("style");
const cssRuleElement = `span[class*="-price"]{
color: transparent!important;
text-shadow: rgba(0, 0, 0, 0.8) 10px 0px 10px !important;
border-style: dotted;
border-color: #f23838;
}
`;

let extensionEnabled = true;

const setEnabled = (boolean) => {
    extensionEnabled = boolean;
}

const overlay_on = () => {
    createOverlay();
    document.getElementById("hide-overlay").style.display = "block";
}

const overlay_off = () => {
    createOverlay();
    document.getElementById("hide-overlay").style.display = "none";
}

const hide_price = () => {
    document.head.appendChild(myStyleElement);
    myStyleElement.sheet.insertRule(cssRuleElement, 0);
}

const show_price = () => {
    document.head.appendChild(myStyleElement);
    myStyleElement.sheet.deleteRule(0)
}

const createOverlay = () => {
    if (!document.getElementById("hide-overlay")) {
        var newDiv = document.createElement("div");
        newDiv.setAttribute("id", "hide-overlay");
        document.childNodes[1].appendChild(newDiv)
    }
}

/**
 * Content to Background communication
 */
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

/**
 * Extension hide/show
 */
createOverlay();

document.addEventListener('DOMContentLoaded', (event) => {
    if (extensionEnabled) {
        hide_price();
        overlay_off();
    }
});

document.addEventListener('readystatechange', (event) => {
    if (extensionEnabled) {
        if (document.readyState != 'complete') {
            overlay_on();
        }
    }
});


