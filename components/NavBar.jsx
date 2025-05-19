import Link from "next/link";

export const NavBar = ({ currentPage }) => {
	return (
		<div className="navbar">
			<Link
				href="/"
				className={`nav-link ${currentPage === "home" ? "active" : ""}`}
			>
				home
			</Link>
			<Link
				href="/albums"
				className={`nav-link ${
					currentPage === "albums" ? "active" : ""
				}`}
			>
				gallery
			</Link>
		</div>
	);
};
