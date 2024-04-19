import spotifyApi from "@/lib/spotify";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != "GET")
    return res.status(405).json({
      message: "Invaid Method ! EXPECTED: GET method.",
      status: 405,
    });

  try {
    const tk = await getToken({ req });
    if (tk) {
      const token = JSON.parse(JSON.stringify(tk, null, 2));

      spotifyApi.setAccessToken(token.access_token);

      const { body } = await spotifyApi.getMyCurrentPlaybackState();

      return res.status(200).json({ data: body });
    } else res.status(401).json({ error: "Unauthorized" });
  } catch (err: any) {
    return res.status(500).json(err.body.error);
  }
}
