// adds map switcher buttons to Mapy.cz
async function addButtonsToMapyCZ() {
	var options = await loadOptionsFromStorage();

	const currentMapInfo = getMapInfo();

	// remove the old button wrapper if present
	var buttonWrapper = document.getElementById("map-switch-button-wrapper");
	if (buttonWrapper != null) {
		buttonWrapper.remove();
	}

	// create a new element structure containing the buttons to other map providers
	buttonWrapper = document.createElement("mapy-map-button-group");
	buttonWrapper.setAttribute("id", "map-switch-button-wrapper");
	

	// add Google Maps button if desired
	if (options.showGMapsButton) {
		var GMSwitchButton = document.createElement("a");
		GMSwitchButton.setAttribute("class", "map-switch-button map-switch-button-google-maps");
		GMSwitchButton.setAttribute("href", getDestinationUrl("googlemaps", currentMapInfo));
		GMSwitchButton.setAttribute("target", "_blank");
		GMSwitchButton.setAttribute("rel", "noopener");
		GMSwitchButton.addEventListener("mouseenter", updateButtonHrefs)

		var GMSwitchButtonSpan = document.createElement("span");
		GMSwitchButtonSpan.setAttribute("class", "map-switch-button-text");
		GMSwitchButtonSpan.innerText = chrome.i18n.getMessage("google_maps");
		GMSwitchButton.appendChild(GMSwitchButtonSpan);

		buttonWrapper.appendChild(GMSwitchButton);
	}

	if (buttonWrapper.hasChildNodes()) {
		// find where to insert the button wrapper in the webpage
		var topLeftTools = document.querySelector(".map-controls__topToolbar__leftTools");
		while (topLeftTools == null) {
			topLeftTools = document.querySelector(".map-controls__topToolbar__leftTools");
			await new Promise(resolve => setTimeout(resolve, 100));
		}
		
		// insert it there
		topLeftTools.appendChild(buttonWrapper);
	}
}

runOnPageLoad(addButtonsToMapyCZ);
