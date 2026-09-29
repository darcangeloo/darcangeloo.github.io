---
title: "Come scrivere un post"
description: "Istruzioni per Roberto: come creare e pubblicare un nuovo post del Log."
date: 2026-01-01
draft: true
---

Per creare un post, aggiungi un file `.md` nella cartella `src/content/log/`.

Il nome del file diventa l'indirizzo: `il-mio-primo-post.md` sarà `/log/il-mio-primo-post/`.

In cima al file metti il frontmatter, tra due righe `---`:

- `title`: il titolo del post.
- `description`: una frase, compare nell'elenco e nella mail.
- `date`: la data, nel formato `2026-03-15`.
- `draft`: `true` = bozza, non pubblicata. Per pubblicare, metti `false` oppure cancella la riga.

Sotto il frontmatter scrivi il testo in Markdown. Fai push su `main`: il sito si aggiorna da solo e la newsletter parte dal feed RSS.
