import db from "#db/client";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const user1 = await createUser("kyle", "password");
  const user2 = await createUser("link", "tothepast");

  for (let i = 1; i <= 20; i++) {
    await createTrack("Track " + i, i * 50000);
  }
  for (let i = 1; i <= 20; i++) {
    const userId = i % 2 === 0 ? user2.id : user1.id;
    await createPlaylist(
      "playlist" + i,
      "lorum ipsum playlist description",
      userId,
    );
  }

  for (let trackId = 1; trackId <= 5; trackId++) {
    await createPlaylistTrack(1, trackId);
  }

  for (let trackId = 6; trackId <= 10; trackId++) {
    await createPlaylistTrack(2, trackId);
  }
}
