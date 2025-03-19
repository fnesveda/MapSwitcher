const defaultOptions = {
	optionsVersion: "1.0",
	showMapyczButton: true,
	showGMapsButton: true,
};

// Saves options to chrome.storage.sync, returns a promise to maybe let the user know when it's done
function saveOptionsToStorage(options) {
	return new Promise(function(resolve, reject) {
		chrome.storage.sync.set({
			options: Object.assign({}, defaultOptions, options),
		}, resolve);
	});
}

// Loads options from chrome.storage.sync, if unavailable, returns default options
function loadOptionsFromStorage() {
	return new Promise(function(resolve, reject) {
		chrome.storage.sync.get({
			options: defaultOptions,
		}, function(storageItems) {
			resolve(typeof storageItems != "undefined" ? storageItems.options : defaultOptions);
		});
	});
}
