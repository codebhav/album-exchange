import { NextResponse } from "next/server";
import { getCurrentPlaybackStatus } from "@/lib/spotify-service";

export async function GET() {
	try {
		const playback = await getCurrentPlaybackStatus();

		if (!playback) {
			return NextResponse.json(
				{
					success: false,
					message: "no playback data available at the moment",
					error: "could not retrieve playback data from spotify",
				},
				{ status: 200 }
			);
		}

		return NextResponse.json({
			success: true,
			playback,
		});
	} catch (error) {
		const isRateLimit =
			error.message?.includes("rate limit") || error.status === 429;

		console.error("error getting playback:", error);

		return NextResponse.json(
			{
				success: false,
				message: isRateLimit
					? "spotify API rate limit exceeded. try again later."
					: "failed to fetch playback status",
				error: error.message,
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
