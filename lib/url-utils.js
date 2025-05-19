/**
 * remove tracking parameters from URLs
 * @param {string} url - URL to clean
 * @returns {string} - cleaned URL
 */
export function cleanUrl(url) {
	if (!url) return url;

	try {
		const parsedUrl = new URL(url);

		return `${parsedUrl.origin}${parsedUrl.pathname}`;
	} catch {
		return url;
	}
}

/**
 * validate Spotify URL
 * @param {string} url - URL to validate
 * @returns {boolean} - whether URL is valid
 */
export function isValidSpotifyUrl(url, type) {
	if (!url) return false;

	try {
		const parsedUrl = new URL(url);

		if (!parsedUrl.hostname.includes("spotify.com")) {
			return false;
		}

		if (type === "album") {
			return parsedUrl.pathname.includes("/album/");
		} else if (type === "user") {
			return parsedUrl.pathname.includes("/user/");
		}

		return true;
	} catch {
		return false;
	}
}

/**
 * sanitize a string to prevent script injection
 * @param {string} input - string to sanitize
 * @returns {string} - sanitized string
 */
export function sanitizeInput(input) {
	if (!input) return "";

	return input
		.replace(/<\/?[^>]+(>|$)/g, "") // remove NASTY HTML tags
		.replace(/[<>"'&]/g, ""); // remove sus characters
}
