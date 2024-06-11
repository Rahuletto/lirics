/* eslint-disable @next/next/no-img-element */
import styles from "@/styles/Home.module.css";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useSong } from "@/providers/SongContext";
import Signin from "@/components/Signin";
import NotPlaying from "@/components/NotPlaying";
import { useKaroke, useLyrics } from "@/providers/LyricsContext";
import { Fragment, useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const song = useSong();
  const karoke = useKaroke();
  const lyric = useLyrics();

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
                  className={styles.left}
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push("/share")}
                >
                  <img
                    src={song.image}
                    className={styles.image}
                    alt="music cover"
                  />
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
                  <div className={styles.lyrics} id="homelyric" onClick={() => router.push('/lyrics')}>
                    {lyric && lyric.synced ? (
                      lyric.lyrics.map((a, i) => (
                        <>
                          <p
                            key={i}
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
                      <p>We are cookin it.</p>
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

  const joined = parts.join("")
  if (joined.startsWith("(") && joined.endsWith(")"))
    return (
      <span id="right" className={styles.hail}>
        {parts}
      </span>
    );
  return parts.map((part, index) => {
    if (part.startsWith("(") && part.endsWith(")")) {
      if(index == parts.length - 2 && parts[parts.length - 1] == "") return (
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
