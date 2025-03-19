function getMapInfo() {
	if (location.hostname.indexOf("google.") >= 0) {
		return GMUrlToUniversal(location.href);
	}
	else if (location.hostname.indexOf("mapy.cz") >= 0) {
		return MCZurlToUniversal(location.href);
	}
	return null;
}

function getDestinationUrl(destination, mapInfo) {
	if (destination == "googlemaps") {
		return universalToGMUrl(mapInfo);
	}
	else if (destination == "mapycz") {
		return universalToMCZUrl(mapInfo);
	}
	return "";
}

function runOnPageLoad(callback) {
	// normally, we shouldn't need to wait for window.onload, as content scripts should be injected on document_idle by default
	// but something changed in Firefox 67+ and the content scripts are sometimes executed earlier
	if (document.readyState === 'complete') {
		callback();
	} else {
		window.addEventListener('load', callback);
	}
};
