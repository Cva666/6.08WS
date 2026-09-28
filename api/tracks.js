import express from "express";
const router = express.Router();

import { getTracks, getTrackById } from "#db/queries/tracks";
import { authenticate } from "#db/queries/helpers/users";
import { getPlaylistsByTrackIdAndUserId } from "#db/queries/playlists";

router.get("/", async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.get("/:id", async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");
  res.send(track);
});

router.get("/:id/playlists", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    const track = await getTrackById(id);
    if (!track) {
      return res.status(404).send("Track not found.");
    }

    const playlists = await getPlaylistsByTrackIdAndUserId(id, req.user.id);
    res.send(playlists);
  } catch (error) {
    console.error("Error in GET /tracks/:id/playlists:", error);
    next(error);
  }
});

export default router;
