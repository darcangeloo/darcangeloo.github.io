# Sito personale

## In locale
`npm install`, poi `npm run dev` (serve Node 22.12 o superiore). Il sito è su http://localhost:4321.

## Cosa modificare
- `src/config.ts`: nome, descrizione, link, newsletter, libro, foto.
- `src/data/projects.ts`: progetti.
- `src/data/services.ts`: servizi di "Lavora con me".

I testi tra parentesi quadre `[...]` sono segnaposto da riempire.

## Scrivere un post
Crea un file `.md` in `src/content/log/` (il nome file è l'URL). Il frontmatter ha `title`, `description`, `date` e `draft`. Con `draft: true` il post non è pubblicato. Vedi `come-scrivere-un-post.md`.

## Foto e copertina
Metti i file in `public/` (es. `public/foto.jpg`, `public/copertina.jpg`), poi in `src/config.ts` scrivi `foto: "/foto.jpg"` e `copertina: "/copertina.jpg"`.

## Pubblicare
1. Crea su GitHub il repo `darcangeloo.github.io`.
2. Fai il push del progetto sul branch `main`.
3. Settings > Pages > Source: GitHub Actions.

## Newsletter (Buttondown)
1. Crea l'account su buttondown.com e scegli uno username.
2. Scrivilo in `src/config.ts`, campo `buttondownUsername`.
3. In Buttondown, Settings > Automations > RSS: incolla `https://darcangeloo.github.io/rss.xml`. Ogni nuovo post diventa una mail.
