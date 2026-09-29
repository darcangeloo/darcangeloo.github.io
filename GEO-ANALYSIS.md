# GEO Analysis: https://darcangeloo.github.io/

Audited 2026-09-29. Sources: live homepage, `robots.txt`, `llms.txt`, `sitemap-index.xml`, and the Astro source in this repo.

## 1. GEO Readiness Score: 38/100

| Criterion | Weight | Score | Note |
|---|---|---|---|
| Citability | 25% | 8/25 | Facts exist (project metrics) but no self-contained 134-167 word answer blocks |
| Structural readability | 20% | 13/20 | Clean H1/H2, lists and short paragraphs. No question headings, no FAQ |
| Multi-modal | 15% | 6/15 | Two images with good alt text. No video, chart or diagram |
| Authority & brand | 20% | 5/20 | No JSON-LD, no `sameAs`, no dates, 0 published posts, no author bio text |
| Technical access | 20% | 6/20 | Static HTML, so SSR is fine. But robots.txt, sitemap and schema are all missing |

The static Astro output is the site's main strength: AI crawlers do not run JS and this site needs none.

## 2. Platform breakdown

| Platform | Score | Why |
|---|---|---|
| Google AI Overviews / AI Mode | 35 | No sitemap, no content depth, and a single-page site has almost no query surface to rank for |
| ChatGPT | 30 | Relies on entity presence (Wikipedia, Reddit) and none exists |
| Perplexity | 30 | Needs community validation (Reddit) and none exists |
| Bing Copilot | 40 | Index is likely fine, but there are no Bing Webmaster or IndexNow signals |

## 3. AI crawler access

- `robots.txt` returns 404. Per spec that means everything is allowed, so GPTBot, OAI-SearchBot, ClaudeBot and PerplexityBot are not blocked.
- Nothing is explicitly declared. No `Sitemap:` line either.
- Note: GitHub Pages serves no custom headers, so `X-Robots-Tag` and server-side control of user-triggered fetchers (ChatGPT-User, Google-Agent) are not possible.

## 4. llms.txt

404. Google says `llms.txt` has no effect on Search, and the evidence for other engines is weak. **Skip it.** If wanted later, it is a five-line file in `public/`.

## 5. Brand mention analysis

Cannot verify off-site presence from here. Linked profiles: GitHub, Hugging Face (`bob-ml`), LinkedIn, Amazon book page.

- The name "Roberto Darcangelo" has no Wikipedia or Wikidata entity.
- No YouTube or Reddit presence is linked. Those are the strongest AI-citation correlates (YouTube ~0.74).
- The Hugging Face handle (`bob-ml`) and GitHub handle (`darcangeloo`) differ from each other and from the name. That splits entity signals. Tie them together with `sameAs` (see section 9).

## 6. Passage-level citability

Best existing passage, the `zerotok` project entry (~35 words): specific, with numbers (~23 ms/decision, AG News 88.5%), but too short and not self-contained. Nothing reaches the 134-167 word target.

The homepage has no "What is / Who is" definition in the first 60 words. The hero says "Sviluppatore, autore di *Insegnare alle Macchine*…" without a name, and the name appears only in the header and title.

## 7. Server-side rendering

Pass. Astro emits static HTML, all content is in the initial response, and the only client script is the newsletter form. Nothing to fix.

## 8. Top 5 highest-impact changes

1. **Publish real Log posts.** 0 published posts (the only entry in `src/content/log/` is `draft: true`). The site has one URL worth citing. Even 3 posts of 600+ words with a first-30% direct answer beat every other change. Recency is the top GEO lever and a blog is the way to feed it.
2. **Add Person + WebSite + Book JSON-LD** in `Base.astro` (section 9).
3. **Add a sitemap.** `npx astro add sitemap`, then `Sitemap:` line in a `public/robots.txt`. Missing sitemap-index confirmed 404.
4. **Add a name-first definition block** to the hero: "Roberto Darcangelo è uno sviluppatore di machine learning di Cerignola (Italia), autore di *Insegnare alle Macchine* (185 pagine)…" 134-167 words on `/about` or in the hero.
5. **Give each project a page** (or a Log post with method, numbers, repo link). Project blurbs are the only unique data on the site; they are unlinkable as they stand (`logUrl: ""` on all three).

## 9. Schema recommendations

Add to `Base.astro` `<head>`. Current state: zero JSON-LD.

```astro
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${Astro.site}#me`,
      name: SITE.nome,
      url: Astro.site,
      image: new URL(SITE.foto, Astro.site).href,
      jobTitle: "Machine learning developer",
      address: { "@type": "PostalAddress", addressLocality: "Cerignola", addressCountry: "IT" },
      sameAs: Object.values(SITE.links),
      knowsAbout: ["machine learning", "large language models", "MLOps", "reinforcement learning"],
    },
    { "@type": "WebSite", url: Astro.site, name: SITE.titolo, inLanguage: "it", author: { "@id": `${Astro.site}#me` } },
  ],
})} />
```

For posts, add `BlogPosting` (`headline`, `datePublished`, `dateModified`, `author` → `#me`) in `Post.astro`. For the book, add `Book` with `isbn` if it has one, `author`, `url` = Amazon link.

## 10. Content reformatting suggestions

- **Hero paragraph.** Rewrite so the name is the subject: "Roberto Darcangelo sviluppa sistemi di machine learning… Ha scritto *Insegnare alle Macchine*, un'introduzione in italiano al machine learning classico."
- **Book blurb.** Fine content, but the config string ends with a trailing space and no full stop. Add the ISBN and table-of-contents bullets, since those are the citable facts.
- **Project entries.** Turn "loss ~2.8" style lines into sentences with context: dataset, hardware, what the number is compared to.
- **Add "Chi sono" and a short FAQ** (e.g. "Che cos'è zerotok?", "Per chi è Insegnare alle Macchine?"). Question headings match how users query AI search. Skip FAQPage schema; it is not useful for a site like this.

## Other issues found

| Issue | Where | Fix |
|---|---|---|
| Image paths lack leading slash | `src/config.ts:37,40` (`"copertina.jpeg"`, `"io.jpeg"`) | Use `/copertina.jpeg`. Works on `/` today (both return 200) but breaks on any nested route |
| No `og:image`, no `twitter:card` | `Base.astro:20-24` | Add `og:image` with the profile or book cover |
| `og:type` is always `website` | `Base.astro:20` | Pass `article` from `Post.astro` |
| No `<meta name="author">` | `Base.astro` | Add `SITE.nome` |
| No dates anywhere on the homepage | index | Show "ultimo aggiornamento" once posts exist |
| Amazon URL has a ~600-char tracking query string | `src/config.ts:35` | Trim to `https://www.amazon.it/dp/B0HJXJ3M8C` |
| No `hreflang` needed | n/a | Single language (`it`); nothing to do |

## Skipped on purpose

- `llms.txt` and RSL: no measurable citation effect.
- Wikipedia page: not notable yet; the honest route is books, posts and talks first.
- Chunking or AI-rephrasing for bots: Google explicitly says it does not help.

## Quick-win order

1. `Base.astro` JSON-LD + `og:image` (15 min)
2. `public/robots.txt` with the `Sitemap:` line + `astro add sitemap` (5 min)
3. Rewrite hero definition (10 min)
4. Publish the first real Log post (the actual lever)
