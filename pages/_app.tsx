import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useWakeLock } from "react-screen-wake-lock";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useEffect, useLayoutEffect } from "react";
import { LyricsProvider } from "@/providers/LyricsContext";

const inter = Inter({
  fallback: ["sans-serif"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  style: ["normal"],
  subsets: ["latin"],
  variable: "--main-font",
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const { request } = useWakeLock();

  useEffect(() => {
    request();
  }, []);

  return (
    <SessionProvider session={session}>
      <Head>
        <link rel="manifest" href="/manifest.json" />

        <meta name="application-name" content="lirics." />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="lirics." />
        <meta
          name="description"
          content="Spotify lyrics didnt work so i took things into my own hands lol. A fun project."
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />

        <title>lirics.</title>
        <meta name="title" content="lirics." />
        <meta
          name="description"
          content="Spotify lyrics didnt work so i took things into my own hands lol. A fun project."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lirics.vercel.app" />
        <meta property="og:title" content="lirics." />

        <meta
          property="og:description"
          content="Spotify lyrics didnt work so i took things into my own hands lol. A fun project."
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://lirics.vercel.app" />
        <meta property="twitter:title" content="lirics." />

        <meta
          property="twitter:description"
          content="Spotify lyrics didnt work so i took things into my own hands lol. A fun project."
        />

        <link key="icon" rel="icon" href={"/favicon.svg"} />
      </Head>

      <style jsx global>
        {`
          html {
            --main-font: ${inter.style.fontFamily};
          }
        `}
      </style>
      <LyricsProvider>
        <Component {...pageProps} />
      </LyricsProvider>
    </SessionProvider>
  );
}
