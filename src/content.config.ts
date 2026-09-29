import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const log = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/log" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const progetti = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/progetti" }),
  schema: z.object({
    nome: z.string(),
    sintesi: z.string(),
    metrica: z.string(),
    tag: z.array(z.string()),
    repoUrl: z.string().url().optional(),
    aggiornato: z.coerce.date().optional(),
    noindex: z.boolean().default(false),
    ordine: z.number(),
  }),
});

export const collections = { log, progetti };
