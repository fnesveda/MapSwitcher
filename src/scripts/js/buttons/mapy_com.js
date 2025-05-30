// adds map switcher buttons to Mapy.com
async function addButtonsToMapyCom(context) {
	if (location.hostname.indexOf("mapy.com") < 0) return;
	
	const { options, currentMapInfo } = context;
	
	// remove the old button wrapper if present
	document.getElementById("map-switch-button-wrapper")?.remove();
	
	// create a new element structure containing the buttons to other map providers
	const buttonWrapper = document.createElement("mapy-map-button-group");
	buttonWrapper.setAttribute("id", "map-switch-button-wrapper");
	
	for (const service of Object.values(MAP_SERVICE)) {
		if (service === MAP_SERVICE.MAPY_COM) continue;
		
		if (options.shownButtons[service]) {
			const button = document.createElement("a");
			button.setAttribute("class", "map-switch-button");
			button.setAttribute("href", getDestinationUrl(service, currentMapInfo));
			button.setAttribute("target", "_blank");
			button.setAttribute("rel", "noopener");
			button.dataset.mapSwitcherDestination = service;
			button.addEventListener("mouseenter", () => updateButtonHref(service));
			
			const icon = document.createElement("span");
			icon.setAttribute("class", "map-switch-button-icon");
			button.appendChild(icon);
			
			const buttonText = document.createElement("span");
			buttonText.setAttribute("class", "map-switch-button-text");
			buttonText.textContent = getMapServiceName(service);
			button.appendChild(buttonText);
			
			buttonWrapper.appendChild(button);
		}
	}
	
	if (buttonWrapper.hasChildNodes()) {
		const destinationElement = await waitForElement(".map-controls__topToolbar__leftTools", 2000);
		if (!destinationElement) throw new Error("Could not find destination element for Mapy.com buttons");
		
		destinationElement.appendChild(buttonWrapper);
	}
}

registerButtonAdder(addButtonsToMapyCom);
