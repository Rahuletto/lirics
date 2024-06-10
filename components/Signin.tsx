import { signIn } from "next-auth/react";
import styles from "@/styles/Home.module.css";

function Signin() {
    return (
        <div className={styles.dialog}>
            <h1>Signin</h1>
            <p>By Sigining in, you are providing the real-time data of your listening activity.</p>
            <button className={styles.spotify} onClick={() => signIn('spotify')}>Sign in with Spotify</button>
        </div>
    );
}

export default Signin;