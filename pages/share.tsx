import Head from "next/head";

import styles from "@/styles/Home.module.css";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import useInterval from "@/lib/useInterval";
import { Data } from "@/typings/Position";
import { Lyric, Lyrics } from "@/typings/Lyrics";
import { useRouter } from "next/router";
import { useChange, useLyrics } from "@/providers/LyricsContext";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [data, setData] = useState<Data | null>(null);
  const [song, setSong] = useState<{
    image: string;
    name: string;
    artist: string;
    uri: string;
  } | null>(null);

  const lyrics = useLyrics();
  const setLyrics = useChange();

  const [sharing, setSharing] = useState(false);

  const [sharable, setSharable] = useState<number[]>([]);

  useInterval(() => {
    if (session && status === "authenticated" && !sharing) {
      fetch("/api/spotify/pos", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((d: { data: Data }) => {
          if (d.data?.item) {
            d.data.timestamp = Date.now();
            setData(d.data);
            if (!song || song?.uri !== (d.data as Data).item.uri) {
              setLyrics(null);
              setSharing(false);
              setSharable([]);
              setSong({
                image: d.data.item.album.images[0].url,
                name: d.data.item.name,
                artist: d.data.item.artists.map((a) => a.name).join(", "),
                uri: d.data.item.uri,
              });
            }
          } else router.push("/np");
        });
    }
  }, 3000);

  useEffect(() => {
    if (!sharing && sharable.length > 6) setSharable((e) => sharable.slice(1));
  }, [sharable]);

  useEffect(() => {
    if (!sharing) {
      if (song && song.name && song.artist && !lyrics) {
        fetch(`/api/lyrics?track=${song.name}&artist=${song.artist}`)
          .then((res) => res.json())
          .then((d: { lyrics: Lyrics }) => {
            if (!Array.prototype.isPrototypeOf(d.lyrics)) setLyrics([{ seconds: 0, lyrics: "Sorry, This cannot be shared" }]);
            else setLyrics(d.lyrics);
          })
          .catch((a) => {
            console.log(a);
          });
      }
    }
  }, [song, sharing]);

  function generateShare(bool: boolean) {
    if (!lyrics || !data) return;
    setSharing(bool);
    if (bool && sharable) {
      setLyrics(
        sharable.map(
          (sec) => (lyrics as Lyric[]).find((obj) => obj.seconds === sec) as Lyric
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
  return (
    <>
      <svg style={{ display: "none" }} role="none">
        <filter id="blur">
          <feGaussianBlur stdDeviation="80" edgeMode="duplicate" />
        </filter>
      </svg>
      <svg className="grain" width="100%" height="100%">
        <filter id="pedroduarteisalegend">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          ></feTurbulence>
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#pedroduarteisalegend)"
        ></rect>
      </svg>

      <main>
        {status === "authenticated" && session && data && song ? (
          <div className={styles.main}>
            <div
              className={styles.backdrop}
              style={{ backgroundImage: `url(${song?.image})` }}
            ></div>
            <div
              className={styles.left}
              style={
                sharing
                  ? {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    position: "static",
                  }
                  : {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }
              }
            >
              <div
                className="left"
                style={
                  sharing
                    ? {
                      opacity: 0,
                      display: "flex",
                      gap: 22,
                    }
                    : {
                      display: "flex",
                      gap: 22,
                      width: "-webkit-fill-available",
                    }
                }
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
              {sharing ? (
                <button
                  onClick={() => generateShare(false)}
                  id="back-share"
                  style={{
                    opacity: 0,
                    display: "flex",
                    position: "absolute",
                    bottom: 20,
                    width: "89vw",
                    fontSize: 18,
                    textAlign: "center",
                    justifyContent: "center",
                  }}
                >
                  Back
                </button>
              ) : (
                <button
                  onClick={() => generateShare(true)}
                  style={{
                    display: "flex",
                    fontSize: 18,
                    width: "-webkit-fill-available",
                    textAlign: "center",
                    justifyContent: "center",
                  }}
                >
                  Share
                </button>
              )}
            </div>

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
              <div className="flex-wrap">
                <div style={{ cursor: "pointer", gap: 18 }} id="sharelyric">
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
            ) : (
              <div
                style={{ cursor: "pointer", gap: 18, height: "500px" }}
                id="homelyric"
                className={styles.lyrics}
              >
                {lyrics && lyrics[0] && lyrics as Lyric[] ? (
                  <>
                    {(lyrics as Lyric[]).map((a, i) => (
                      <p
                        style={{ opacity: 0.3 }}
                        key={i}
                        onClick={() =>
                          !sharable[0] ||
                            (lyrics as Lyric[])
                              .slice(
                                (lyrics as Lyric[]).findIndex(
                                  (e) =>
                                    e.seconds == sharable[sharable.length - 1]
                                ),
                                (lyrics as Lyric[]).findIndex(
                                  (e) =>
                                    e.seconds == sharable[sharable.length - 1]
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
                              (lyrics as Lyric[]).findIndex((e) => e.seconds == sharable[0]),
                              (lyrics as Lyric[]).findIndex(
                                (e) => e.seconds == sharable[0]
                              ) + 6
                            )
                            .find((e) => e.seconds == a.seconds)
                            ? "sharable"
                            : "",
                        ].join(" ")}
                      >
                        {a.lyrics}
                      </p>
                    ))}
                  </>
                ) : (
                  <h3 className="focus" style={{ opacity: "0.8" }}>
                    We still cookin it.
                  </h3>
                )}
              </div>
            )}
          </div>
        ) : status === "unauthenticated" ? (
          <div className={styles.login}>
            <h3>Please sign in to use the app.</h3>
            <button onClick={() => signIn("spotify")}>Sign In</button>
          </div>
        ) : (
          <div className={styles.login}>
            <h3>Loading</h3>
            <button onClick={() => signOut()}>Sign Out</button>
          </div>
        )}
      </main>
    </>
  );
}
