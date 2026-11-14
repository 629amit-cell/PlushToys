import { copyFile, cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

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
    if (path.basename(source) === ".DS_Store") return false;
    if (relative === "products/amazon" || relative.startsWith(`products${path.sep}amazon${path.sep}`)) {
      return false;
    }
    if (/^products[\\/][^\\/]+\.(?:jpe?g|png)$/i.test(relative)) return false;
    return true;
  },
});

const browser = { window: {}, console };
vm.createContext(browser);
for (const script of [
  "catalog-additions.js",
  "catalog-expansion.js",
  "catalog-amazon.js",
  "catalog-cards.js",
  "catalog-gallery.js",
  "store.js",
]) {
  vm.runInContext(await readFile(path.join(root, script), "utf8"), browser, { filename: script });
}

const products = browser.window.PlushStoryStore?.products || [];
const baseUrl = "https://plushstory.shop";
const lastModified = new Date().toISOString().slice(0, 10);
const staticPages = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/faq", priority: "0.6", changefreq: "monthly" },
  { path: "/shipping-returns", priority: "0.5", changefreq: "monthly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
  { path: "/contact", priority: "0.6", changefreq: "monthly" },
];
const urls = [
  ...staticPages.map((page) => ({
    loc: `${baseUrl}${page.path}`,
    priority: page.priority,
    changefreq: page.changefreq,
  })),
  ...products.map((product) => ({
    loc: `${baseUrl}/product?id=${encodeURIComponent(product.id)}`,
    image: `${baseUrl}/assets/og/products/${encodeURIComponent(product.id)}.jpg?v=1`,
    priority: "0.8",
    changefreq: "monthly",
  })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map((entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>${entry.image ? `\n    <image:image>\n      <image:loc>${entry.image}</image:loc>\n    </image:image>` : ""}
  </url>`).join("\n")}
</urlset>
`;
await writeFile(path.join(output, "sitemap.xml"), sitemap, "utf8");

console.log(`Built ${staticFiles.length} root files, ${products.length} product URLs and assets into dist/`);
