/* eslint-disable @next/next/no-img-element */
import styles from "@/styles/Home.module.css";
import player from "@/styles/Player.module.css";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useSong, useSpotify, useTime } from "@/providers/SongContext";
import Signin from "@/components/Signin";
import NotPlaying from "@/components/NotPlaying";
import { useKaroke, useLyrics } from "@/providers/LyricsContext";
import { Fragment, useEffect } from "react";
import { usePremium } from "@/providers/UserContext";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const song = useSong();
  const karoke = useKaroke();
  const data = useSpotify();
  const currentTime = useTime();
  const lyric = useLyrics();
  const premium = usePremium();

  function centerInParent() {
    const parent = document.querySelector("#homelyric") as HTMLElement;
    const child = document.querySelector(".current") as HTMLElement;

    if (child) {
      var parentRect = parent.getBoundingClientRect();
      var childRect = child.getBoundingClientRect();

      const scrollPosition =
        parent.scrollTop +
        childRect.top -
        parentRect.top -
        250 +
        parentRect.top / 2;
      parent.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }
  }

  function seek(seconds: number) {
    fetch("/api/spotify/seek", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ position: seconds * 1000 }),
    });
  }

  useEffect(() => {
    const parent = document.querySelector("#homelyric") as HTMLElement;

    if (!karoke?.index && parent) parent.scrollTop = 0;
  }, [song, karoke]);

  useEffect(() => {
    centerInParent();
  }, [karoke?.index]);

  return (
    <>
      {song && song?.image && (
        <div className="frame-bg">
          <img
            className="bg-color album-artwork"
            src={song?.image}
            alt="music cover"
          />
          <img
            className="bg-black album-artwork"
            src={song?.image}
            alt="music cover"
          />
        </div>
      )}
      <main className={styles.container}>
        {session && status === "authenticated" ? (
          song && song.name ? (
            <div className={styles.lirics}>
              <div className={styles.main}>
                <div
                  onClick={() => router.push("/share")}
                  className={styles.left}
                  style={{ cursor: "pointer" }}
                  id="left"
                >
                  <img
                    src={song.image}
                    className={styles.image}
                    alt="music cover"
                    id="image"
                  />
                  {!premium && (
                    <div className={player.controls} id="playback">
                      <button onClick={() => seek(currentTime - 5)}>
                        <svg
                          stroke="currentColor"
                          fill="none"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M15 18a6 6 0 1 0 0 -12h-11"></path>
                          <path d="M7 9l-3 -3l3 -3"></path>
                          <path d="M8 20h2a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-2v-3h3"></path>
                        </svg>
                      </button>

                      <button style={{ fontSize: "84px" }}>
                        {data?.is_playing ? (
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 320 512"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"></path>
                          </svg>
                        ) : (
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 384 512"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path>
                          </svg>
                        )}
                      </button>
                      <button onClick={() => seek(currentTime + 5)}>
                        <svg
                          stroke="currentColor"
                          fill="none"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9 18a6 6 0 1 1 0 -12h11"></path>
                          <path d="M13 20h2a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-2v-3h3"></path>
                          <path d="M17 9l3 -3l-3 -3"></path>
                        </svg>
                      </button>
                    </div>
                  )}

                  <div className={player.playback} id="playback">
                    <div className={player.progressBar}>
                      <div
                        className={player.progress}
                        style={{
                          width: `${
                            ((currentTime * 1000) / song.duration) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className={styles.title}>
                    <h1>
                      {song.name && song.name.length > 18
                        ? song.name.slice(0, 18) + "..."
                        : song.name}
                    </h1>
                    <h3>{song.artist}</h3>
                  </div>
                </div>
                <div className={styles.lyricContainer}>
                  <div
                    className={styles.lyrics}
                    id="homelyric"
                    onClick={() => !premium && router.push("/lyrics")}
                  >
                    {lyric && lyric.synced ? (
                      lyric.lyrics.map((a, i) => (
                        <>
                          <p
                            key={i}
                            onClick={() => premium && seek(a.seconds)}
                            data-seconds={a.seconds}
                            style={
                              karoke &&
                              karoke.index === i &&
                              lyric.lyrics[i + 1]
                                ? {
                                    animationDuration: `${
                                      lyric.lyrics[i + 1].seconds - a.seconds
                                    }s`,
                                  }
                                : karoke && karoke.index < i
                                ? {
                                    filter: `blur(${
                                      (i - karoke.index) * 0.5
                                    }px)`,
                                  }
                                : {}
                            }
                            className={`lyric ${
                              karoke && karoke.index === i
                                ? "current"
                                : karoke && karoke.index > i
                                ? "freeze"
                                : ""
                            }`}
                          >
                            {parseLyrics(a.lyrics)}
                          </p>
                        </>
                      ))
                    ) : lyric && lyric?.lyrics?.length > 0 ? (
                      <p className="current lyric">{lyric.lyrics}</p>
                    ) : (
                      <p className="cooking">We are cookin it.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <NotPlaying />
          )
        ) : (
          <Signin />
        )}
      </main>
    </>
  );
}

export const parseLyrics = (text: string) => {
  if (!text) return <span className="dots">...</span>;
  const parts = text.split(/(\([^)]+\))/g);

  const joined = parts.join("");
  if (joined.startsWith("(") && joined.endsWith(")"))
    return (
      <span id="right" className={styles.hail}>
        {parts}
      </span>
    );
  return parts.map((part, index) => {
    if (part.startsWith("(") && part.endsWith(")")) {
      if (index == parts.length - 2 && parts[parts.length - 1] == "")
        return (
          <span key={index} id="right" className={styles.hail}>
            {part}
          </span>
        );
      return (
        <span key={index} className={styles.hail}>
          {part}
        </span>
      );
    } else {
      return <Fragment key={index}>{part}</Fragment>;
    }
  });
};
