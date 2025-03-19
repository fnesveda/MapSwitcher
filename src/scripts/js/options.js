const defaultOptions = {
	optionsVersion: "2.0",
	shownButtons: {
		[MAP_SERVICE.GOOGLE_MAPS]: true,
		[MAP_SERVICE.MAPY_CZ]: true,
		[MAP_SERVICE.OPEN_STREET_MAP]: false,
	},
};

// Saves options to chrome.storage.sync, returns a promise to maybe let the user know when it's done
async function saveOptionsToStorage(options) {
	await chrome.storage.sync.set({
		options: Object.assign({}, structuredClone(defaultOptions), options),
	});
}

// Loads options from chrome.storage.sync, if unavailable, returns default options
async function loadOptionsFromStorage() {
	const retrievedStorage = await chrome.storage.sync.get({ options: defaultOptions });
	if (!retrievedStorage?.options) {
		await chrome.storage.sync.set({ options: defaultOptions });
		return structuredClone(values.defaultOptions);
	}
	if (retrievedStorage.options.optionsVersion === '1.0') {
		// migrate from version 1.0 to 2.0
		const migratedOptions = {
			optionsVersion: "2.0",
			shownButtons: {
				[MAP_SERVICE.GOOGLE_MAPS]: retrievedStorage.options.showGMapsButton,
				[MAP_SERVICE.MAPY_CZ]: retrievedStorage.options.showMapyczButton,
				[MAP_SERVICE.OPEN_STREET_MAP]: false,
			},
		};
		await chrome.storage.sync.set({ options: migratedOptions });
		return migratedOptions;
	}
	
	return retrievedStorage.options;
}
