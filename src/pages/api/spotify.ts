import Spotify from "@/lib/spotify";
import { NextApiResponse, NextApiRequest } from "next";

const spotify = new Spotify();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers.authorization?.split(" ")[1];
  const topTracksData = await spotify.getUsersTopTracks(token!);
  const usersPlaylists = await spotify.getUsersPlaylists(token!);

  return res.status(200).json({
    message: "success",
    topTracksData,
    usersPlaylists,
  });
}
