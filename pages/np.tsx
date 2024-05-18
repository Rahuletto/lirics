import styles from "@/styles/Home.module.css";
import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Lyrical() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if(status === "authenticated") router.push('/');
    
    setTimeout(() => router.reload(), 4000)
  }, [router])
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

      <main>
        {status === "unauthenticated" ? (
          <div className={styles.login}>
            <h3>Please sign in to use the app.</h3>
            <button onClick={() => signIn("spotify")}>Sign In</button>
          </div>
        ) : (
          <div className={styles.login}>
            <h3>You are currently not playing.</h3>
            <div style={{display: "flex", gap: 18}}>
            <button onClick={() => router.push("/")} style={{ marginRight: 8 }}>
              Refresh
            </button>
            <button onClick={() => signOut()}>Sign Out</button>
            </div>
            
          </div>
        )}
      </main>
    </>
  );
}
