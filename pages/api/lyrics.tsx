import { RAWLyrics } from "@/typings/Lyrics";

export default async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const track = searchParams.get("track");

  const album = searchParams.get("album");

  if (!track) {
    return new Response(JSON.stringify({ error: "Missing track from params" }), {
      status: 400,
    });
  }

  const response = await fetch(
    `https://lrclib.net/api/search?track_name=${encodeURIComponent(
      track.split("(")[0]
    )}&album_name=${album}`
  );
  const lyrics: RAWLyrics[] = await response.json();

  if (lyrics[0]) {
    const syncedLy = lyrics.find((a: any) => a.syncedLyrics);
    const timed = syncedLy?.syncedLyrics;
    if (timed && splitLyric(timed)[0]) {
      const extract = extractLyrics(splitLyric(timed));
      return new Response(
        JSON.stringify({ song: track, lyrics: extract, synced: true })
      );
    } else {
      return new Response(
        JSON.stringify({
          song: track,
          lyrics: lyrics[0].plainLyrics,
          synced: false,
        })
      );
    }
  } else {

    const r = await fetch(
      `https://lrclib.net/api/search?q=${encodeURIComponent(track)}&album_name=${album}`
    );
    const l = await r.json();

    if (l[0]) {
      const syncedLy = l.find((a: any) => a.syncedLyrics);
      const timed = syncedLy?.syncedLyrics;

      if (timed && splitLyric(timed)) {
        const extract = extractLyrics(splitLyric(timed));

        return new Response(
          JSON.stringify({ song: track, lyrics: extract, synced: true })
        );
      } else {
        return new Response(
          JSON.stringify({
            song: track,
            lyrics: l[0].plainLyrics,
            synced: false,
          })
        );
      }
    } else {
      return new Response(
        JSON.stringify({ song: track, error: "No lyrics found" }),
        { status: 404 }
      );
    }
  }
}

export const runtime = "edge";

type LyricInfo = {
  seconds: number;
  lyrics: string;
};

function extractLyrics(array: string[]): LyricInfo[] {
  const result: LyricInfo[] = [];

  const pattern = /\[(\d{2}):(\d{2})\.\d{2}\]\s(.*)/;

  for (const string of array) {
    const match = string.match(pattern);

    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const totalSeconds: number = minutes * 60 + seconds;
      const lyrics = match[3];
      result.push({
        seconds:
          totalSeconds +
          (result.find((info) => info.seconds === totalSeconds) ? 1 : 0),
        lyrics,
      });
    }
  }

  return result;
}

function splitLyric(input: string): string[] {
  const res: string[] = [];
  input.split("[").forEach((a) => {
    res.push("[" + a);
  });

  return res;
}
