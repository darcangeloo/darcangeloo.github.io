import { getCollection } from "astro:content";

// Unico filtro dei post pubblicati: non bozze e con data già arrivata al momento della build.
export async function getPublishedPosts() {
  const now = Date.now();
  return (await getCollection("log", ({ data }) => !data.draft && data.date.getTime() <= now))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
