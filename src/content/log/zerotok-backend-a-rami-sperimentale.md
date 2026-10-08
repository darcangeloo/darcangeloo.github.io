---
title: "zerotok: backend a rami (sperimentale)"
description: "Questo aggiornamento aggiunge un secondo backend alla classificazione."
date: 2026-10-08
draft: false
---

Questo aggiornamento aggiunge un secondo backend alla classificazione. Invece di mettere le opzioni nel prompt come lettere, ogni opzione viene elaborata in un ramo separato: le scelte non si vedono tra loro e l'ordine non influisce sugli embedding. Il backbone è Qwen3-0.6B congelato, con una testa leggera (ChoiceHead) allenata sul dataset avbiswas/bev-decision.

Cosa è verificato:
- test di permutazione: cambiare l'ordine delle opzioni non cambia gli embedding (differenza sotto 1e-4 in float32);
- test di isolamento: cambiare un'opzione non modifica le altre;
- sulla validation (1000 esempi, solo inglese): 58,6% di accuratezza, contro 35,2% di una baseline a priori e 26,2% del caso;
- temperature scaling sulla validation per rendere le probabilità meno estreme.

Cosa non è ancora verificato:
- il confronto con il backend llama.cpp sugli stessi casi;
- la qualità su testi in italiano;
- il comportamento su domande con calcoli di date e prompt injection (in alcuni test il modello ha sbagliato con sicurezza).

Il backend è scelto con la variabile ZEROTOK_BACKEND=branching. La baseline llama.cpp resta quella di default.
