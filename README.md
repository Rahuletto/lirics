# lirics
Lirics is a self-hosting service that brings real-time Spotify lyrics to your screen with a beautiful, Apple Music-like aesthetic.
> As spotify made lyrics into a premium feature, I came up with this cool idea to display accurate timed-lyrics in Apple Music style.

> [!IMPORTANT]
> Thanks to [LRCLib](https://lrclib.net) api for providing lyrics

### Features
- Real-Time Lyric Display: See the lyrics of your favorite songs in real time as they play on Spotify.
- Playback Control: Spotify Premium users can control playback directly from the app.
- Interactive Lyrics: Click on any line of lyrics to jump to that specific part of the song.
- Advanced Navigation: Easily seek 10 seconds forward or backward with intuitive controls.
- PWA Support! Install the website as an app in supported browsers

### Installation
To get started with Lirics, follow these steps:

- Clone the repository: git clone https://github.com/Rahuletto/lirics.git
- Navigate to the project directory: cd lirics
- Get Spotify API key from [Spotify developer dashboard](https://developer.spotify.com/dashboard)
- Setup the `.env` with the `NEXTAUTH_SECRET`, `SECRET`, `CLIENT_ID`, `REDIR`, `NEXTAUTH_URL` variables, Where
  - - `NEXTAUTH_SECRET` is the [Encryption key for JWT](https://next-auth.js.org/configuration/options#secret) (haha fancy term?)
    - `SECRET` and `CLIENT_ID` from Spotify api
    - `REDIR` would be `https://{URL}/api/auth/callback/spotify` where URL is your hosted/localhost website
    - `NEXTAUTH_URL` is self-explanatory, its the url of your site.
- Install the necessary dependencies:
  ```
  npm install
  ```
- Start the application:
  ```
  npm run build && npm run start
  ```

Once installed, you can access Lirics from your web browser. Ensure you have a Spotify Premium account to utilize playback controls within the app, other than that you can see timed lyrics without any subscription.

This can **only** be self-hosted as Spotify didnt approve my application for the API to be used by public
> Your application would be rejected if requested to be published to public for the reason `Synchronization: Spotify content is used in the background of visual media, such as advertising, film, TV programs, livestreams, slideshow videos, lyrics (etc.)`


> [!WARNING]
> This is not affiliated to Spotify


### Screenshots

Lyrics
| Desktop | Mobile |
| ------- | ------ |
| <img width="1200" alt="image" src="https://github.com/Rahuletto/lirics/assets/71836991/c3cf07a6-d937-469c-8097-c2cf2252aca8"> | <img width="300" alt="image" src="https://github.com/Rahuletto/lirics/assets/71836991/6004dd9d-6130-47a8-b4e0-df492d9d06eb"> |


Sharing page

| Desktop | Mobile |
| ------- | ------ |
| <img width="1200" alt="image" src="https://github.com/Rahuletto/lirics/assets/71836991/bf9518fb-ccf8-4be1-83d4-b7dff5a1d5ad"> | <img width="300" alt="image" src="https://github.com/Rahuletto/lirics/assets/71836991/d2658e91-b920-495f-9a82-05d7deda6941"> |


Video

https://github.com/Rahuletto/lirics/assets/71836991/0adf6cae-99e1-4cb8-8247-a3fe6e3600b4
