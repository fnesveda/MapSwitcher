function localizeElement(elem) {
	elem.innerText = chrome.i18n.getMessage(elem.getAttribute("i18n-id"));
}

function localizePage() {
	for (const element of document.querySelectorAll("[i18n-id]")) {
		localizeElement(element);
	}
}

window.addEventListener("load", localizePage);
