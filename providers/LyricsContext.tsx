import { Karoke, Lyric, PlainLyrics, SyncedLyrics } from "@/typings/Lyrics";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSong, useTime } from "./SongContext";
import useInterval from "@/lib/useInterval";

import { extractAndRemoveParentheses } from "@/lib/extract";

const LyricContext = createContext<SyncedLyrics | PlainLyrics | null>(null);
const CurrentContext = createContext<Karoke | null>(null);

export function useLyrics() {
  return useContext(LyricContext);
}

export function useKaroke() {
  return useContext(CurrentContext);
}

export function LyricsProvider({ children }: { children: ReactNode }) {
  const song = useSong();
  const currentTime = useTime();

  const [lyric, setLyric] = useState<SyncedLyrics | PlainLyrics | null>(null);
  const [current, setCurrent] = useState<Karoke | null>(null);

  const [prevSong, setPrevSong] = useState<string>("");

  useInterval(() => {
    if (currentTime == 0 || currentTime == 1) setCurrent(null);
    if (lyric && lyric.synced) {
      const cur = lyric.lyrics.filter(
        (a) => currentTime >= a.seconds && currentTime <= a.seconds + 1
      ).splice(-1)[0]

      if (cur && cur.lyrics != null) {
        const [ext, clean] = extractAndRemoveParentheses(
          cur.lyrics == "" ? "..." : cur.lyrics
        );
        setCurrent({
          index: lyric.lyrics.findIndex((a) => a.seconds === cur.seconds),
          lyric: { seconds: cur.seconds, lyrics: clean.toString() },
        });
      }
    }
  }, 800);

  useEffect(() => {
    if (song && song.name && song.artist && prevSong !== song.name) {
      setCurrent(null);
      fetch(
        `/api/lyrics?track=${song.name.split(",").join("")}&artist=${
          song.artist
        }&album=${song.album}&artist=${song.artist}`
      )
        .then((res) => res.json())
        .then((d: SyncedLyrics | PlainLyrics) => {
          setLyric(d);
          setPrevSong(d.song);
        })
        .catch((a) => {
          console.warn(a);
        });
    }
  }, [song, prevSong]);

  return (
    <LyricContext.Provider value={lyric}>
      <CurrentContext.Provider value={current}>
        {children}
      </CurrentContext.Provider>
    </LyricContext.Provider>
  );
}
