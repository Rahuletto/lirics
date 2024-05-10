import NextAuth from "next-auth";
import spotifyApi from "../../../lib/spotify";
import Spotify from "next-auth/providers/spotify";
export default NextAuth({
  providers: [
    Spotify({
      clientId: process.env.CLIENT_ID as string,
      clientSecret: process.env.SECRET as string,
      authorization: {
        params: {
          scope:
            "user-read-playback-state user-read-currently-playing",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account && account.provider === "spotify") {
        spotifyApi.setAccessToken(account?.access_token as string);
        spotifyApi.setRefreshToken(account?.refresh_token as string);
        return true;
      } else return false;
    },
    jwt: async ({ token, account }: any) => {
      if (account) {
        token.access_token = account.access_token as string;
      }

      spotifyApi.setAccessToken(account?.access_token as string);

      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    verifyRequest: "/auth/verify-request",
  },
});
