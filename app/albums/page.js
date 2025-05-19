"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { AlbumCard } from "@/components/CozyComponents";
import { PaginationControls } from "@/components/PaginationControls";
import { NavBar } from "@/components/NavBar";

const AlbumsGallery = () => {
	const [recommendations, setRecommendations] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(12);

	useEffect(() => {
		async function fetchRecommendations() {
			try {
				const response = await fetch("/api/get-recommendations");
				const data = await response.json();

				if (data.success) {
					setRecommendations(data.recommendations);
				}
			} catch (error) {
				console.error("Error fetching recommendations:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchRecommendations();
	}, []);

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = recommendations.slice(
		indexOfFirstItem,
		indexOfLastItem
	);
	const totalPages = Math.ceil(recommendations.length / itemsPerPage);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<main className="app-container" id="main-content">
			<NavBar currentPage="albums" />
			<div className="header">
				<h1>gallery</h1>
				<p>all album recommendations from the community</p>
			</div>

			<div style={{ marginBottom: "2rem" }}>
				<Link
					href="/"
					className="button"
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: "0.5rem",
					}}
				>
					<IoArrowBack /> back to home
				</Link>
			</div>

			{loading ? (
				<div className="center">loading recommendations...</div>
			) : recommendations.length === 0 ? (
				<div className="center">
					head to home and be the first to recommend an album :)
				</div>
			) : (
				<>
					<div className="recommendations-grid">
						{currentItems.map((rec) => (
							<div key={rec.id} className="recommendation-item">
								<AlbumCard
									albumImage={rec.albumImageUrl}
									albumName={rec.albumName}
									artistName={rec.albumArtist}
									recommendedBy={rec.nickname}
									albumUrl={rec.albumUrl}
									profileUrl={rec.spotifyProfileUrl}
								/>
							</div>
						))}
					</div>

					{totalPages > 1 && (
						<div className="pagination-container">
							<PaginationControls
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={handlePageChange}
							/>
						</div>
					)}
				</>
			)}
		</main>
	);
};

export default AlbumsGallery;
