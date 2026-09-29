---
title: "Un GPT da 40 milioni di parametri scritto da zero: cosa ho imparato"
description: "Ho scritto a mano attenzione, masking causale e ciclo di training di un piccolo GPT e l'ho addestrato su TinyStories con una GPU da laptop. Tre cose che non avrei capito leggendo e basta."
date: 2026-10-14
draft: false
---

RobGPT è un piccolo modello in stile GPT, circa 40.7 milioni di parametri, che ho scritto da zero in PyTorch. Non ho usato `nn.MultiheadAttention` e non sono partito da pesi preaddestrati. L'ho addestrato su 500.000 storie del dataset TinyStories con una RTX 5060 Laptop da 8GB.

Non volevo un modello utile. Volevo capire ogni pezzo di un transformer scrivendolo io. Tre cose le ho capite davvero solo così.

## 1. Il weight tying non è un dettaglio

Con il tokenizer di GPT-2 il vocabolario ha 50.257 token. La matrice degli embedding e quella della testa di output hanno quindi 50.257 righe ciascuna, e in un modello così piccolo sono la parte più pesante. Condividendo la stessa matrice tra ingresso e uscita il costo degli embedding si dimezza circa. C'è anche un effetto meno ovvio, perché il modello è costretto a usare un unico spazio vettoriale sia per leggere un token sia per decidere quanto è probabile come prossimo token.

## 2. Una loss di validazione su un solo batch non dice niente

All'inizio calcolavo la loss di validazione su un solo batch, e il numero saltava su e giù da un controllo all'altro. Non riuscivo a capire se il modello stesse migliorando. Adesso ogni 100 step faccio la media su 20 batch, e la curva è diventata leggibile. A questa scala una stima rumorosa della validazione è quasi peggio di nessuna stima, perché ti fa prendere decisioni sbagliate.

## 3. Il plateau non era un bug

Tra lo step 15.000 e lo step 18.000 la loss si è fermata intorno a 2.7-2.9. Sembra un errore, ma non lo è. Stavo usando AdamW con un learning rate costante, e senza uno schedule che lo abbassa verso la fine il modello smette di migliorare prima del tempo. È il comportamento atteso.

## Cosa farei diversamente

- Un warmup e un cosine decay del learning rate, che è la prima cosa da provare contro il plateau.
- Il dataset completo, più di 2.1 milioni di storie invece di 500.000.
- La KV cache, perché adesso la generazione ricalcola tutto il contesto a ogni token.
- Pubblicare esempi di testo generato a checkpoint diversi. Una loss da sola dice poco a chi legge.

Il codice è su [GitHub](https://github.com/darcangeloo/RobGPT).
