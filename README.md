# album exchange

a place to discover new music and share your favorite albums with the community.

![Album Exchange](/album-exchange.png)

## installation

1. clone the repository

    ```bash
    git clone https://github.com/codebhav/album-exchange.git
    cd album-exchange
    ```

2. install dependencies

    ```bash
    npm install
    # or
    yarn install
    ```

3. create a `.env.local` file in the project root with your environment variables (see configuration section)

4. run the development server

    ```bash
    npm run dev
    # or
    yarn dev
    ```

5. open [http://localhost:3000](http://localhost:3000) in your browser

## configuration

### environment variables

create a `.env.local` file with the following variables:

```env
# spotify API (required)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
SPOTIFY_REFRESH_TOKEN=your_refresh_token

# firebase (required)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="your_firebase_private_key"

# security (optional, but recommended)
IP_SALT=random_string_of_at_least_32_chars_for_additional_security
```

### spotify API setup

1. go to the [spotify developer dashboard](https://developer.spotify.com/dashboard/)
2. create a new application
3. set the Redirect URI to `http://localhost:3000/callback`
4. note your client ID and client Secret
5. run the token generation script:
    ```bash
    node scripts/get-spotify-token.js
    ```
6. follow the browser prompts to authorize your application
7. copy the refresh token to your `.env.local` file

### firebase setup

1. create a new firebase project at [firebase console](https://console.firebase.google.com/)
2. set up firestore database
3. generate a new private key from project settings > service accounts
4. add the firebase credentials to your `.env.local` file

## project structure

```
album-exchange/
├── app/                      # nextjs app directory
│   ├── api/                  # API routes for backend functionality
│   ├── albums/               # album gallery page
│   ├── globals.css           # global styles
│   ├── layout.js             # root layout component
│   └── page.js               # homepage
├── components/               # react components
│   ├── CozyComponents.jsx    # shared UI components
│   ├── DynamicAlbumCard.jsx  # album card with dynamic data fetching
│   ├── FAQ.jsx               # FAQ accordion component
│   └── NavBar.jsx            # navigation component
├── lib/                      # utility functions and services
│   ├── date-utils.js         # date formatting utilities
│   ├── firebase-service.js   # firebase integration
│   ├── spotify-service.js    # spotify API integration
│   └── url-utils.js          # URL validation and cleaning
├── public/                   # static assets
└── scripts/                  # utility scripts
    └── get-spotify-token.js  # script to get spotify refresh token
```

## development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## deployment

The application is optimized for deployment on vercel:

1. push your code to a github repository
2. import the project in [vercel](https://vercel.com)
3. configure the environment variables
4. deploy :)

for other platforms, build the project with `npm run build` and serve the generated files.

## contributing

contributions are welcome! please feel free to submit a PR. it's my first time building
in public, so any help is appreciated :)

1. fork the repository
2. create your feature branch (`git checkout -b feature/super-cool-feature`)
3. commit your changes (`git commit -m 'added some awesome sauce feature'`)
4. push to the branch (`git push origin feature/super-cool-feature`)
5. open a pull request

## license

this project is licensed under the MIT License - see the LICENSE file for details.

## acknowledgements

-   [nextjs](https://nextjs.org/)
-   [react](https://reactjs.org/)
-   [spotify web API](https://developer.spotify.com/documentation/web-api/)
-   [firebase](https://firebase.google.com/)
-   [react icons](https://react-icons.github.io/react-icons/)
-   [react hot toast](https://react-hot-toast.com/)

---

made with 🎶 & ❤️ by [bhav](https://whybhav.in/)
