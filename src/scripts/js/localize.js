function localizeElement(elem) {
	elem.innerText = chrome.i18n.getMessage(elem.getAttribute("i18n-id"));
}

function localizePage() {
	document.querySelectorAll("[i18n-id]").forEach(elem => localizeElement(elem));
}

window.addEventListener("load", localizePage);
