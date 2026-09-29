import { getCollection } from "astro:content";
import { getPublishedPosts } from "../lib/posts";
import { SITE } from "../config";

export async function GET({ site }) {
  const abs = (path) => new URL(path, site).href;
  const progetti = (await getCollection("progetti", ({ data }) => !data.noindex)).sort((a, b) => a.data.ordine - b.data.ordine);
  const posts = await getPublishedPosts();
  const sezione = (titolo, righe) => (righe.length ? ["", `## ${titolo}`, ...righe] : []);
  const body = [
    `# ${SITE.nome}`,
    "",
    `> ${SITE.descrizione}`,
    ...sezione("Progetti", progetti.map((p) => `- [${p.data.nome}](${abs(`/progetti/${p.id}/`)}): ${p.data.sintesi}`)),
    ...sezione("Log", posts.map((p) => `- [${p.data.title}](${abs(`/log/${p.id}/`)}): ${p.data.description}`)),
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
