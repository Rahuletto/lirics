import { Lyrics } from "@/typings/Lyrics";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const name = searchParams.get("name");
  const artists = searchParams.get("artist")?.split("|!|") as string[];

  try {
    const d1 = await fetch(
      `http://api.textyl.co/api/lyrics?q=${encodeURIComponent(`${name}`)}`
    );

    const d2 = await fetch(
      `http://api.textyl.co/api/lyrics?q=${encodeURIComponent(
        `${name} ${artists && artists[0]}`
      )}`
    );

    const d3 = await fetch(
      `http://api.textyl.co/api/lyrics?q=${encodeURIComponent(
        `${name} ${artists && artists.join(" ")}`
      )}`
    );

    let draft1: string | Lyrics = await d1.text();
    let draft2: string | Lyrics = await d2.text();
    let draft3: string | Lyrics = await d3.text();

    if (draft1.startsWith("No")) draft1 = "{}";
    if (draft2.startsWith("No")) draft2 = "{}";
    if (draft3.startsWith("No")) draft3 = "{}";

    draft1 = JSON.parse(draft1);
    draft2 = JSON.parse(draft2);
    draft3 = JSON.parse(draft3);

    const padding = [
      { seconds: 9999, lyrics: "..." },
      { seconds: 9999, lyrics: ".." },
      { seconds: 9999, lyrics: "." },
      { seconds: 9999, lyrics: " " },
    ]

    if (draft2[0])
      (draft2 as Lyrics).push(...padding);
    if (draft1[0])
      (draft1 as Lyrics).push(...padding);
    if (draft3[0])
      (draft3 as Lyrics).push(...padding);

    return new Response(
      JSON.stringify({
        lyrics: draft2[0] ? draft2 : draft1[0] ? draft1 : draft3,
        drafts: [draft1, draft2, draft3],
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
