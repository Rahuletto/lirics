


import styles from "@/styles/Home.module.css";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

function Signin() {
    const router = useRouter()
    return (
        <div className={styles.dialog}>
            <h1>Not playing</h1>
            <p>Seems like you are not playing any song.</p>
            <div style={{display: 'flex', justifyContent: 'space-between', gap: 8}}>
            <button onClick={() => router.reload()}>Refresh</button>
            <button onClick={() => signOut()}>Sign out</button>
            </div>
            
        </div>
    );
}

export default Signin;