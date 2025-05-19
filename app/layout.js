import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
	subsets: ["latin"],
	variable: "--font-nunito",
	display: "swap",
});

export const metadata = {
	title: "album exchange",
	description:
		"share albums you love, discover something new through community recommendations.",
	keywords: [
		"music",
		"album recommendations",
		"spotify",
		"music discovery",
		"playlist",
		"album sharing",
	],
	authors: [{ name: "bhav" }],
	metadataBase: new URL("https://bhav.fun"),

	applicationName: "elbum exchange",
	generator: "Next.js",
	creator: "bhav",
	publisher: "bhav",

	icons: {
		icon: [
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon.svg", type: "image/svg+xml" },
			{ url: "/favicon.ico" },
		],
		apple: [
			{
				url: "/apple-touch-icon.png",
				sizes: "180x180",
				type: "image/png",
			},
		],
		other: [
			{
				rel: "mask-icon",
				url: "/safari-pinned-tab.svg",
				color: "#e2a07e",
			},
		],
	},

	manifest: "/site.webmanifest",

	openGraph: {
		type: "website",
		url: "https://bhav.fun",
		title: "album exchange",
		description:
			"share albums you love, discover something new through community recommendations.",
		siteName: "Album Exchange",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Album Exchange - Share music you love, discover something new",
			},
		],
	},

	twitter: {
		card: "summary_large_image",
		title: "album exchange",
		description:
			"share albums you love, discover something new through community recommendations.",
		images: ["/og-image.png"],
		creator: "@reallywhybhav",
	},

	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},

	alternates: {
		canonical: "https://bhav.fun",
	},
};

export const viewport = {
	themeColor: "#fcf5e5",
	width: "device-width",
	initialScale: 1,
};

const RootLayout = ({ children }) => {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://i.scdn.co"
					crossOrigin="anonymous"
				/>
				<link rel="dns-prefetch" href="https://i.scdn.co" />
				<link
					rel="preconnect"
					href="https://mosaic.scdn.co"
					crossOrigin="anonymous"
				/>
				<link rel="dns-prefetch" href="https://mosaic.scdn.co" />
				<script
					dangerouslySetInnerHTML={{
						__html: `
                            (function() {
                                document.addEventListener('touchstart', function(e) {
                                    if (e.touches.length > 1) {
                                    e.preventDefault();
                                    }
                                }, { passive: false });

                                document.addEventListener('touchmove', function(e) {
                                    if (e.touches.length > 1 || Math.abs(e.touches[0].clientX - e.touches[0].initialX) > Math.abs(e.touches[0].clientY - e.touches[0].initialY)) {
                                    e.preventDefault();
                                    }
                                }, { passive: false });

                                document.addEventListener('touchstart', function(e) {
                                    e.touches[0].initialX = e.touches[0].clientX;
                                    e.touches[0].initialY = e.touches[0].clientY;
                                }, { passive: true });
                                })();
                            `,
					}}
				/>
			</head>
			<body className={nunito.className}>
				<a href="#main-content" className="skip-to-content">
					skip to content
				</a>
				{children}
			</body>
		</html>
	);
};

export default RootLayout;
