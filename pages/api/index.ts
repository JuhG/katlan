import type { NextApiRequest, NextApiResponse } from "next";
import jsonData from "data.json";

const URL = "https://ordogkatlan.hu/2022";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json(jsonData);
  return;

  console.log("fetching " + URL);
  const response = await fetch(URL, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    res.status(response.status).end();
    return;
  }

  const data = await response.json();
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate");
  res.json(data);
}
