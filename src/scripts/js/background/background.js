chrome.runtime.onMessage.addListener(function(request, sender, callback) {
	if (request.command == "getGeoportalURL") {
		geoportalToURL(request.location, callback);
	}
	else if (request.command == "openTab") {
		loadOptionsFromStorage().then(options => chrome.tabs.create({
			url: request.url,
			index: sender.tab.index + 1,
			openerTabId: sender.tab.id,
			active: options.activateNewTab,
		}));
	}
	return true;
});
