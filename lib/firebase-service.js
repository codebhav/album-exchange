import admin from "firebase-admin";
import crypto from "crypto";
import {
	getNextMondayTimestamp,
	getRemainingTimeFormatted,
} from "./date-utils";

if (!admin.apps.length) {
	try {
		admin.initializeApp({
			credential: admin.credential.cert({
				projectId: process.env.FIREBASE_PROJECT_ID,
				clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
				privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(
					/\\n/g,
					"\n"
				),
			}),
		});
	} catch (error) {
		console.error("firebase admin initialization error:", error);
	}
}

const db = admin.firestore();
const submissionsRef = db.collection("submissions");

function generateSubmissionId(ip, fingerprint) {
	return crypto
		.createHash("sha256")
		.update(ip + (fingerprint || "") + (process.env.IP_SALT || ""))
		.digest("hex");
}

/**
 * check if an IP has submitted a recommendation within the current week
 * @param {string} ip - the user's IP address
 * @returns {Object} - status and remaining time info
 */
export async function checkSubmissionStatus(ip, fingerprint) {
	try {
		const submissionId = generateSubmissionId(ip, fingerprint);

		const submission = await submissionsRef
			.where("submissionId", "==", submissionId)
			.orderBy("timestamp", "desc")
			.limit(1)
			.get();

		if (submission.empty) {
			return { canSubmit: true };
		}

		const data = submission.docs[0].data();
		const nextMondayTimestamp = getNextMondayTimestamp();

		if (
			data.timestamp.toMillis() <
			nextMondayTimestamp - 7 * 24 * 60 * 60 * 1000
		) {
			return { canSubmit: true };
		}
		const remainingTime = getRemainingTimeFormatted(nextMondayTimestamp);
		return {
			canSubmit: false,
			remainingTime,
		};
	} catch (error) {
		console.error("error checking submission status:", error);
		// if there's an error, allow submission but log the issue
		return { canSubmit: true, error: error.message };
	}
}

/**
 * record a new album submission
 * @param {string} ip - the user's IP address
 * @param {Object} data - submission data
 */
export async function recordSubmission(ip, fingerprint, data) {
	try {
		const submissionId = generateSubmissionId(ip, fingerprint);

		await submissionsRef.add({
			submissionId,
			...data,
			timestamp: admin.firestore.FieldValue.serverTimestamp(),
		});
		return true;
	} catch (error) {
		console.error("error recording submission:", error);
		throw error;
	}
}

/**
 * get all album recommendations
 * @returns {Array} - array of recommendation objects
 */

export async function getAllRecommendations() {
	try {
		const snapshot = await submissionsRef
			.orderBy("timestamp", "desc")
			.get();

		if (snapshot.empty) {
			return [];
		}

		return snapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				id: doc.id,
				nickname: data.nickname,
				albumName: data.albumName,
				albumArtist: data.albumArtist,
				albumImageUrl: data.albumImageUrl,
				albumUrl: data.albumUrl,
				spotifyProfileUrl: data.spotifyProfileUrl,
				timestamp: data.timestamp
					? data.timestamp.toDate().toISOString()
					: null,
			};
		});
	} catch (error) {
		console.error("error getting recommendations:", error);
		throw error;
	}
}
