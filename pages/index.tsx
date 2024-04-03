import Head from "next/head";

import styles from "@/styles/Home.module.css";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import useInterval from "@/lib/useInterval";
import { Data } from "@/typings/Position";
import { Lyric, Lyrics } from "@/typings/Lyrics";
import msTosec from "@/lib/msTosec";
import { useRouter } from "next/router";

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
  const [lyrics, setLyrics] = useState<Lyrics | null>(null);
  const [current, setCurrent] = useState<Lyric | null>(null);

  const [time, setTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(0);

  const [drafts, setDrafts] = useState<any>(null);
  const [selectedDraft, setSelected] = useState<number>(1);


  const [hail, setHail] = useState('')
  
    function centerInParent() {
    const parent = document.querySelector("#homelyric") as HTMLElement;
    const child = document.querySelector(".current") as HTMLElement;

    if (child) {
      var parentRect = parent.getBoundingClientRect();
      var childRect = child.getBoundingClientRect();

      parent.scrollTop += 120 +
        childRect.top - parentRect.top - parent.clientHeight / 2;
    }
  }

  useInterval(
    () => {
      if (data && data.is_playing) setTime(Date.now() - 1000);
    },
    data ? 50 : 1000
  );
  useEffect(() => {
    if (data)
      setCurrentTime(
        data.progress_ms + (data.is_playing ? time - data.timestamp : 0)
      );
  }, [time, data]);
  
  useEffect(() => {
    if(current){
    centerInParent();
    if(lyrics && lyrics[0] && current){
    const cL = lyrics.filter((a) => a.seconds === current.seconds)
    if(cL && cL.length > 1) {
      const h = cL.reduce(function(a, b) {
  return a.lyrics.length < b.lyrics.length ? a : b;
});
      setHail(h.lyrics)
    
    }
    }
    }
  }, [current]);

  useInterval(() => {
    if (session) {
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
              setCurrent(null);
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

  useInterval(() => {
    if (lyrics && lyrics[0] && data) {
      setCurrent(
        lyrics.filter((a) => msTosec(currentTime) >= a.seconds).splice(-1)[0]
      );
    }
  }, 800);

  useEffect(() => {
    setSelected(1);
    if (song && song.name && song.artist) {
      fetch(
        `/api/spotify/lyrics?name=${song.name}&artist=${song.artist
          .split(", ")
          .join("|!|")}`
      )
        .then((res) => res.json())
        .then((d: { lyrics: Lyrics; drafts: Lyrics[] }) => {
          setLyrics(d.lyrics);
          setDrafts(d.drafts);
          localStorage.setItem("draft", String(1));
        })
        .catch((a) => {
          console.log(a);
        });
    }
  }, [song]);

  useEffect(() => {
    if (drafts && drafts[selectedDraft][0]) {
      setLyrics(drafts[selectedDraft]);
      setCurrent(
        drafts[selectedDraft]
          .filter((a: Lyric) => msTosec(currentTime) >= a.seconds)
          .splice(-1)[0]
      );
      localStorage.setItem("draft", String(selectedDraft));
    }
  }, [selectedDraft]);

  useEffect(() => {
    const d = localStorage.getItem("draft");
    if (Number(d)) setSelected(Number(d));
  }, []);

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

      <main className={styles.main}>
        {status === "authenticated" && session && data && song ? (
          <>
            <div
              className={styles.backdrop}
              style={{ backgroundImage: `url(${song?.image})` }}
            ></div>
            <div className={styles.left}>
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

            <div
              onClick={() => router.push("/lyrics")}
              style={{ cursor: "pointer" }}
              id="homelyric"
              className={styles.lyrics}
            >
              {lyrics && lyrics[0] ? (
                <>
                  {lyrics
                    .map((a, i) => (
                      <p key={i} className={current && a.seconds === current.seconds ? (hail === a.lyrics ? "hail lyric" : "current lyric") : "lyric"}>{a.lyrics}</p>
                    ))}
    
                </>
              ) : (
                <h3 className="focus" style={{ opacity: "0.8" }}>
                  We still cookin it.
                </h3>
              )}
            </div>
            <div className={styles.drafts}>
              <button
                onClick={(e) => {
                  setSelected(0);
                  localStorage.setItem("draft", String(0));
                }}
              >
                1
              </button>
              <button
                onClick={(e) => {
                  setSelected(1);
                  localStorage.setItem("draft", String(1));
                }}
              >
                2
              </button>
              <button
                onClick={(e) => {
                  setSelected(2);
                  localStorage.setItem("draft", String(2));
                }}
              >
                3
              </button>
            </div>
          </>
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
