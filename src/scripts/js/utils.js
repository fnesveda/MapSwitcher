function runOnPageLoad(callback) {
	// normally, we shouldn't need to wait for window.onload, as content scripts should be injected on document_idle by default
	// but something changed in Firefox 67+ and the content scripts are sometimes executed earlier
	if (document.readyState === 'complete') {
		callback();
	} else {
		window.addEventListener('load', callback);
	}
};

function waitForElement(selector, timeout) {
	return new Promise(resolve => {
		if (document.querySelector(selector)) {
			return resolve(document.querySelector(selector));
		}

		const observer = new MutationObserver(() => {
			let element = document.querySelector(selector);
			if (element) {
				observer.disconnect();
				return resolve(element);
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});

		if (document.querySelector(selector)) {
			observer.disconnect();
			return resolve(document.querySelector(selector));
		}

		if (timeout) {
			setTimeout(() => {
				observer.disconnect();
				resolve(null);
			}, timeout);
		}
	});
}

const getMapServiceName = (service) => {
	return chrome.i18n.getMessage(service);
}

const detectCurrentMapService = () => {
	const hostname = location.hostname;
	for (const [service, hostnameFeature] of Object.entries(MAP_SERVICE_HOSTNAME_FEATURE)) {
		if (hostname.includes(hostnameFeature)) {
			return service;
		}
	}
	throw new Error(`Unknown map service for hostname: ${hostname}`);
};