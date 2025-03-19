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

		const observer = new MutationObserver(mutations => {
			if (mutations.length === 0) return;
			for (const mutation of mutations) {
				if (mutation.addedNodes?.length) {
					for (const node of mutation.addedNodes) {
						if (node.nodeType === 1 && node.matches(selector)) {
							observer.disconnect();
							return resolve(node);
						}
					}
				}
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
		
		if (timeout) {
			setTimeout(() => {
				observer.disconnect();
				resolve(null);
			}, timeout);
		}
	});
}