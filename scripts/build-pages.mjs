import { copyFile, cp, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");
const rootFiles = await readdir(root, { withFileTypes: true });

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const staticFiles = rootFiles
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((name) =>
    name.endsWith(".html") ||
    name.endsWith(".css") ||
    name.endsWith(".js") ||
    ["_headers", "_routes.json", "robots.txt", "favicon.ico"].includes(name)
  );

await Promise.all(staticFiles.map((name) =>
  copyFile(path.join(root, name), path.join(output, name))
));

const assetsRoot = path.join(root, "assets");
const outputAssets = path.join(output, "assets");
await cp(assetsRoot, outputAssets, {
  recursive: true,
  // The full-size source photos are only used to generate the WebP
  // derivatives in cards/, thumbs/ and gallery/. Every product now has a
  // card and gallery entry, so the source folders do not need to be served.
  filter: (source) => {
    const relative = path.relative(assetsRoot, source);
    if (relative === "products/amazon" || relative.startsWith(`products${path.sep}amazon${path.sep}`)) {
      return false;
    }
    if (/^products[\\/][^\\/]+\.(?:jpe?g|png)$/i.test(relative)) return false;
    return true;
  },
});

console.log(`Built ${staticFiles.length} root files and assets into dist/`);
