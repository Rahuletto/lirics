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
