// One-off local script: pixelates a rectangular region of public/profile.jpg
// (the face) for privacy, leaving the rest of the photo untouched. Not part
// of the app's runtime — run manually with: node scripts/pixelate-face.mjs

import sharp from "sharp";
import path from "node:path";

const SOURCE = path.resolve("public/profile.jpg");

// Region in original-image pixels (4022x4771 source), covering eyebrows to
// chin with margin on every side.
const REGION = { left: 1380, top: 1300, width: 1300, height: 1100 };
const BLOCK_SIZE = 18; // larger = chunkier pixelation

async function main() {
  const image = sharp(SOURCE);
  const { width, height } = await image.metadata();
  if (!width || !height) throw new Error("Couldn't read source image dimensions.");

  // Two separate pipelines, not chained resizes — sharp only keeps the last
  // .resize() call in a single chain, it doesn't apply them in sequence.
  const shrunk = await sharp(SOURCE)
    .extract(REGION)
    .resize(Math.max(1, Math.round(REGION.width / BLOCK_SIZE)), Math.max(1, Math.round(REGION.height / BLOCK_SIZE)), {
      kernel: "nearest",
    })
    .toBuffer();

  const face = await sharp(shrunk)
    .resize(REGION.width, REGION.height, { kernel: "nearest" })
    .toBuffer();

  await sharp(SOURCE)
    .composite([{ input: face, left: REGION.left, top: REGION.top }])
    .toFile(path.resolve("public/profile-pixelated.jpg"));

  console.log("Wrote public/profile-pixelated.jpg — check it, then swap it in for profile.jpg if it looks right.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
