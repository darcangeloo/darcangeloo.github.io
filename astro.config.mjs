import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { readdirSync, readFileSync } from "node:fs";

// Pagine progetto con `noindex: true` nel frontmatter: fuori dalla sitemap.
const dir = "src/content/progetti";
const noindex = readdirSync(dir)
  .filter((f) => /^noindex:\s*true/m.test(readFileSync(`${dir}/${f}`, "utf8")))
  .map((f) => `/progetti/${f.replace(/\.md$/, "")}/`);

export default defineConfig({
  site: "https://darcangeloo.github.io",
  integrations: [sitemap({ filter: (page) => !noindex.some((n) => page.endsWith(n)) })],
});
