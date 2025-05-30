// save the currently selected options to extension storage
async function saveOptionsFromElements() {
	await saveOptionsToStorage({
		shownButtons: Object.fromEntries(Object.values(MAP_SERVICE).map((key) => [
			key,
			!!document.querySelector(`.show-button-checkbox[data-service="${key}"]`)?.checked,
		])),
		mapyComUseOutdoorForBasic: document.querySelector("#mapy-com-use-outdoor-for-basic")?.checked,
	});
}

// Restores select box and checkbox state using the preferences stored in chrome.storage.
async function loadOptionsToElements() {
	const options = await loadOptionsFromStorage();
	
	for (const key of Object.values(MAP_SERVICE)) {
		const checkbox = document.querySelector(`.show-button-checkbox[data-service="${key}"]`);
		if (checkbox) {
			checkbox.checked = !!options.shownButtons[key];
		}
	}
	const mapyComUseOutdoorForBasicCheckbox = document.querySelector("#mapy-com-use-outdoor-for-basic");
	if (mapyComUseOutdoorForBasicCheckbox) {
		mapyComUseOutdoorForBasicCheckbox.checked = !!options.mapyComUseOutdoorForBasic;
	}
}

document.addEventListener("DOMContentLoaded", () => loadOptionsToElements());
for (const inputElement of document.querySelectorAll("input")) {
	inputElement.addEventListener("change", () => saveOptionsFromElements());
}

// If browser is Opera, show the Opera Google maps warning
const operaWarning = document.getElementById("google-maps-opera-warning");
if (operaWarning != null) {
	if (/opera|opr/.test(navigator.userAgent)) {
		operaWarning.style.display = "block";
	} else {
		operaWarning.style.display = "none";
	}
}
