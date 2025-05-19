const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri =
	process.env.SPOTIFY_REDIRECT_URI || "http://127.0.0.1:3000/callback";
const scopes =
	"user-read-currently-playing user-read-recently-played playlist-modify-public playlist-modify-private";

if (!client_id || !client_secret) {
	console.error(
		"error: SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set in environment variables"
	);
	process.exit(1);
}

app.get("/", (req, res) => {
	res.redirect(
		`https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${encodeURIComponent(
			redirect_uri
		)}&scope=${encodeURIComponent(scopes)}`
	);
});

app.get("/callback", async (req, res) => {
	const code = req.query.code;

	try {
		const response = await fetch("https://accounts.spotify.com/api/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization:
					"Basic " +
					Buffer.from(client_id + ":" + client_secret).toString(
						"base64"
					),
			},
			body: new URLSearchParams({
				grant_type: "authorization_code",
				code,
				redirect_uri,
			}),
		});

		const data = await response.json();

		res.send(`
            <p><strong>refresh Token:</strong> ${data.refresh_token}</p>
    `);
	} catch (error) {
		res.status(500).send(`error: ${error.message}`);
	}
});

app.listen(port, () => {
	console.log(`token app listening at http://localhost:${port}`);
});
