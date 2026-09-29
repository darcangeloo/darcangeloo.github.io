---
title: "Decisioni da un LLM in 44 ms, senza generare testo"
description: "Come zerotok legge i logit di un LLM locale invece di farlo scrivere, cosa ha misurato il prefix caching e dove il metodo non funziona."
date: 2026-09-30
draft: false
---

Quando si usa un LLM per classificare qualcosa, di solito gli si chiede di rispondere con una parola e poi si legge il testo generato. Funziona, ma è lento, perché il modello genera un token alla volta. Con zerotok ho provato a non farlo scrivere per niente.

## L'idea

Le opzioni vengono etichettate con delle lettere, A, B, C. Il modello fa un solo forward pass con `max_tokens: 1`, e invece di guardare cosa scriverebbe leggo direttamente i logit delle lettere ammesse. Una softmax su quei logit mi dà una probabilità per ogni opzione. Nessun testo viene generato.

Una richiesta tipo è "il pacco è arrivato danneggiato e il cliente vuole un rimborso urgente entro oggi", con due decisioni da prendere, urgenza (Alta, Media, Bassa) e sentiment (Negativo, Neutro, Positivo). zerotok risponde Alta e Negativo, con le probabilità di ogni opzione e la latenza di ciascuna decisione.

## Il trucco del prefisso

Nel prompt ho messo il documento prima delle istruzioni. In questo modo, se faccio più decisioni sullo stesso documento, tutti i prompt iniziano con lo stesso prefisso, e llama.cpp può riusare il lavoro già fatto grazie al prefix caching. Il prefix caching è una funzione di llama.cpp, non una mia invenzione. Il mio contributo è stato progettare il prompt per sfruttarlo e misurare quanto conta.

Con Qwen3-4B, su un documento lungo circa 500 token, la prima decisione costa 188.8 ms end-to-end. Le successive costano 44.4 ms, di cui 23.5 ms di calcolo sul server. Il costo delle decisioni successive non dipende più dalla lunghezza del documento, quindi 10 decisioni su quel documento richiedono circa 590 ms invece di circa 1.9 secondi.

## Un errore che mi ha fatto sembrare più bravo

La prima versione del progetto girava su CPU senza che me ne accorgessi, perché avevo installato torch senza CUDA. Quando sono passato a llama.cpp la latenza è crollata, e sembrava tutto merito del cambio di runtime. Non era così. Rifacendo il confronto a parità di GPU, llama.cpp è circa 2 volte più veloce sul calcolo ma solo circa il 20% più veloce end-to-end. La maggior parte del salto veniva dall'aver sistemato l'errore.

## Quanto è preciso

In zero-shot, con Qwen3-4B, ho misurato l'88.0% su SST-2 (100 esempi bilanciati) e l'88.5% su AG News (200 esempi bilanciati, macro F1 0.885). Su AG News gli errori si concentrano tra Business e Sci/Tech.

## Dove non funziona

Questa è la parte più importante.

- Le probabilità sono troppo sicure di sé. Sono vicine a 0 o a 1 anche quando la risposta è sbagliata, quindi non si possono usare come misura di confidenza. Ho provato la calibrazione contestuale e non ha cambiato niente.
- Con etichette ambigue o sovrapposte l'accuratezza crolla. Su un mio set di 45 ticket di assistenza ho ottenuto tra il 51% e il 60%, a seconda dei nomi e dell'ordine delle classi, con una tendenza sistematica a scegliere la severità più alta.
- Il modello più piccolo, da 1.5B parametri, preferiva l'opzione A a prescindere.

Il codice e tutti i benchmark sono su [GitHub](https://github.com/darcangeloo/zerotok).
