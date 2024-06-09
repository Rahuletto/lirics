import { Lyric } from "@/typings/Lyrics";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const LyricContext = createContext<Lyric[] | string | null>(null);
const LyricChangeContext = createContext<any>(null);

export function useLyrics() {
  return useContext(LyricContext);
}

export function useChange() {
  return useContext(LyricChangeContext);
}

export function LyricsProvider({ children }: { children: ReactNode }) {
  const [lyric, setLyric] = useState<Lyric[] | string | null>(null);

  return (
    <LyricContext.Provider value={lyric}>
      <LyricChangeContext.Provider value={setLyric}>
        {children}
      </LyricChangeContext.Provider>
    </LyricContext.Provider>
  );
}
