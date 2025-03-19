registerConverter(MAP_SERVICE.OPEN_STREET_MAP, {
	universalToUrl: function(universal) {
		const lon = universal.lon;
		const lat = universal.lat;
		const zoom = Math.round(universal.zoom);
		
		return `https://www.openstreetmap.org/#map=${zoom}/${lat}/${lon}`;
	},
	urlToUniversal: function(url) {
		// get only the location and zoom part from the address
		const addr = url.substr(url.indexOf("#map=") + 5);
		
		// extract the position and zoom fields from the address
		let lat = 0;
		let lon = 0;
		let zoom = 1;
		
		// parse the address parameters
		const addrFields = addr.split("/");
		if (addrFields.length >= 3) {
			zoom = parseFloat(addrFields[0]);
			lat = parseFloat(addrFields[1]);
			lon = parseFloat(addrFields[2]);
		}
		
		return {
			type: "basic",
			lat: lat,
			lon: lon,
			zoom: zoom,
		};
	},
});
