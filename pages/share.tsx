/* eslint-disable @next/next/no-img-element */
import styles from "@/styles/Home.module.css";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useSong } from "@/providers/SongContext";
import Signin from "@/components/Signin";
import NotPlaying from "@/components/NotPlaying";
import { useLyrics } from "@/providers/LyricsContext";
import { useEffect, useState } from "react";
import { Lyric } from "@/typings/Lyrics";
import { parseLyrics } from ".";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const song = useSong();
  const lyric = useLyrics();

  const [lyrics, setLyrics] = useState(lyric?.lyrics);

  const [sharing, setSharing] = useState(false);

  const [sharable, setSharable] = useState<number[]>([]);

  useEffect(() => {
    if (!sharing && sharable.length > 6) setSharable((e) => sharable.slice(1));
  }, [sharable]);

  useEffect(() => {
    if (!sharing) setLyrics(lyric?.lyrics);
  }, [lyric, sharing]);

  useEffect(() => {
    setSharable([]);
    setSharing(false);
  }, [song?.name]);

  function generateShare(bool: boolean) {
    if (!lyrics || !song || !lyric?.synced) return;
    setSharing(bool);
    if (bool && sharable) {
      setLyrics(
        sharable.map(
          (sec) =>
            (lyrics as Lyric[]).find((obj) => obj.seconds === sec) as Lyric
        )
      );
      setSharable([]);
    }
  }

  function changeShareable(sec: number) {
    if (sharing) return;
    if (
      sharable[sharable.length - 1] == sec &&
      sharable.find((a) => a == sec)
    ) {
      setSharable(sharable.slice(0, sharable.length - 1));
    } else setSharable((e) => [...e, sec]);
  }

  useEffect(() => {
    const parent = document.querySelector("#homelyric") as HTMLElement;
    if (parent) parent.scrollTop = 0;
  }, [song]);

  return (
    <>
    <button className={styles.back} style={sharing ? {opacity: 0} : {}} onClick={() => router.push("/")}>⏴</button>
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
          <>
            {sharing && (
              <svg
                className="logo-share"
                width="146"
                height="177"
                viewBox="0 0 146 177"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.51184 70.7904L85.3063 38.2967C94.8913 34.4889 97.973 22.4382 91.3927 14.4964V14.4964C82.3178 3.54393 64.5153 9.961 64.5153 24.1846V147.983C64.5153 162.036 78.0504 172.123 91.5172 168.107L143.542 152.59"
                  stroke="#EFEFEF"
                  stroke-width="16"
                />
              </svg>
            )}
            {sharing ? (
              <>
                <div style={{zIndex: 1}} onClick={() => generateShare(false)}>
                  <div  id="sharelyric">
                    {lyrics && lyrics[0] ? (
                      <>
                        <div id="lirics">
                          {(lyrics as Lyric[]).map((a, i) => (
                            <h2 key={i} className={"current lyric"}>
                              {a.lyrics}
                            </h2>
                          ))}
                        </div>
                        <div
                          id="share-left"
                          className={styles.left}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              gap: 22,
                            }}
                          >
                            <img src={song.image} className={styles.image} />
                            <div className={styles.title}>
                              <h1>
                                {song.name.length > 18
                                  ? song.name.slice(0, 18) + "..."
                                  : song.name}
                              </h1>
                              <h3>{song.artist}</h3>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3
                          className="focus"
                          style={{ opacity: "0.8", margin: 0, padding: 20 }}
                        >
                          Select a lyric to share.
                        </h3>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : song && song.name ? (
              <div className={styles.lirics}>
                <div className={styles.shareContainer}>
                  <div
                    style={{ cursor: "pointer", gap: 18, height: "500px" }}
                    id="homelyric"
                    className={styles.lyrics}
                  >
                    {lyrics && lyric?.synced ? (
                      (lyrics as Lyric[]).map((a, i) => {
                        const arrLyrics = lyrics as Lyric[];
                        return (
                          <>
                            <p
                              key={i}
                              onClick={() =>
                                !sharable[0] ||
                                arrLyrics
                                  .slice(
                                    arrLyrics.findIndex(
                                      (e) =>
                                        e.seconds ==
                                        sharable[sharable.length - 1]
                                    ),
                                    arrLyrics.findIndex(
                                      (e) =>
                                        e.seconds ==
                                        sharable[sharable.length - 1]
                                    ) + 2
                                  )
                                  .find((e) => e.seconds == a.seconds)
                                  ? changeShareable(a.seconds)
                                  : ""
                              }
                              className={[
                                sharable.find((e) => e == a.seconds)
                                  ? "current lyric"
                                  : "lyric",
                                (lyrics as Lyric[])
                                  .slice(
                                    (lyrics as Lyric[]).findIndex(
                                      (e) => e.seconds == sharable[0]
                                    ),
                                    (lyrics as Lyric[]).findIndex(
                                      (e) => e.seconds == sharable[0]
                                    ) + 6
                                  )
                                  .find((e) => e.seconds == a.seconds)
                                  ? "sharable"
                                  : "",
                              ].join(" ")}
                            >
                              {parseLyrics(a.lyrics)}
                            </p>
                          </>
                        );
                      })
                    ) : lyrics && lyrics?.length > 0 ? (
                      <div style={{ width: "100%" }}>
                        <div className={styles.dialog}>
                          <h1>Oops</h1>
                          <p>There is no synced lyrics, cannot share</p>
                        </div>
                      </div>
                    ) : (
                      <p>We are cookin it.</p>
                    )}
                  </div>
                </div>
                {sharing ? (
                  <button onClick={() => generateShare(false)}>Back</button>
                ) : (
                  <button onClick={() => generateShare(true)}>Share</button>
                )}
              </div>
            ) : (
              <NotPlaying />
            )}{" "}
          </>
        ) : (
          <Signin />
        )}
      </main>
    </>
  );
}
