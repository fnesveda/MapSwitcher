// adds map switcher buttons to Mapy.cz
async function addButtonsToMapyCZ() {
	const options = await loadOptionsFromStorage();

	const currentMapInfo = getMapInfo();

	// remove the old button wrapper if present
	const oldButtonWrapper = document.getElementById("map-switch-button-wrapper");
	if (oldButtonWrapper != null) {
		oldButtonWrapper.remove();
	}

	// create a new element structure containing the buttons to other map providers
	const buttonWrapper = document.createElement("mapy-map-button-group");
	buttonWrapper.setAttribute("id", "map-switch-button-wrapper");
	

	// add Google Maps button if desired
	if (options.showGMapsButton) {
		const GMSwitchButton = document.createElement("a");
		GMSwitchButton.setAttribute("class", "map-switch-button map-switch-button-google-maps");
		GMSwitchButton.setAttribute("href", getDestinationUrl("googlemaps", currentMapInfo));
		GMSwitchButton.setAttribute("target", "_blank");
		GMSwitchButton.setAttribute("rel", "noopener");
		GMSwitchButton.addEventListener("mouseenter", updateButtonHrefs)

		const GMSwitchButtonSpan = document.createElement("span");
		GMSwitchButtonSpan.setAttribute("class", "map-switch-button-text");
		GMSwitchButtonSpan.innerText = chrome.i18n.getMessage("google_maps");
		GMSwitchButton.appendChild(GMSwitchButtonSpan);

		buttonWrapper.appendChild(GMSwitchButton);
	}

	if (buttonWrapper.hasChildNodes()) {
		const topLeftTools = await waitForElement(".map-controls__topToolbar__leftTools", 2000);
		
		if (topLeftTools) {
			topLeftTools.appendChild(buttonWrapper);
		}
	}
}

runOnPageLoad(addButtonsToMapyCZ);
