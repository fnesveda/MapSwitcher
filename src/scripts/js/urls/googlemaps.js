// construct the Google Maps url from the universal map location representation
function universalToGMUrl(universal) {
	let data = "";
	let zoom = universal.zoom + "z";
	
	// zoom values are different for satellite view
	if (universal.type == "satellite") {
		data = "data=!3m1!1e3";
		zoom = 51 * Math.pow(2, 21 - universal.zoom);
		zoom = zoom + "m";
	}
	
	const lon = universal.lon;
	const lat = universal.lat;
	
	return `https://www.google.com/maps/@${lat},${lon},${zoom}/${data}`;
}

// parse the Google Maps url to the universal map location representation
function GMUrlToUniversal(url) {
	// check if maps are in satellite mode, or not
	// based on https://mstickles.wordpress.com/2015/06/12/gmaps-urls-options/
	// the URL should be parsed more thoroughly if we wanted to do this properly, but this seems to work fine for our use case
	let type = "basic";
	if (RegExp("!3m.!1e3").test(url)) {
		type = "satellite";
	}
	
	// get only the location and zoom part from the address
	let addr = url.substr(url.indexOf("@") + 1);
	const slashPos = addr.indexOf("/");
	if (slashPos > 0) {
		addr = addr.substr(0, slashPos);
	}
	
	// extract the position and zoom fields from the address
	let lat, lon, zoom;
	const addrFields = addr.split(",");
	if (addrFields.length >= 2) {
		lat = addrFields[0];
		lon = addrFields[1];
		zoom = addrFields[2];
	}
	else {
		// the address has probably not loaded yet, and it's still just google.com/maps
		// just return Prague then
		lat = "50.0595854";
		lon = "14.3255392";
		zoom = "11z";
	}
	
	// zoom has a different format in satellite and normal view
	if (type == "basic") {
		zoom = zoom.substr(0, zoom.indexOf("z"));
		zoom = parseFloat(zoom);
		if (isNaN(zoom)) { // maybe we're in Street View and we can't parse zoom
			zoom = 15;
		}
	}
	else if (type == "satellite") {
		zoom = zoom.substr(0, zoom.indexOf("m"));
		zoom = parseFloat(zoom);
		zoom = 21 - Math.log2(zoom / 51);
	}
	
	// put it all together
	return {
		type: type,
		lat: lat,
		lon: lon,
		zoom: zoom,
	};
}
