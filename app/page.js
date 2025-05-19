"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { IoMusicalNotes, IoHeart, IoHeadset } from "react-icons/io5";
import {
	CozyButton,
	CozyInput,
	CuteToggle,
	NowPlaying,
} from "@/components/CozyComponents";
import { DynamicAlbumCard } from "@/components/DynamicAlbumCard";
import { FAQ } from "@/components/FAQ";
import { NavBar } from "@/components/NavBar";
import { getBrowserFingerprint } from "@/lib/fingerprint-service";

const validateNickname = (value) => {
	const regex = /^[a-zA-Z0-9 ]{2,30}$/;
	return value && regex.test(value);
};

const validateSpotifyUrl = (url) => {
	return (
		url &&
		(url.startsWith("https://open.spotify.com/") ||
			url.startsWith("spotify:"))
	);
};

export default function Home() {
	const [isAnonymous, setIsAnonymous] = useState(false);
	const [nickname, setNickname] = useState("");
	const [spotifyProfileUrl, setSpotifyProfileUrl] = useState("");
	const [albumUrl, setAlbumUrl] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [canSubmit, setCanSubmit] = useState(true);
	const [remainingTime, setRemainingTime] = useState("");
	const [nowPlaying, setNowPlaying] = useState(null);
	const [weeklyPick] = useState({
		spotifyUrl:
			"https://open.spotify.com/album/1hmlhl74JfLyUqmqtCwvFb?si=6SkYRwhqQpmoMkOhkKsyyg",
	});

	useEffect(() => {
		async function checkSubmissionStatus() {
			try {
				const fingerprint = await getBrowserFingerprint();

				const response = await fetch("/api/check-submission-status", {
					headers: {
						"x-browser-fingerprint": fingerprint,
					},
				});
				const data = await response.json();

				setCanSubmit(data.canSubmit);
				if (!data.canSubmit) {
					setRemainingTime(data.remainingTime);
				}
			} catch (error) {
				console.error("error checking submission status:", error);
			}
		}

		checkSubmissionStatus();
	}, []);

	useEffect(() => {
		async function fetchPlaybackStatus() {
			try {
				const response = await fetch("/api/current-playback");

				if (!response.ok) {
					console.error(
						`error fetching playback: ${response.status}`
					);
					return;
				}

				const data = await response.json();

				if (data.success && data.playback) {
					setNowPlaying(data.playback);
				} else if (data.error) {
					console.warn(`playback status issue: ${data.error}`);
				}
			} catch (error) {
				console.error("error fetching playback status:", error);
			}
		}

		fetchPlaybackStatus();

		const refreshInterval = nowPlaying?.isPlaying ? 15000 : 60000;
		const interval = setInterval(fetchPlaybackStatus, refreshInterval);

		return () => clearInterval(interval);
	}, [nowPlaying?.isPlaying]); // re-run when playing status changes to adjust interval

	const handleSubmit = async (e) => {
		e.preventDefault();
		const fingerprint = await getBrowserFingerprint();

		if (!canSubmit) {
			toast.error(`you can submit again in ${remainingTime}`);
			return;
		}

		if (!validateNickname(nickname)) {
			toast.error(
				"please enter a valid nickname (2-30 characters, letters, numbers and spaces only)"
			);
			return;
		}

		if (!validateSpotifyUrl(albumUrl)) {
			toast.error("please enter a valid spotify album URL");
			return;
		}

		if (!isAnonymous && !validateSpotifyUrl(spotifyProfileUrl)) {
			toast.error("please enter a valid Spotify profile URL");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/submit-album", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-browser-fingerprint": fingerprint,
				},
				body: JSON.stringify({
					isAnonymous,
					nickname: nickname.trim(),
					spotifyProfileUrl: isAnonymous ? null : spotifyProfileUrl,
					albumUrl,
				}),
			});

			const data = await response.json();

			if (data.success) {
				toast.success(
					"album submitted! thanks for the recommendation 💖"
				);
				setNickname("");
				setSpotifyProfileUrl("");
				setAlbumUrl("");
				setIsAnonymous(false);
				setCanSubmit(false);
				setRemainingTime(data.remainingTime);
			} else {
				toast.error(data.message || "something went wrong :(");
			}
		} catch (error) {
			toast.error("failed to submit album. please try again.");
			console.error("error submitting album:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main className="app-container" id="main-content">
			<Toaster
				position="top-center"
				toastOptions={{
					style: {
						background: "#fff",
						color: "#5e4c44",
						borderRadius: "12px",
						padding: "16px",
						boxShadow: "0 4px 12px rgba(210, 175, 150, 0.15)",
						border: "2px solid #f8e2cf",
					},
					success: {
						iconTheme: {
							primary: "#e2a07e",
							secondary: "#fff",
						},
					},
					error: {
						iconTheme: {
							primary: "#c97c5d",
							secondary: "#fff",
						},
					},
				}}
			/>
			<NavBar currentPage="home" />
			<div className="header">
				<h1>album exchange</h1>
				<p>share the music you love, discover something new ✨</p>
			</div>

			<div className="grid">
				<div>
					<h2 className="section-title">
						<IoHeadset className="green-icon" />
						<span>my spotify status</span>
					</h2>

					{nowPlaying ? (
						<NowPlaying
							track={nowPlaying.track}
							isPlaying={nowPlaying.isPlaying}
						/>
					) : (
						<div className="card center">
							<p>not currently listening</p>
						</div>
					)}
				</div>

				<div>
					<h2 className="section-title">
						<IoHeart className="terracotta-icon" />
						<span>my weekly pick</span>
					</h2>

					<DynamicAlbumCard spotifyUrl={weeklyPick.spotifyUrl} />
				</div>
			</div>

			<div className="form-container">
				<h2 className="section-title">
					<IoMusicalNotes className="terracotta-icon" />
					<span>recommend an album</span>
				</h2>

				{!canSubmit ? (
					<div className="submission-message">
						<p>you&apos;ve already submitted this week :&apos;)</p>
						<p>you can submit again in {remainingTime}</p>
					</div>
				) : (
					<form onSubmit={handleSubmit}>
						<CuteToggle
							label="don't share my spotify profile (submit anonymously)"
							checked={isAnonymous}
							onChange={() => setIsAnonymous(!isAnonymous)}
							id="anonymous-toggle"
						/>

						<CozyInput
							label={
								<div className="label-with-tooltip">
									your nickname
									<span
										className="tooltip-trigger"
										data-tooltip="used to create a playlist on my account as 'nickname-album title'"
										aria-hidden="true"
									>
										?
									</span>
								</div>
							}
							placeholder="what should i call you?"
							value={nickname}
							onChange={(e) => setNickname(e.target.value)}
							id="nickname-input"
							required={true}
							ariaDescribedBy="nickname-tooltip"
						/>
						<div id="nickname-tooltip" className="sr-only">
							used to create a playlist on my account as
							&apos;nickname-album title&apos;
						</div>

						{!isAnonymous && (
							<CozyInput
								label={
									<div className="label-with-tooltip">
										your spotify profile
										<span
											className="tooltip-trigger"
											data-tooltip="if i like your recommendations, i'd like to follow your account :)"
											aria-hidden="true"
										>
											?
										</span>
									</div>
								}
								placeholder="https://open.spotify.com/user/0rs4afffl5o4avb4ilxbot2ty"
								value={spotifyProfileUrl}
								onChange={(e) =>
									setSpotifyProfileUrl(e.target.value)
								}
								id="profile-input"
								required={!isAnonymous}
								ariaDescribedBy="profile-tooltip"
							/>
						)}
						<div id="profile-tooltip" className="sr-only">
							if i like your recommendations, i&apos;d like to follow
							your account :)
						</div>

						<CozyInput
							label="Album Link"
							placeholder="https://open.spotify.com/album/..."
							value={albumUrl}
							onChange={(e) => setAlbumUrl(e.target.value)}
							id="album-input"
							required={true}
						/>

						<div className="center" style={{ marginTop: "2rem" }}>
							<CozyButton
								type="submit"
								disabled={isSubmitting}
								ariaLabel={
									isSubmitting
										? "submitting album recommendation..."
										: "share album recommendation"
								}
							>
								{isSubmitting ? "submitting..." : "share album"}
							</CozyButton>
						</div>
					</form>
				)}
			</div>
			<FAQ />

			<div className="footer">
				<p>
					source code available{" "}
					<a
						href="https://github.com/codebhav/album-exchange"
						className="text-link"
						target="_blank"
					>
						here
					</a>
					, released under the MIT license • made with 🎶 & ❤️ by{" "}
					<a
						href="https://whybhav.in/"
						className="text-link"
						target="_blank"
					>
						bhav
					</a>
				</p>
			</div>
		</main>
	);
}
