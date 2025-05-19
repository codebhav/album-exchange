import { useState, useEffect } from "react";
import { AlbumCard } from "./CozyComponents";

export function DynamicAlbumCard({ spotifyUrl }) {
	const [albumDetails, setAlbumDetails] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [imageError, setImageError] = useState(false);
	const fallbackImageUrl = "/images/album-placeholder.jpg";

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		async function fetchAlbumDetails() {
			if (!spotifyUrl) return;

			try {
				setLoading(true);
				const albumId = extractAlbumIdFromUrl(spotifyUrl);

				if (!albumId) {
					throw new Error("invalid album URL");
				}

				const cacheKey = `album-${albumId}`;
				let data;

				const cached = localStorage.getItem(cacheKey);
				if (cached) {
					const cachedData = JSON.parse(cached);
					const now = Date.now();

					if (now - cachedData.timestamp < 24 * 60 * 60 * 1000) {
						// console.log("using locally cached album data");
						data = cachedData.data;

						if (isMounted) {
							setAlbumDetails({
								albumImage: data.imageUrl,
								albumName: data.name,
								artistName: data.artist,
							});
							setLoading(false);
						}
						return;
					}
				}

				const response = await fetch(
					`/api/album-details?id=${albumId}`,
					{ signal: controller.signal }
				);

				if (!response.ok) {
					throw new Error(
						`failed to fetch album details: ${response.status}`
					);
				}

				data = await response.json();

				localStorage.setItem(
					cacheKey,
					JSON.stringify({
						data,
						timestamp: Date.now(),
					})
				);

				if (isMounted) {
					setAlbumDetails({
						albumImage: data.imageUrl,
						albumName: data.name,
						artistName: data.artist,
					});
				}
			} catch (err) {
				// console.error("error fetching album details:", err);
				if (isMounted) {
					setError(err.message);
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		fetchAlbumDetails();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, [spotifyUrl]);

	function extractAlbumIdFromUrl(url) {
		try {
			if (url.includes("spotify.com/album/")) {
				const parts = url.split("album/");
				return parts[1].split("?")[0].split("/")[0];
			}
			if (url.includes("spotify:album:")) {
				return url.split("spotify:album:")[1];
			}
			return null;
		} catch (error) {
			return null;
		}
	}

	if (loading) {
		return <div className="album-card center">loading album...</div>;
	}

	if (error) {
		return <div className="album-card center">failed to load album</div>;
	}

	if (!albumDetails) {
		return (
			<div className="album-card center">no album details available</div>
		);
	}

	return (
		<AlbumCard
			albumImage={imageError ? fallbackImageUrl : albumDetails.albumImage}
			albumName={albumDetails.albumName}
			artistName={albumDetails.artistName}
			albumUrl={spotifyUrl}
			onImageError={() => setImageError(true)}
		/>
	);
}
