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

await cp(path.join(root, "assets"), path.join(output, "assets"), { recursive: true });

console.log(`Built ${staticFiles.length} root files and assets into dist/`);
