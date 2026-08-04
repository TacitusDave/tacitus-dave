// Generates public/profile-placeholder.jpg: the photo downsampled to a tiny
// size (destroying facial detail irreversibly, not just visually hiding it
// with CSS) then blurred and re-scaled up for a soft, deliberate look. This
// is the file actually shipped to the client on first load — the real
// profile.jpg is only fetched after the user reveals it.
// Run manually with: node scripts/generate-profile-placeholder.mjs

import sharp from "sharp";
import path from "node:path";

const SOURCE = path.resolve("public/profile.jpg");
const OUTPUT = path.resolve("public/profile-placeholder.jpg");
const TINY_WIDTH = 20; // small enough that no identifying detail survives
const DISPLAY_WIDTH = 448; // 2x a 224px-wide component slot

async function main() {
  const tiny = await sharp(SOURCE).resize(TINY_WIDTH, null).toBuffer();

  await sharp(tiny)
    .resize(DISPLAY_WIDTH, null, { kernel: "cubic" })
    .blur(18)
    .jpeg({ quality: 70 })
    .toFile(OUTPUT);

  console.log(`Wrote ${OUTPUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
