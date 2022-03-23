const myStyleElement = document.createElement("style");
const blurr = useBlurr ? "text-shadow: rgba(0, 0, 0, 0.8) -10px 0px 30px !important;" : "";
const cssRuleElement = `span[class*="price"],
span[class="tmm-olp-links"] *
{
    color: transparent !important;
    ${blurr}
    user-select: none;
  }
`;

let extensionEnabled = true;

const setEnabled = (boolean) => {
  extensionEnabled = boolean;
};

const overlay_on = () => {
  overlay_set("block");
};

const overlay_off = () => {
  overlay_set("none");
};

const overlay_set = (displayStyle) => {
  createOverlay();
  if (document.getElementById("hide-overlay")) {
    document.getElementById("hide-overlay").style.display = displayStyle;
  }
};

const hide_price = () => {
  document.head.appendChild(myStyleElement);
  myStyleElement.sheet.insertRule(cssRuleElement, 0);
};

const show_price = () => {
  document.head.appendChild(myStyleElement);
  myStyleElement.sheet.deleteRule(0);
};

const createOverlay = () => {
  if (!document.getElementById("hide-overlay") && document.childNodes[1]) {
    var newDiv = document.createElement("div");
    newDiv.setAttribute("id", "hide-overlay");
    document.childNodes[1].appendChild(newDiv);
  }
};

/**
 * Content to Background communication
 */
chrome.runtime.sendMessage({ provide_enabled: "extensionEnabled" }, function (response) {
  extensionEnabled = response.enabled;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  setEnabled(request.enabled);

  if (request.enabled == true) {
    sendResponse({ setting: "enabled" });
    createOverlay();
    hide_price();
  } else {
    sendResponse({ setting: "disabled" });
    overlay_off();
    show_price();
  }
});

/**
 * Extension hide/show
 */
createOverlay();

document.addEventListener("DOMContentLoaded", (event) => {
  if (extensionEnabled) {
    hide_price();
    overlay_off();
  }
});

document.addEventListener("readystatechange", (event) => {
  if (extensionEnabled) {
    if (document.readyState != "complete") {
      overlay_on();
    }
  }
});
