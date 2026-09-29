---
title: "Ho chiuso la mia startup. Cosa ho imparato da Sentia"
description: "Ho costruito una piattaforma RAG completa per le PMI italiane prima di chiedermi se qualcuno ne avesse bisogno. Il 20 settembre 2026 l'ho chiusa."
date: 2026-10-28
draft: false
---

Il 20 settembre 2026 ho chiuso Sentia. Era un SaaS di intelligenza artificiale per le piccole e medie imprese italiane, e prometteva di ritrovare in pochi secondi qualunque documento o email aziendale facendo una domanda in linguaggio naturale.

## Cosa avevo costruito

Tecnicamente funzionava. Era una piattaforma RAG multi-tenant, cioè ogni azienda aveva i suoi dati separati da quelli delle altre. La ricerca era ibrida, perché combinava la ricerca vettoriale con quella full-text, così trovava sia i documenti simili per significato sia quelli che contenevano la parola esatta. Sotto c'erano Supabase per database e autenticazione, Vertex AI con Gemini per i modelli e Stripe per i pagamenti.

Per venderla ho mandato email a freddo e fatto chiamate a freddo ad aziende agroalimentari.

## Perché l'ho chiusa

Il motivo principale è che il problema non esisteva, o almeno non abbastanza. Ho chiesto a quattro persone che gestiscono aziende, tra cui mio padre, quanto tempo perdessero a cercare documenti. Tutti e quattro hanno risposto più o meno la stessa cosa, cioè che ci mettevano pochissimo. Nessuno aveva un dolore da pagare per togliersi.

Poi c'era il mercato, già saturo di concorrenti. Le chiamate a freddo non hanno portato a niente.

L'ultimo motivo, meno importante ma vero, è che la mia motivazione stava calando. Costruire qualcosa che nessuno chiede pesa.

## Cosa ho imparato

Ho perso tempo e soldi. In cambio ho imparato a costruire e mettere online una piattaforma completa, con autenticazione, pagamenti, dati separati per cliente e un sistema di ricerca che funziona.

Ma la lezione vera è un'altra. Avrei dovuto fare quelle quattro domande prima di scrivere la prima riga di codice, non dopo. Adesso, prima di costruire qualunque cosa, cerco prima persone reali che abbiano il problema e che siano disposte a pagare per risolverlo. Se non le trovo, non costruisco.
