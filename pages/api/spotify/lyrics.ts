import { Lyrics } from "@/typings/Lyrics";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const name = searchParams.get("query");

  try {
    const d1 = await fetch(
      `https://lirics.vercel.app/api/lyrics?query=${encodeURIComponent(`${name}`)}`
    );


    const draft1 = await d1.json();

    const padding = [
      { seconds: 9999, lyrics: "..." },
      { seconds: 9999, lyrics: ".." },
      { seconds: 9999, lyrics: "." },
      { seconds: 9999, lyrics: " " },
    ]

    if (draft1[0])
      (draft1 as Lyrics).push(...padding);

    return new Response(
      JSON.stringify({
        lyrics: draft1
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  } catch (err) {
    console.log(err);
    return new Response(
      JSON.stringify({
        error: JSON.stringify(err),
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }
}

