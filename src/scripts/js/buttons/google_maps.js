// adds map switcher buttons to Google Maps
async function addButtonsToGoogleMaps(context) {
	if (location.hostname.indexOf("google.") < 0) return;
	
	const { options, currentMapInfo } = context;
	
	// remove the old button wrapper if present
	document.getElementById("map-switch-button-wrapper")?.remove();
	
	// create a new element structure containing the buttons to other map providers
	// first the one faking to be a real Google Maps element
	const buttonWrapper = document.createElement("div");
	buttonWrapper.setAttribute("id", "map-switch-button-wrapper");
	buttonWrapper.setAttribute("class", "app-horizontal-item");
	
	// next our own button container
	const buttonContainer = document.createElement("div");
	buttonContainer.setAttribute("class", "map-switch-button-container");
	buttonWrapper.appendChild(buttonContainer);
	
	// and last the actual buttons
	for (const service of Object.values(MAP_SERVICE)) {
		if (service === MAP_SERVICE.GOOGLE_MAPS) continue;

		if (options.shownButtons[service]) {
			const button = document.createElement("a");
			button.setAttribute("class", "map-switch-button");
			button.setAttribute("href", getDestinationUrl(service, currentMapInfo));
			button.setAttribute("target", "_blank");
			button.setAttribute("rel", "noopener");
			button.dataset.mapSwitcherDestination = service;
			button.addEventListener("mouseenter", () => updateButtonHref(service));
			
			buttonContainer.appendChild(button);
		}
	}
	
	// add the buttons to the DOM, if there are some
	if (buttonContainer.hasChildNodes()) {
		const destinationElement = document.querySelector(".app-bottom-content-anchor .app-horizontal-widget-holder");
		destinationElement.insertBefore(buttonWrapper, destinationElement.querySelector("#downgrade").nextSibling);
	}
}

registerButtonAdder(addButtonsToGoogleMaps);
