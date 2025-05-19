import { SpotifyApi } from "@spotify/web-api-ts-sdk";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const albumDetailsCache = new Map();
const ALBUM_CACHE_DURATION = 24 * 60 * 60 * 1000;

let spotifyApi = null;

let playbackCache = {
	data: null,
	timestamp: 0,
};

const CACHE_DURATION = 30 * 1000;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

/**
 * get a valid access token, refreshing if necessary
 */
export async function getAccessToken() {
	const response = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization:
				"Basic " +
				Buffer.from(client_id + ":" + client_secret).toString("base64"),
		},
		body: new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: refresh_token,
		}),
	});

	const data = await response.json();
	return data.access_token;
}

/**
 * get or initialize spotify API SDK
 */
export async function getSpotifyApi() {
	if (spotifyApi) return spotifyApi;

	const accessToken = await getAccessToken();

	spotifyApi = SpotifyApi.withAccessToken(client_id, {
		access_token: accessToken,
		expires_in: 3600,
		refresh_token: refresh_token,
		token_type: "Bearer",
	});

	return spotifyApi;
}

/**
 * get currently playing or recently played track with rate limit handling
 */
export async function getCurrentPlaybackStatus() {
	const now = Date.now();
	if (playbackCache.data && now - playbackCache.timestamp < CACHE_DURATION) {
		return playbackCache.data;
	}

	try {
		const api = await getSpotifyApi();

		const currentTrack = await fetchWithRetry(() =>
			api.player.getCurrentlyPlayingTrack()
		);

		if (currentTrack && currentTrack.item) {
			const result = {
				isPlaying: currentTrack.is_playing,
				track: formatTrackData(currentTrack.item),
			};

			playbackCache = {
				data: result,
				timestamp: now,
			};

			return result;
		}

		try {
			const accessToken = await getAccessToken();

			const response = await fetchWithRetry(() =>
				fetch(
					"https://api.spotify.com/v1/me/player/recently-played?limit=1",
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				)
			);

			if (!response.ok) {
				if (response.status === 429) {
					const retryAfter =
						response.headers.get("Retry-After") || "60";
					console.warn(
						`rate limited by Spotify. retry after ${retryAfter} seconds`
					);
					throw new Error(
						`rate limit exceeded. try again after ${retryAfter} seconds`
					);
				}
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			if (data && data.items && data.items.length > 0) {
				const result = {
					isPlaying: false,
					track: formatTrackData(data.items[0].track),
				};

				playbackCache = {
					data: result,
					timestamp: now,
				};

				return result;
			}
		} catch (recentError) {
			console.error("error fetching recent tracks:", recentError);
			return playbackCache.data || null;
		}
		return playbackCache.data || null;
	} catch (error) {
		console.error("error fetching playback status:", error);
		return playbackCache.data || null;
	}
}

/**
 * helper function to retry a fetch operation with exponential backoff
 * @param {Function} fetchFn - function that returns a Promise
 * @param {number} maxRetries - maximum number of retries
 * @returns {Promise} - result of the fetch operation
 */
async function fetchWithRetry(fetchFn, maxRetries = MAX_RETRIES) {
	let lastError;
	let retryDelay = INITIAL_RETRY_DELAY;

	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			return await fetchFn();
		} catch (error) {
			lastError = error;

			if (
				error.status === 429 ||
				(error.message && error.message.includes("rate limit"))
			) {
				console.warn(
					`rate limit hit, retry attempt ${attempt + 1}/${
						maxRetries + 1
					}`
				);

				const retryAfterSec =
					error.headers?.get("Retry-After") ||
					(error.retryAfter ? parseInt(error.retryAfter) : null);

				const waitTime = retryAfterSec
					? retryAfterSec * 1000
					: retryDelay;

				console.log(`waiting ${waitTime}ms before retry...`);
				await new Promise((resolve) => setTimeout(resolve, waitTime));

				// exponential backoff
				retryDelay *= 2;
			} else {
				// dont retry for other errors
				break;
			}
		}
	}

	// last error if we out of retires
	throw lastError;
}

/**
 * create a playlist for an album recommendation
 */
export async function createAlbumPlaylist(albumId, nickname, albumName) {
	const api = await getSpotifyApi();

	try {
		const me = await api.currentUser.profile();

		const playlistName = `${nickname}-${albumName}`.substring(0, 100);
		const playlist = await api.playlists.createPlaylist(me.id, {
			name: playlistName,
			description: `album recommendation from ${nickname} via bhav.fun album exchange`,
			public: false,
		});

		const albumTracks = await api.albums.tracks(albumId);

		if (albumTracks.items.length > 0) {
			const trackUris = albumTracks.items.map((track) => track.uri);
			await api.playlists.addItemsToPlaylist(playlist.id, trackUris);
		}

		return playlist;
	} catch (error) {
		console.error("error creating album playlist:", error);
		throw error;
	}
}

/**
 * format track data for consistent use in the UI
 */
function formatTrackData(track) {
	return {
		id: track.id,
		name: track.name,
		artist: track.artists.map((artist) => artist.name).join(", "),
		album: track.album.name,
		albumImageUrl: track.album.images[0]?.url,
		albumId: track.album.id,
		uri: track.uri,
	};
}

/**
 * extract album ID from spotify URL
 */
export function extractAlbumIdFromUrl(url) {
	try {
		if (url.includes("spotify.com/album/")) {
			const parts = url.split("album/");
			return parts[1].split("?")[0].split("/")[0];
		}

		if (url.includes("spotify:album:")) {
			return url.split("spotify:album:")[1];
		}

		return null;
	} catch {
		return null;
	}
}

/**
 * get details for a specific album with caching
 */
export async function getAlbumDetails(albumId) {
	const now = Date.now();
	const cachedAlbum = albumDetailsCache.get(albumId);

	if (cachedAlbum && now - cachedAlbum.timestamp < ALBUM_CACHE_DURATION) {
		console.log(`Using cached album details for: ${albumId}`);
		return cachedAlbum.data;
	}

	const api = await getSpotifyApi();

	try {
		const album = await fetchWithRetry(() => api.albums.get(albumId));

		const albumData = {
			name: album.name,
			artist: album.artists.map((artist) => artist.name).join(", "),
			imageUrl: album.images[0]?.url,
		};

		albumDetailsCache.set(albumId, {
			data: albumData,
			timestamp: now,
		});

		return albumData;
	} catch (error) {
		console.error("Error fetching album details:", error);
		if (cachedAlbum) {
			console.log(`Using expired cache for album: ${albumId}`);
			return cachedAlbum.data;
		}
		throw error;
	}
}
