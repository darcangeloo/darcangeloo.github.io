import rss from "@astrojs/rss";
import { render } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getPublishedPosts } from "../lib/posts";
import { SITE } from "../config";

export async function GET(context) {
  const posts = await getPublishedPosts();
  const container = await AstroContainer.create();
  const items = await Promise.all(posts.map(async (p) => {
    const { Content } = await render(p);
    return { title: p.data.title, description: p.data.description, pubDate: p.data.date, link: `/log/${p.id}/`, content: await container.renderToString(Content) };
  }));
  return rss({ title: SITE.titolo, description: SITE.descrizione, site: context.site, items });
}
