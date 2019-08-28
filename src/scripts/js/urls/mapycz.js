// construct the Mapy.cz url from the universal map location representation
function universalToMCZUrl(universal) {
	let lon = universal.lon;
	let lat = universal.lat;
	let zoom = Math.round(universal.zoom);
	
	let type = "zakladni";
	if (universal.type == "satellite") {
		type = "letecka";
	}
	
	// put the URL together
	let url = "https://www.mapy.cz/" + type + "?" + "x=" + lon + "&y=" + lat + "&z=" + zoom + "&l=0";
	return url;
}

// parse the Mapy.cz url to the universal map location representation
function MCZurlToUniversal(url) {
	// check if maps are in satellite mode, or not
	let type = "basic";
	if ((url.indexOf("base=ophoto") >= 0) || (url.indexOf("letecka") >= 0)) {
		type = "satellite";
	}
	
	// get only the location and zoom part from the address
	let addr = url.substr(url.indexOf("?") + 1);
	
	// extract the position and zoom fields from the address
	let addrFields = addr.split("&");
	let lat = 0;
	let lon = 0;
	let zoom = 1;
	
	// parse the address parameters
	for (field of addrFields) {
		let par = field.split("=")[0];
		let val = field.split("=")[1];
		
		if (par == "x") {
			lon = parseFloat(val);
		}
		else if (par == "y") {
			lat = parseFloat(val);
		}
		else if (par == "z") {
			zoom = parseFloat(val);
		}
	}
	
	// put it all together
	let mapInfo = {
		type: type,
		lat: lat,
		lon: lon,
		zoom: zoom,
	};
	
	return mapInfo;
}
