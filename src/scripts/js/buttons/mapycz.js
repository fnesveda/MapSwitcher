// adds map switcher buttons to Mapy.cz
async function addButtonsToMapyCZ() {
	var options = await loadOptionsFromStorage();
	// find the structure containing the buttons
	var mcButtonGroup = document.querySelector(".map-control .button-group");
	
	// remove the old buttons if they're present
	mcButtonGroup.querySelectorAll(".map-switch-button").forEach(elem => elem.remove());
	
	// add Google Maps button if desired
	if (options.showGMapsButton) {
		var GMSwitchButton = document.createElement("button");
		GMSwitchButton.setAttribute("class", "map-switch-button map-switch-button-google-maps");
		GMSwitchButton.addEventListener("click", function(e) {switchMapTo("googlemaps", e.currentTarget);});
		var GMSwitchButtonSpan = document.createElement("span");
		GMSwitchButtonSpan.innerText = chrome.i18n.getMessage("google_maps");
		GMSwitchButton.appendChild(GMSwitchButtonSpan);
		mcButtonGroup.insertBefore(GMSwitchButton, mcButtonGroup.firstChild);
	}
}

// normally, we shouldn't need to wait for window.onload, as content scripts should be injected on document_idle by default
// but something changed in Firefox 67+ and the content scripts are sometimes executed earlier
if (document.readyState === 'complete') { // window.onload has already fired
	addButtonsToMapyCZ();
}
else {
	window.addEventListener('load', addButtonsToMapyCZ);
}
