function updateButtonHrefs() {
	const mapInfo = getMapInfo();

	if (mapInfo == null) {
		return;
	}

	const mapyCZSwitchButton = document.querySelector(".map-switch-button-mapy-cz");
	if (mapyCZSwitchButton != null) {
		mapyCZSwitchButton.setAttribute("href", getDestinationUrl("mapycz", mapInfo));
	}

	const GMSwitchButton = document.querySelector(".map-switch-button-google-maps");
	if (GMSwitchButton != null) {
		GMSwitchButton.setAttribute("href", getDestinationUrl("googlemaps", mapInfo));
	}
}
