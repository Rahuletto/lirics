import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.SECRET,
  redirectUri: process.env.REDIR,
});
export default spotifyApi;

