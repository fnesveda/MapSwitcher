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
