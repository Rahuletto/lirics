
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
      <svg style={{ display: "none" }} role="none">
        <filter id="blur11">
          <feGaussianBlur stdDeviation="80" edgeMode="duplicate" />
        </filter>
      </svg>

      <main className={styles.main}>

          <div className={styles.login}>
            <h3>You are currently not playing.</h3>
            <button onClick={() => router.push('/')} style={{marginRight: 8}}>Refresh</button>
            <button onClick={() => signOut()}>Sign Out</button>
          </div>

      </main>
    </>
  );
}
