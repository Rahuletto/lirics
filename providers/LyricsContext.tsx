import { Lyric, PlainLyrics, SyncedLyrics } from "@/typings/Lyrics";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSong, useTime } from "./SongContext";
import useInterval from "@/lib/useInterval";
import msTosec from "@/lib/msTosec";
import { extractAndRemoveParentheses } from "@/lib/extract";

const LyricContext = createContext<SyncedLyrics | PlainLyrics | null>(null);
const CurrentContext = createContext<Lyric | null>(null);

export function useLyrics() {
  return useContext(LyricContext);
}

export function useKaroke() {
  return useContext(CurrentContext);
}

export function LyricsProvider({ children }: { children: ReactNode }) {
  const song = useSong()
  const currentTime = useTime()

  const [lyric, setLyric] = useState<SyncedLyrics | PlainLyrics | null>(null);
  const [current, setCurrent] = useState<Lyric | null>(null);

  const [prevSong, setPrevSong] = useState<string>('');

  useInterval(() => {

    if (lyric && lyric.synced) {
      const cur = lyric.lyrics
        .filter((a) => currentTime >= a.seconds && currentTime <= a.seconds + 1)
        .splice(-1)[0];

      if (cur && cur.lyrics) {
        const [ext, clean] = extractAndRemoveParentheses(cur.lyrics);

        setCurrent({ seconds: cur.seconds, lyrics: clean.toString() });
      }
    }
  }, 800);

  useEffect(() => {
    if (song && song.name && song.artist && prevSong !== song.name) {
      fetch(`/api/lyrics?track=${song.name.split(',').join('')}&artist=${song.artist}`)
        .then((res) => res.json())
        .then((d: SyncedLyrics | PlainLyrics) => {
          setLyric(d);
          setPrevSong(d.song);
        })
        .catch((a) => {
          console.warn(a);
        });
    }
  }, [song, prevSong])

  return (
    <LyricContext.Provider value={lyric}>
      <CurrentContext.Provider value={current}>

        {children}
      </CurrentContext.Provider>
    </LyricContext.Provider>
  );
}
