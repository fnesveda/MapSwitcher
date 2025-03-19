// adds map switcher buttons to Google Maps
async function addButtonsToGMaps() {
	var options = await loadOptionsFromStorage();
	// remove the old button wrapper if present
	var buttonWrapper = document.getElementById("map-switch-button-wrapper");
	if (buttonWrapper != null) {
		buttonWrapper.remove();
	}
	
	// create a new element structure containing the buttons to other map providers
	// first the one faking to be a real Google Maps element
	buttonWrapper = document.createElement("div");
	buttonWrapper.setAttribute("id", "map-switch-button-wrapper");
	buttonWrapper.setAttribute("class", "app-horizontal-item");
	
	// next our own button container
	var buttonContainer = document.createElement("div");
	buttonContainer.setAttribute("class", "map-switch-button-container");
	
	// and last the actual buttons
	if (options.showMapyczButton) {
		var mapyCZSwitchButton = document.createElement("button");
		mapyCZSwitchButton.setAttribute("class", "map-switch-button map-switch-button-mapy-cz");
		mapyCZSwitchButton.addEventListener("click", function(e) { switchMapTo("mapycz", e.currentTarget); });
		buttonContainer.appendChild(mapyCZSwitchButton);
	}
	
	// add the buttons to the DOM, if there are some
	if (buttonContainer.hasChildNodes()) {
		buttonWrapper.appendChild(buttonContainer);
		
		// find where to insert the button wrapper in the webpage
		var bottomTools = document.querySelector(".app-bottom-content-anchor .app-horizontal-widget-holder");
		
		// insert it there
		bottomTools.insertBefore(buttonWrapper, bottomTools.querySelector("#downgrade").nextSibling);
	}
}

// normally, we shouldn't need to wait for window.onload, as content scripts should be injected on document_idle by default
// but something changed in Firefox 67+ and the content scripts are sometimes executed earlier
if (document.readyState === 'complete') { // window.onload has already fired
	addButtonsToGMaps();
}
else {
	window.addEventListener('load', addButtonsToGMaps);
}
