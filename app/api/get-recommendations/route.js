import { NextResponse } from "next/server";
import { getAllRecommendations } from "@/lib/firebase-service";

export async function GET() {
	try {
		const recommendations = await getAllRecommendations();

		return NextResponse.json({
			success: true,
			recommendations,
		});
	} catch (error) {
		console.error("error fetching recommendations:", error);
		return NextResponse.json(
			{ success: false, message: "failed to fetch recommendations" },
			{ status: 500 }
		);
	}
}
