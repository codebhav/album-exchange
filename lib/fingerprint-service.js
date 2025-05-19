import FingerprintJS from "@fingerprintjs/fingerprintjs";

let cachedFingerprint = null;

export async function getBrowserFingerprint() {
	if (cachedFingerprint) return cachedFingerprint;

	const storedFingerprint = localStorage.getItem("browser_fingerprint");
	if (storedFingerprint) {
		cachedFingerprint = storedFingerprint;
		return storedFingerprint;
	}

	try {
		const fp = await FingerprintJS.load();
		const result = await fp.get();

		const fingerprint = result.visitorId;

		localStorage.setItem("browser_fingerprint", fingerprint);
		cachedFingerprint = fingerprint;

		return fingerprint;
	} catch (error) {
		console.error("error generating fingerprint:", error);
		const fallbackId = Math.random().toString(36).substring(2, 15);
		localStorage.setItem("browser_fingerprint", fallbackId);
		cachedFingerprint = fallbackId;
		return fallbackId;
	}
}
