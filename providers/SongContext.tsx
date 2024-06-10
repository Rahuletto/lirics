


import msTosec from "@/lib/msTosec";
import useInterval from "@/lib/useInterval";
import { Lyric } from "@/typings/Lyrics";
import { Data } from "@/typings/Position";
import { useSession, signOut, signIn } from "next-auth/react";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

const SongContext = createContext<any>(null);
const TimeContext = createContext<number>(0);


export function useSong() {
    return useContext(SongContext);
}

export function useTime() {
    return useContext(TimeContext);
}

export function SongProvider({ children }: { children: ReactNode }) {
    const [song, setSong] = useState<any>(null);
    const [current, setCurrent] = useState<number>(0);

    const [data, setData] = useState<any>(null);
    const { data: session, status } = useSession();

    useInterval(
        () => {
            if (song?.name && data) {
                const buffer = ((Date.now() + 200) - data.timestamp)
                setCurrent(
                    msTosec((data.progress_ms +
                        (data.is_playing ? buffer < (data.progress_ms + 3000) ? buffer : 0 : 0)))
                );
            }
        },
        song?.name ? 50 : 1000
    );



    useEffect(() => {
        function repeat() {
            if (session && status === "authenticated") {
                fetch("/api/spotify/pos", {
                    method: "GET",
                })
                    .then((res) => res.json())
                    .then((d: { data: Data, status: number }) => {
                        if (d.status == 401) {
                            signOut();
                            setTimeout(() => {
                                signIn('spotify')
                            }, 2000)
                        }
                        if (d.data?.item) {
                            setData(d.data)
                            d.data.timestamp = Date.now();
                            if (!song || song?.uri !== (d.data as Data).item.uri) {
                                setSong({
                                    image: d.data.item.album.images[0].url,
                                    name: d.data.item.name,
                                    artist: d.data.item.artists.map((a) => a.name).join(", "),
                                    uri: d.data.item.uri,
                                });
                            }
                        } else setSong(null)
                    });
            }
        }

        repeat()
        
        let int = setInterval(() => { repeat() }, 3000)
        return () => {
            clearInterval(int);
        };
    }, [session, song, status])

    return (
        <SongContext.Provider value={song}>
            <TimeContext.Provider value={current}>
                {children}
            </TimeContext.Provider>
        </SongContext.Provider>
    );
}
