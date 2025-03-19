const converters = {};
function registerConverter(service, converter) {
	converters[service] = converter;
}

function getConverterForCurrentService() {
	const service = detectCurrentMapService();
	if (!service) throw new Error("No map service detected");
	return converters[service] ?? null;
}

function getMapInfo() {
	const service = detectCurrentMapService();
	if (!service) throw new Error("No map service detected");
	
	const converter = converters[service];
	if (!converter) throw new Error(`No converter registered for ${service}`);
	
	return converter.urlToUniversal(location.href);
}

function getDestinationUrl(destination, mapInfo) {
	const converter = converters[destination];
	if (!converter) return "";
	return converter.universalToUrl(mapInfo);
}
