export type Lyric = { seconds: number; lyrics: string };

export interface SyncedLyrics {
  lyrics: Lyric[];
  song: string;
  synced: true;
}

export interface PlainLyrics {
  lyrics: string;
  synced: false;
  song: string;
}

export interface RAWLyrics {
  id: number;
  name: string;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number;
  instrumental: boolean;
  plainLyrics: string;
  syncedLyrics: string;
}
