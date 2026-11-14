import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "scripts", ".product-og-manifest.json");
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

const store = browser.window.PlushStoryStore;
if (!store || !Array.isArray(store.products)) {
  throw new Error("Could not load the client product catalog.");
}

const products = store.products.map((product) => {
  const sizes = store.productSizesFor(product);
  return {
    id: product.id,
    name: product.name,
    price: store.productPrice(product, sizes[0]),
    color: product.color || "#f5d7df",
    card: `assets/products/cards/${product.id}.webp`,
  };
});

await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, JSON.stringify(products, null, 2));
console.log(`Wrote ${products.length} product social cards to ${path.relative(root, output)}`);
