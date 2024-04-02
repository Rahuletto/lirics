import styles from "@/styles/Home.module.css";
import { useSession, signOut, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import useInterval from "@/lib/useInterval";
import { Data } from "@/typings/Position";
import { Lyric, Lyrics } from "@/typings/Lyrics";
import msTosec from "@/lib/msTosec";
import { useRouter } from "next/router";

export default function Lyrical() {
  const router = useRouter();

  return (
    <>
      <svg
        style={{ display: "none" }}
        role="none"
        viewBox="0 0 56 56"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="blur">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.72"
            numOctaves="1"
            stitchTiles="stitch"
          />
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
        <div className={styles.login}>
          <h3>You are currently not playing.</h3>
          <button onClick={() => router.push("/")} style={{ marginRight: 8 }}>
            Refresh
          </button>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      </main>
    </>
  );
}
