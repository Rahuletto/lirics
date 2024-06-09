import styles from "@/styles/Home.module.css";
import { useSession, signOut, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import useInterval from "@/lib/useInterval";
import { Data } from "@/typings/Position";
import { Lyric, Lyrics } from "@/typings/Lyrics";
import msTosec from "@/lib/msTosec";
import { useRouter } from "next/router";
import loader from "@/styles/Loader.module.css";
import { useChange, useLyrics } from "@/providers/LyricsContext";

export default function Lyrical() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [data, setData] = useState<Data | null>(null);
  const [song, setSong] = useState<{
    image: string;
    name: string;
    artist: string;
    uri: string;
  } | null>(null);

  const lyrics = useLyrics()
  const setLyrics = useChange();
  
  const [current, setCurrent] = useState<Lyric | null>(null);
  const [hail, setHail] = useState<string>("");

  const [time, setTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(0);

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
    centerInParent();
    if (lyrics && lyrics[0] && current) {
      const cL = lyrics.filter((a) => a.seconds === current.seconds);
      if (cL && cL.length > 1) {
        const h = cL.reduce(function (a, b) {
          return a.lyrics.length < b.lyrics.length ? a : b;
        });
        setHail(h.lyrics);
      }
    }
  }, [current]);

  useInterval(() => {
    if (session && status === "authenticated") {
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

  function centerInParent() {
    const parent = document.querySelector(".scrollable") as HTMLElement;
    const child = document.querySelector(".current") as HTMLElement;

    if (child) {
      var parentRect = parent.getBoundingClientRect();
      var childRect = child.getBoundingClientRect();

      parent.scrollTop +=
        50 + childRect.top - parentRect.top - parent.clientHeight / 2;
    }
  }

  useInterval(() => {
    if (lyrics && Array.prototype.isPrototypeOf(lyrics) && data) {
      setCurrent(
        lyrics.filter((a) => msTosec(currentTime) >= a.seconds).splice(-1)[0]
      );
    }
  }, 1000);

  useEffect(() => {
    if (song && song.name && song.artist && !lyrics) {
      fetch(`/lyrics?track=${song.name}&artist=${song.artist}`)
        .then((res) => res.json())
        .then((d: { lyrics: Lyrics }) => {
          setLyrics(d.lyrics);
        })
        .catch((a) => {
          console.log(a);
        });
    }
  }, [song]);

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

      <main >
        <button className={styles.back} onClick={() => router.push("/")}>
          {"<"}
        </button>

        {status === "authenticated" && session && data && song ? (
          <div className={styles.main}>
            <div
              className={styles.backdrop}
              style={{ backgroundImage: `url(${song?.image})` }}
            ></div>
            <div className={["scrollable", styles.lyrics].join(" ")}>
              {lyrics && Array.prototype.isPrototypeOf(lyrics) && lyrics.slice(0, -4)[0] ? (
                <>
                  {lyrics.map((a, i) => (
                    <p
                      key={i}
                      className={
                        current && a.seconds === current.seconds
                          ? hail === a.lyrics
                            ? "hail lyric"
                            : "current lyric"
                          : "lyric"
                      }
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
          </div>
        ) : status === "unauthenticated" ? (
          <div className={styles.login}>
            <h3>Please sign in with Spotify</h3>
            <button onClick={() => signIn("spotify")}>Sign In</button>
          </div>
        ) : (
          <div className={styles.login}>
            <svg
              className={loader.loadingRing}
              viewBox="0 0 128 128"
              width="128px"
              height="128px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--green)" />
                  <stop offset="100%" stopColor="var(--green)" />
                </linearGradient>
              </defs>
              <circle
                className={loader.circle}
                r="56"
                cx="64"
                cy="64"
                fill="none"
                stroke="var(--green)"
                strokeWidth="16"
                strokeLinecap="round"
              />
              <path
                className={loader.worm}
                d="M92,15.492S78.194,4.967,66.743,16.887c-17.231,17.938-28.26,96.974-28.26,96.974L119.85,59.892l-99-31.588,57.528,89.832L97.8,19.349,13.636,88.51l89.012,16.015S81.908,38.332,66.1,22.337C50.114,6.156,36,15.492,36,15.492a56,56,0,1,0,56,0Z"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="44 1111"
                strokeDashoffset="10"
              />
            </svg>
          </div>
        )}
      </main>
    </>
  );
}
