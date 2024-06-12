import NextAuth, { User } from "next-auth";
import spotifyApi from "../../../lib/spotify";
import Spotify from "next-auth/providers/spotify";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    error?: "RefreshAccessTokenError";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    expires_at: number;
    refresh_token: string;
    error?: "RefreshAccessTokenError";
  }
}

export default NextAuth({
  providers: [
    Spotify({
      clientId: process.env.CLIENT_ID as string,
      clientSecret: process.env.SECRET as string,
      authorization: {
        params: {
          scope: "user-read-playback-state user-read-currently-playing",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as User;
      }

      return session;
    },
    async signIn({ user, account, profile }) {
      if (account && account.provider === "spotify") {
        spotifyApi.setAccessToken(account?.access_token as string);
        spotifyApi.setRefreshToken(account?.refresh_token as string);
        return true;
      } else return false;
    },
    async jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token as string;
        token.expires_at = account.expires_at as number;
        token.refresh_token = account.refresh_token as string;

        spotifyApi.setAccessToken(account?.access_token as string);

        return {
          access_token: account.access_token as string,
          expires_at: account.expires_at as number,
          refresh_token: account.refresh_token as string,
        };
      } else {
        const isTokenExpired = Date.now() >= token.expires_at * 1000;

        if (isTokenExpired) {
          if (!token.refresh_token) throw new Error("Missing refresh token");
          try {
            const response = await spotifyApi.refreshAccessToken();
            const responseTokens = response.body;

            return {
              ...token,
              access_token: responseTokens.access_token,
              expires_at: Math.floor(
                Date.now() / 1000 + (responseTokens.expires_in as number)
              ),
              refresh_token:
                responseTokens.refresh_token ?? token.refresh_token,
            } as JWT;
          } catch (error) {
            console.error("Error refreshing access token", error);
            return {
              ...token,
              error: "RefreshAccessTokenError" as const,
            } as JWT;
          }
        } else {
          return token as JWT;
        }
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    verifyRequest: "/auth/verify-request",
  },
});
