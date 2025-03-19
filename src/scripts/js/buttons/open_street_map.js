async function addButtonsToOsm(context) {
	if (location.hostname.indexOf("openstreetmap.org") < 0) return;
	
	const { options, currentMapInfo } = context;
	
	const destinationElement = document.querySelector("#map .leaflet-control-container .leaflet-top.leaflet-right");
	
	// remove the old buttons if present
	for (const oldButton of destinationElement.querySelectorAll(".map-switch-button")) {
		oldButton.remove();
	}
	
	for (const service of Object.values(MAP_SERVICE)) {
		if (service === MAP_SERVICE.OPEN_STREET_MAP) continue;
		
		if (options.shownButtons[service]) {
			const div = document.createElement("div");
			div.setAttribute("class", "leaflet-control");
			
			const button = document.createElement("a");
			button.setAttribute("class", "control-button map-switch-button");
			button.setAttribute("href", getDestinationUrl(service, currentMapInfo));
			button.setAttribute("target", "_blank");
			button.setAttribute("rel", "noopener");
			button.dataset.mapSwitcherDestination = service;
			button.addEventListener("mouseenter", () => updateButtonHref(service));
			div.appendChild(button);
			
			const icon = document.createElement("span");
			icon.setAttribute("class", "icon");
			button.appendChild(icon);
			
			destinationElement.appendChild(div);
		}
	}
	
	const buttons = [...destinationElement.querySelectorAll(".map-switch-button").values()];
	if (buttons.length) {
		buttons.at(0).setAttribute("class", buttons.at(0).getAttribute("class") + " control-button-first");
		buttons.at(-1).setAttribute("class", buttons.at(-1).getAttribute("class") + " control-button-last");
	}
}

registerButtonAdder(addButtonsToOsm)
