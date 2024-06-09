export default async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    
    const track = searchParams.get('track');
    const artist = searchParams.get('artist');

    if (!track || !artist) {
        return new Response(JSON.stringify({ error: 'Missing track or artist' }), { status: 400 });
    }

    const response = await fetch(`https://lrclib.net/api/search?track_name=${encodeURIComponent(track)}&artist_name=${encodeURIComponent(artist)}`);
    const lyrics = await response.json()

    if(lyrics[0]) {
        const timed = lyrics[0].syncedLyrics
        if(splitLyric(timed)[0]) {
            console.log(splitLyric(timed))
            const extract = extractLyrics(splitLyric(timed))
            return new Response(JSON.stringify({lyrics: extract, synced: true }))
        } else {
            return new Response(JSON.stringify({ lyrics: lyrics[0].plainLyrics, synced: false }))
        }
    } else {
        const r = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(track + " " + artist)}`);
        const l = await r.json()
        if(l[0]) {
            const timed = l[0].syncedLyrics
            if(timed) {
                const extract = extractLyrics(timed)
                return new Response(JSON.stringify({lyrics: extract, synced: true}))
            } else {
                return new Response(JSON.stringify({ lyrics: l[0].plainLyrics, synced: false }))
            }
        } else {
            return new Response(JSON.stringify({ error: 'No lyrics found' }), { status: 404 });
        }
    }
}

export const runtime = 'edge';

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
            const totalSeconds = minutes * 60 + seconds;
            const lyrics = match[3];
            result.push({ seconds: totalSeconds, lyrics });
        }
    }

    return result;
}

function splitLyric(input: string): string[] {
    const res: string[] = []
    input.split('[').forEach(a => {
        res.push("[" + a)
    })

    return res
}