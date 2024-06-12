import spotifyApi from "@/lib/spotify";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != "GET")
    return res.status(405).json({
      message: "Invaid Method ! EXPECTED: GET method.",
      status: 405,
    });

  const searchParams = new URLSearchParams(req.url as string);
  const searchVal = searchParams.values().next().value.toString();

  try {
    const tk = await getToken({ req });
    if (tk) {
      const token = JSON.parse(JSON.stringify(tk, null, 2));

      spotifyApi.setAccessToken(token.access_token);

      const { body } = await spotifyApi.searchTracks(searchVal);

      if (body.tracks && body.tracks.items.length > 0) {
        const item = body.tracks.items[0];
        const song = {
          album: item.album.name,
          image: item.album.images[0].url,
          name: item.name,
          artist: item.artists.map((a) => a.name).join(", "),
          uri: item.uri,
          duration: item.duration_ms
        };

        return res.status(200).json({ data: song });
      } else return res.status(200).json({ data: {}, error: "Song not found" });
    } else res.status(401).json({ error: "Unauthorized" });
  } catch (err: any) {
    return res.status(500).json(err.body.error);
  }
}
