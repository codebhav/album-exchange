import { NextResponse } from "next/server";
import { getAlbumDetails } from "@/lib/spotify-service";

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");

	if (!id) {
		return NextResponse.json(
			{ error: "Album ID is required" },
			{ status: 400 }
		);
	}

	try {
		const details = await getAlbumDetails(id);

		// cache-control header for browser caching
		return NextResponse.json(
			{
				name: details.name,
				artist: details.artist,
				imageUrl: details.imageUrl,
			},
			{
				headers: {
					"Cache-Control": "public, max-age=86400, s-maxage=86400",
				},
			}
		);
	} catch (error) {
		const isRateLimit =
			error.message?.includes("rate limit") || error.status === 429;

		console.error("Error fetching album details:", error);

		return NextResponse.json(
			{
				error: "Failed to fetch album details",
				message: error.message,
			},
			{
				status: isRateLimit ? 429 : 500,
				headers:
					isRateLimit && error.retryAfter
						? { "Retry-After": error.retryAfter }
						: {},
			}
		);
	}
}
