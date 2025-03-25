let loadedOptions = structuredClone(defaultOptions);

const converters = {};
function registerConverter(service, ConverterClass) {
	converters[service] = new ConverterClass(loadedOptions);
}

loadOptionsFromStorage().then((options) => {
	loadedOptions = options;
	for (const converter of Object.values(converters)) {
		converter.updateExtensionOptions(loadedOptions);
	}
});

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

class UrlConverter {
	constructor(extensionOptions) {
		this.extensionOptions = extensionOptions;
	}
	
	updateExtensionOptions(extensionOptions) {
		this.extensionOptions = extensionOptions;
	}
	
	universalToUrl(universal) {
		throw new Error("universalToUrl not implemented");
	}
	
	urlToUniversal(url) {
		throw new Error("urlToUniversal not implemented");
	}
}