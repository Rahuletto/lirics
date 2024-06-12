/* eslint-disable @next/next/no-img-element */
import styles from "@/styles/Home.module.css";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useSong } from "@/providers/SongContext";
import Signin from "@/components/Signin";
import NotPlaying from "@/components/NotPlaying";
import { useKaroke, useLyrics } from "@/providers/LyricsContext";
import { Fragment } from "react";

export default function Lyrics() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const song = useSong();
  const lyric = useLyrics();
  const karoke = useKaroke();

  return (
    <>
      <button className={styles.back} onClick={() => router.push("/")}>
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 512 512"
          height="20px"
          width="20px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z"></path>
        </svg>
      </button>
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
              <div
                className={styles.fullContainer}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  className={styles.lyrics}
                  style={{
                    marginTop: "96px",
                    paddingTop: "48px",
                    maxWidth: "900px",
                  }}
                >
                  {lyric && lyric.synced ? (
                    lyric.lyrics.map((a, i) => (
                      <>
                        <p
                          key={i}
                          data-seconds={a.seconds}
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
