import { NextResponse } from "next/server";
import {
	extractAlbumIdFromUrl,
	createAlbumPlaylist,
	getAlbumDetails,
} from "@/lib/spotify-service";
import {
	checkSubmissionStatus,
	recordSubmission,
} from "@/lib/firebase-service";
import {
	getNextMondayTimestamp,
	getRemainingTimeFormatted,
} from "@/lib/date-utils";
import { cleanUrl, isValidSpotifyUrl, sanitizeInput } from "@/lib/url-utils";

export async function POST(request) {
	try {
		const ip =
			request.headers.get("x-real-ip") ||
			request.headers.get("x-forwarded-for")?.split(",")[0] ||
			"127.0.0.1";
		const fingerprint = request.headers.get("x-browser-fingerprint");
		const status = await checkSubmissionStatus(ip, fingerprint);

		if (!status.canSubmit) {
			return NextResponse.json(
				{
					success: false,
					message: `you can submit again in ${status.remainingTime}`,
					remainingTime: status.remainingTime,
				},
				{ status: 429 }
			);
		}

		const body = await request.json();
		const { isAnonymous, nickname, spotifyProfileUrl, albumUrl } = body;

		if (!albumUrl) {
			return NextResponse.json(
				{
					success: false,
					message: "album URL is required",
				},
				{ status: 400 }
			);
		}

		const sanitizedNickname = sanitizeInput(nickname);
		if (
			!sanitizedNickname ||
			sanitizedNickname.length < 2 ||
			sanitizedNickname.length > 30
		) {
			return NextResponse.json(
				{
					success: false,
					message: "nickname must be between 2-30 characters",
				},
				{ status: 400 }
			);
		}

		if (!isValidSpotifyUrl(albumUrl, "album")) {
			return NextResponse.json(
				{
					success: false,
					message: "invalid spotify album URL",
				},
				{ status: 400 }
			);
		}

		if (!isAnonymous && !spotifyProfileUrl) {
			return NextResponse.json(
				{
					success: false,
					message:
						"spotify profile URL is required when not submitting anonymously",
				},
				{ status: 400 }
			);
		}

		if (!isAnonymous && !isValidSpotifyUrl(spotifyProfileUrl, "user")) {
			return NextResponse.json(
				{
					success: false,
					message: "invalid spotify profile URL",
				},
				{ status: 400 }
			);
		}

		const cleanedAlbumUrl = cleanUrl(albumUrl);
		const cleanedProfileUrl = isAnonymous
			? null
			: cleanUrl(spotifyProfileUrl);

		const albumId = extractAlbumIdFromUrl(cleanedAlbumUrl);
		if (!albumId) {
			return NextResponse.json(
				{
					success: false,
					message: "invalid album URL",
				},
				{ status: 400 }
			);
		}

		const albumDetails = await getAlbumDetails(albumId);

		const playlistNickname = sanitizedNickname;
		const displayName = nickname;

		const playlist = await createAlbumPlaylist(
			albumId,
			playlistNickname,
			albumDetails.name
		);

		await recordSubmission(ip, fingerprint, {
			isAnonymous,
			nickname: displayName,
			spotifyProfileUrl: isAnonymous ? null : cleanedProfileUrl,
			albumId,
			albumUrl: cleanedAlbumUrl,
			albumName: albumDetails.name,
			albumArtist: albumDetails.artist,
			albumImageUrl: albumDetails.imageUrl,
			playlistId: playlist.id,
			playlistUrl: playlist.external_urls.spotify,
		});

		const nextMondayTimestamp = getNextMondayTimestamp();
		const remainingTime = getRemainingTimeFormatted(nextMondayTimestamp);

		return NextResponse.json({
			success: true,
			message: "album recommendation submitted successfully",
			playlist: {
				id: playlist.id,
				url: playlist.external_urls.spotify,
			},
			remainingTime,
		});
	} catch (error) {
		console.error("error submitting album:", error);
		return NextResponse.json(
			{
				success: false,
				message: "failed to submit album recommendation",
			},
			{ status: 500 }
		);
	}
}
