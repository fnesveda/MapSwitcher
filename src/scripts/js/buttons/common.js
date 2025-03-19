function updateButtonHref(destination) {
	const mapInfo = getMapInfo();
	
	const button = document.querySelector(`.map-switch-button[data-map-switcher-destination="${destination}"]`);
	if (button) button.setAttribute("href", getDestinationUrl(destination, mapInfo));
}

const buttonAdders = [];
function registerButtonAdder(buttonAdder) {
	buttonAdders.push(buttonAdder);
}

runOnPageLoad(async () => {
	const currentMapInfo = getMapInfo();
	const options = await loadOptionsFromStorage();
	
	await Promise.all(buttonAdders.map((buttonAdder) => buttonAdder({ options, currentMapInfo })));
});