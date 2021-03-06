// switch map provider from the current one to the destination one
async function switchMapTo(destination, sourceButton) {
	// if the map switch was successful
	var success = false;
	
	// animate the button that was clicked
	sourceButton.classList.add("map-switch-button-working");
	
	// extract the current map position and zoom and type from the current URL
	// choose how to do it based on the current map provider
	var mapInfo = null;
	if (location.hostname.indexOf("google.") >= 0) {
		mapInfo = GMUrlToUniversal(location.href);
	}
	else if (location.hostname.indexOf("mapy.cz") >= 0) {
		mapInfo = MCZurlToUniversal(location.href);
	}
	
	// based on the current map info, switch to the destination map provider
	if (mapInfo != null) {
		var destURL = "";
		if (destination == "mapycz") {
			// Mapy.cz have a straightforward conversion
			destURL = universalToMCZUrl(mapInfo);
		}
		else if (destination == "googlemaps") {
			// Google Maps have a straightforward conversion
			destURL = universalToGMUrl(mapInfo);
		}
		else if (destination == "geoportal") {
			// it's not so easy with geoportal
			// we need to send a CORS request, but we can't do it from content scripts
			// so we have to ask a background script to do the work for us
			geoportalResult = await new Promise(function(resolve, reject) {
				chrome.runtime.sendMessage({"command": "getGeoportalURL", "location": mapInfo}, function(response) {resolve(response);});
			});
			
			// check whether the request was successful
			if (geoportalResult.success) {
				destURL = geoportalResult.result;
			}
			else {
				console.error("Opening Geoportal unsuccessful:");
				console.error(geoportalResult.result);
			}
		}
		if (destURL.length > 0) {
			// this could be done with window.open for Mapy.cz and Google Maps
			// but we can't asynchronously open a Geoportal tab from the content script without it being flagged as a popup
			// so let's just do it from a background page
			chrome.runtime.sendMessage({"command": "openTab", "url": destURL});
			success = true;
		}
	}
	// stop the clicked button animation
	sourceButton.classList.remove("map-switch-button-working");
	
	// if the opening of the destination map provider failed, show the user an error animation on the clicked button
	if (!success) {
		sourceButton.classList.add("map-switch-button-error");
		setTimeout(function() { sourceButton.classList.remove("map-switch-button-error"); }, 2500);
	}
}
