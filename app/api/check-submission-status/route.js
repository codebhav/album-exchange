import { NextResponse } from "next/server";
import { checkSubmissionStatus } from "@/lib/firebase-service";

export async function GET(request) {
	try {
		const fingerprint = request.headers.get("x-browser-fingerprint");
		const ip =
			request.headers.get("x-real-ip") ||
			request.headers.get("x-forwarded-for")?.split(",")[0] ||
			"127.0.0.1";

		const status = await checkSubmissionStatus(ip, fingerprint);

		return NextResponse.json(status);
	} catch (error) {
		console.error("Error checking submission status:", error);
		return NextResponse.json(
			{ canSubmit: true, error: "Error checking status" },
			{ status: 500 }
		);
	}
}
