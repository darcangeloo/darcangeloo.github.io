---
nome: "GPT da zero"
sintesi: "Un transformer in stile GPT da circa 40.7M parametri, scritto da zero in PyTorch senza nn.MultiheadAttention né pesi preaddestrati, e addestrato su 500.000 storie di TinyStories con una RTX 5060 Laptop."
metrica: "~40.7M parametri · loss ~2.8"
tag: ["PyTorch", "Transformer", "TinyStories"]
repoUrl: "https://github.com/darcangeloo/RobGPT"
aggiornato: 2026-09-05
noindex: false
ordine: 2
---

## Cosa fa

RobGPT è un modello linguistico in stile GPT scritto interamente a mano in PyTorch. Non usa `nn.MultiheadAttention` e non parte da pesi preaddestrati. L'attenzione, il masking causale, il weight tying e il ciclo di training sono tutti implementati da zero. Il modello impara a generare brevi storie in inglese semplice dal dataset TinyStories.

L'obiettivo non era ottenere un modello utile, ma capire ogni pezzo di un transformer decoder-only scrivendolo, senza nasconderlo dietro una libreria.

## Come funziona

| Parametro | Valore |
|---|---|
| Tokenizer | GPT-2 (tiktoken), vocabolario 50.257 |
| Lunghezza di contesto | 256 |
| Dimensione embedding | 384 |
| Teste di attenzione | 12 (dimensione per testa 32) |
| Layer | 12 |
| Dropout | 0.1 |
| Weight tying | embedding dei token ↔ testa di output |
| Parametri totali | ~40.68M |

Il weight tying condivide la matrice degli embedding tra ingresso e uscita. Con un vocabolario da 50.257 token questa matrice è la parte più pesante del modello, quindi condividerla dimezza circa il costo degli embedding e costringe il modello a usare un unico spazio vettoriale sia per leggere i token sia per assegnare loro un punteggio.

Il training usa AdamW con learning rate costante 2e-4, batch da 8 sequenze da 128 token, 20.000 step e gradient clipping a 1.0. Il testo viene diviso 90/10 tra train e validazione. Ogni 100 step la loss di validazione è la media su 20 batch, perché su un solo batch era troppo rumorosa per dire qualcosa.

La generazione usa top-k sampling con temperatura.

## Risultati

- Dataset: 500.000 storie di TinyStories, circa 100-125M token.
- La loss si stabilizza intorno a 2.7-2.9 tra lo step 15.000 e lo step 18.000.
- Hardware: NVIDIA RTX 5060 Laptop, 8GB di VRAM.

Il plateau è quello che ci si aspetta con AdamW a learning rate costante. Senza uno schedule che abbassa il learning rate verso la fine, il modello smette di migliorare prima di aver sfruttato tutto il training.

## Limiti

- Nessuno schedule del learning rate (né warmup né cosine decay), quindi il plateau arriva presto.
- Addestrato su meno di un quarto di TinyStories (500.000 storie su oltre 2.1 milioni).
- Nessuna KV cache, quindi la generazione ricalcola tutto il contesto a ogni token.
- La valutazione è solo la loss. Non ci sono esempi di generazione pubblicati né confronti tra checkpoint.

## Riprodurre

```bash
pip install torch datasets tiktoken

python train.py    # addestra e salva gpt_trained.pth
python main.py     # carica il checkpoint e genera testo
```
