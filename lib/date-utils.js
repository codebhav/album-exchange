import { formatDistance } from "date-fns";

/**
 * get timestamp for the next monday at 00:00 UTC
 * @returns {number} - timestamp in milliseconds
 */
export function getNextMondayTimestamp() {
	const now = new Date();
	const dayOfWeek = now.getUTCDay(); // sunday is 0

	const daysUntilNextMonday = dayOfWeek === 1 ? 7 : (8 - dayOfWeek) % 7;

	const nextMonday = new Date(
		Date.UTC(
			now.getUTCFullYear(),
			now.getUTCMonth(),
			now.getUTCDate() + daysUntilNextMonday,
			0,
			0,
			0,
			0
		)
	);

	return nextMonday.getTime();
}

/**
 * format the remaining time until next monday in a human-readable way
 * @param {number} nextMondayTimestamp - timestamp for next monday
 * @returns {string} - formatted time string
 */
export function getRemainingTimeFormatted(nextMondayTimestamp) {
	const now = new Date();
	return formatDistance(nextMondayTimestamp, now, { addSuffix: false });
}
