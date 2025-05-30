const defaultOptions = {
	optionsVersion: "3.0",
	shownButtons: {
		[MAP_SERVICE.GOOGLE_MAPS]: true,
		[MAP_SERVICE.MAPY_COM]: true,
		[MAP_SERVICE.OPEN_STREET_MAP]: false,
	},
	mapyComUseOutdoorForBasic: true,
};

// Saves options to chrome.storage.sync, returns a promise to maybe let the user know when it's done
async function saveOptionsToStorage(options) {
	await chrome.storage.sync.set({
		options: Object.assign({}, structuredClone(defaultOptions), options),
	});
}

async function migrateOptionsToLatestVersion(optionsFromStorage) {
	// Check if the options are already at the latest version
	let migratedOptions = structuredClone(optionsFromStorage);
	
	if (!migratedOptions.optionsVersion || migratedOptions.optionsVersion === '1.0') {
		// migrate from version 1.0 to 2.0
		migratedOptions = {
			optionsVersion: '2.0',
			shownButtons: {
				[MAP_SERVICE.GOOGLE_MAPS]: migratedOptions.showGMapsButton,
				[OLD_MAP_SERVICE.MAPY_CZ]: migratedOptions.showMapyczButton,
				[MAP_SERVICE.OPEN_STREET_MAP]: false,
			},
			mapyCzUseOutdoorForBasic: migratedOptions.mapyCzUseOutdoorForBasic || true,
		};
	}
	
	if (migratedOptions.optionsVersion === '2.0') {
		migratedOptions = {
			optionsVersion: '3.0',
			shownButtons: {
				[MAP_SERVICE.GOOGLE_MAPS]: migratedOptions.shownButtons[MAP_SERVICE.GOOGLE_MAPS],
				[MAP_SERVICE.MAPY_COM]: migratedOptions.shownButtons[OLD_MAP_SERVICE.MAPY_CZ],
				[MAP_SERVICE.OPEN_STREET_MAP]: migratedOptions.shownButtons[MAP_SERVICE.OPEN_STREET_MAP],
			},
			mapyComUseOutdoorForBasic: migratedOptions.mapyCzUseOutdoorForBasic || true,
		};
	}
	
	// Save the migrated options back to storage
	await saveOptionsToStorage(migratedOptions);
	
	return migratedOptions;
}

// Loads options from chrome.storage.sync, if unavailable, returns default options
async function loadOptionsFromStorage() {
	const retrievedStorage = await chrome.storage.sync.get({ options: defaultOptions });
	
	const resolvedOptions = await migrateOptionsToLatestVersion(retrievedStorage?.options ?? defaultOptions);
	
	return resolvedOptions;
}
