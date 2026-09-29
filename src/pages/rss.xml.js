import rss from "@astrojs/rss";
import { getPublishedPosts } from "../lib/posts";
import { SITE } from "../config";

export async function GET(context) {
  const posts = await getPublishedPosts();
  return rss({
    title: SITE.titolo,
    description: SITE.descrizione,
    site: context.site,
    items: posts.map((p) => ({ title: p.data.title, description: p.data.description, pubDate: p.data.date, link: `/log/${p.id}/` })),
  });
}
