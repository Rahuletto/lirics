import spotifyApi from "@/lib/spotify";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken, JWT } from "next-auth/jwt";

export default async function PUT(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != "PUT")
    return res.status(405).json({
      message: "Invaid Method ! EXPECTED: PUT method.",
      status: 405,
    });

  try {
    const tk = await getToken({ req });
    if (tk) {
      const token: JWT = JSON.parse(JSON.stringify(tk, null, 2));
      const reqBody = req.body;

      spotifyApi.setAccessToken(token.access_token);

      await spotifyApi.seek(reqBody.position);

      return res.status(200).json({ status: true });
    } else res.status(401).json({ error: "Unauthorized" });
  } catch (err: any) {
    return res.status(500).json(err.body.error);
  }
}
