/* eslint-disable @next/next/no-img-element */
import styles from "@/styles/Home.module.css";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useSong } from "@/providers/SongContext";
import Signin from "@/components/Signin";
import NotPlaying from "@/components/NotPlaying";
import { useKaroke, useLyrics } from "@/providers/LyricsContext";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const song = useSong()
  const karoke = useKaroke()
  const lyric = useLyrics()

  function centerInParent() {
    const parent = document.querySelector("#homelyric") as HTMLElement;
    const child = document.querySelector(".current") as HTMLElement;

    if (child) {
      var parentRect = parent.getBoundingClientRect();
      var childRect = child.getBoundingClientRect();


      parent.scrollTop +=
        childRect.top - parentRect.top - 230 + parentRect.top / 2;
    }
  }

  useEffect(() => {
    centerInParent()
  }, [karoke?.seconds])

  return (
    <>
      {song && song?.image && <div className="frame-bg">
        <img className="bg-color album-artwork" src={song?.image} alt="music cover" />
        <img className="bg-black album-artwork" src={song?.image} alt="music cover" />
      </div>}
      <main className={styles.container}>
        {session && status === "authenticated" ? (song && song.name ? (
          <div className={styles.lirics}>
            <div className={styles.main}>

              <div className={styles.left}>
                <img src={song.image} className={styles.image} alt="music cover" />
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
                <div className={styles.lyrics} id="homelyric">

                  {lyric && lyric.synced ? (

                    lyric.lyrics.map((a, i) => (
                      <>
                        <p
                          key={i}
                          className={
                            karoke && a.seconds === karoke.seconds
                              ? "current lyric"
                              : "lyric"
                          }
                        >
                          {a.lyrics}
                        </p>
                      </>
                    )))
                    : lyric && lyric?.lyrics?.length > 0 ? (
                      <p

                        className="current lyric"
                      >
                        {lyric.lyrics}
                      </p>) : <p>We are cookin it.</p>}
                </div>
              </div>
            </div>
          </div>
        ) : <NotPlaying />) : <Signin />}

      </main>
    </>
  );
}
