function onMobileDeviceDetected_5357c889600e5(isMobileDevice) {
	if (isMobileDevice && typeof getCookie_5357c889600e5('nomobile') == 'undefined') {
		var wl = window.location;
		var s = wl.hostname.split('.'); s[0] = 'm';
		var url = wl.protocol + '//' + s.join('.') + (wl.port ? ':' + wl.port : '') + wl.pathname + wl.search + wl.hash;
		window.location.replace(url);
	}
}

function getCookie_5357c889600e5(name) {
	var documentCookies = document.cookie.split(';');
	if (!documentCookies.length) {
		return;
	}
	for (var i = 0; i < documentCookies.length; i++) {
		var currentCookie = documentCookies[i].split('=');
		if (currentCookie[0].replace(/^\s+|\s+$/g, '') != name) {
			continue;
		}
		var cookieValue = currentCookie.length > 1 ? unescape(currentCookie[1]) : '';
		return cookieValue;
	}
}

if (typeof onMobileDeviceDetected_5357c889600e5 == 'function') {
	try {
		onMobileDeviceDetected_5357c889600e5(false);
	} catch (e) {
		if (typeof console == 'object') {
			console.error(e);
		}
	}
}