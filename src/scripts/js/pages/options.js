// save the currently selected options to extension storage
function saveOptionsFromElements() {
	var showMapyczButton    = document.getElementById("show-mapycz-button-checkbox").checked;
	var showGMapsButton     = document.getElementById("show-gmaps-button-checkbox").checked;
	options = {
		showMapyczButton: showMapyczButton,
		showGMapsButton: showGMapsButton,
	};
	saveOptionsToStorage(options);
}

// Restores select box and checkbox state using the preferences stored in chrome.storage.
function loadOptionsToElements() {
	loadOptionsFromStorage().then(function(options) {
		document.getElementById("show-mapycz-button-checkbox").checked = options.showMapyczButton;
		document.getElementById("show-gmaps-button-checkbox").checked = options.showGMapsButton;
	});
}

document.addEventListener("DOMContentLoaded", loadOptionsToElements);
document.querySelectorAll("input").forEach(function(elem) {elem.addEventListener("change", saveOptionsFromElements);});

// If browser is Opera, show the Opera Google maps warning
var operaWarning = document.getElementById("google-maps-opera-warning");
if (operaWarning != null) {
	if (/opera|opr/.test(navigator.userAgent)) {
		operaWarning.style.display = "block";
	} else {
		operaWarning.style.display = "none";
	}
}