import sharp from "sharp";
import { readdirSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const dir = "public/img";
const out = join(dir, "og");
mkdirSync(out, { recursive: true });

const skip = /^(logo-|ChatGPT)/;
for (const f of readdirSync(dir)) {
  if (!f.endsWith(".png") || skip.test(f)) continue;
  const name = f.replace(/\.png$/, "");
  await sharp(join(dir, f))
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .png({ compressionLevel: 9, palette: true })
    .toFile(join(out, `${name}-1200x630.png`));
  console.log("og:", name);
}
