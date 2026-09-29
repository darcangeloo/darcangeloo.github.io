---
nome: "zerotok"
sintesi: "Decisioni tipizzate da un LLM locale leggendo i logit, senza generare testo. Un solo forward pass per decisione, con prefix caching su llama.cpp."
metrica: "~44 ms/decisione con cache · AG News 88.5%"
tag: ["llama.cpp", "Qwen3-4B", "FastAPI"]
repoUrl: "https://github.com/darcangeloo/zerotok"
aggiornato: 2026-09-26
ordine: 1
---

## Cosa fa

zerotok (in precedenza RobSort) ottiene decisioni tipizzate da un LLM locale leggendo i logit, senza generare testo.

Esempio di richiesta:

```powershell
curl -X POST http://127.0.0.1:8000/v1/decisions `
  -H "Content-Type: application/json" `
  -d '{"state":"Il cliente scrive: il pacco e arrivato danneggiato e vuole un rimborso urgente entro oggi.","decisions":[{"name":"urgenza","options":["Alta","Media","Bassa"]},{"name":"sentiment","options":["Negativo","Neutro","Positivo"]}]}'
```

Risposta:

```json
{
  "decisions": [
    {
      "name": "urgenza",
      "choice": "Alta",
      "probs": {"Alta": 0.9999999998, "Media": 0.0000000001, "Bassa": 0.0000000000},
      "latency_ms": 156.3
    },
    {
      "name": "sentiment",
      "choice": "Negativo",
      "probs": {"Negativo": 0.9999999999, "Positivo": 0.0000000000, "Neutro": 0.0000000000},
      "latency_ms": 45.4
    }
  ],
  "total_ms": 201.7
}
```

## Come funziona

Ogni decisione costa un solo forward pass, invece di generare un token alla volta: il modello gira con `max_tokens: 1`, quindi non viene prodotto testo. Il prompt viene elaborato in parallelo da llama.cpp e vengono letti solo i logit delle lettere ammesse come opzioni (A, B, C...), trasformati in probabilità con softmax. Il documento è messo prima delle istruzioni nel prompt, così le decisioni ripetute sullo stesso documento condividono un prefisso identico. Il prefix caching è una funzionalità di llama.cpp; il contributo di questo progetto è progettare il prompt per sfruttarla e misurarne l'effetto.

## Risultati

### Latenza (Qwen2.5-1.5B-Instruct)

Stesso prompt da 110 token, mediana di 20 richieste dopo il warm-up:

| Configurazione | Latenza mediana |
|---|---|
| transformers bf16, in-process, GPU | 45.3 ms |
| llama.cpp, calcolo lato server | 20.5 ms |
| llama.cpp, end-to-end via HTTP | 36.2 ms |

I valori di 20.5 ms e 36.2 ms sono stati misurati con Qwen2.5-1.5B-Instruct e una versione precedente di `bench_latency.py`; rieseguendolo si ottiene lo stesso metodo e numeri dello stesso ordine di grandezza, non identici. Il valore di 45.3 ms di transformers è stato misurato con uno script separato che non è incluso in questo repo. La versione precedente del progetto girava per errore su CPU (torch senza CUDA), quindi gran parte del salto rispetto a quella vecchia versione deriva dalla correzione di questo errore, non dal cambio di runtime. A parità di GPU, il guadagno del runtime è circa 2x sul calcolo e circa 20% end-to-end.

### Accuratezza, zero-shot (Qwen3-4B-Instruct-2507 Q8_0)

- SST-2: 88.0% (100 esempi bilanciati dallo split di validazione)
- AG News: 88.5%, macro F1 0.885 (200 esempi bilanciati dallo split di test)

Gli errori su AG News si concentrano tra Business e Sci/Tech.

### Prefix caching (Qwen3-4B), 20 documenti x 4 decisioni

| Documento | Prima decisione | Decisioni successive |
|---|---|---|
| Lungo (~500 token) | 188.8 ms end-to-end (130.3 ms lato server) | 44.4 ms end-to-end (23.5 ms lato server) |
| Corto (~80 token) | 50.4 ms | 42.3 ms |

Il costo delle decisioni successive non dipende dalla lunghezza del documento: 10 decisioni su un documento da 500 token richiedono circa 590 ms invece di circa 1.9 s.

### Hardware

Laptop RTX 5060 8GB, i7-14650HX, 16GB di RAM.

## Limiti

- Le probabilità sono troppo sicure di sé, vicine a 0 o a 1 anche sulle risposte sbagliate: non usarle come confidenza calibrata.
- L'accuratezza cala con etichette sovrapposte o ambigue: su un set interno di 45 ticket di supporto l'accuratezza è stata 51-60% a seconda dei nomi e dell'ordine delle classi, con un bias sistematico verso la severità alta.
- Il modello da 1.5B ha mostrato un bias di posizione verso l'opzione A.
- Slot singolo (`-np 1`): client concorrenti su documenti diversi si invalidano a vicenda la cache.
- Circa 23 ms lato server sono il minimo per decisione con questo modello e questa GPU; circa 20 ms sono overhead di HTTP e Python.
- La calibrazione contestuale è stata provata e non ha avuto effetto.

## Riprodurre

Avvio (Windows, PowerShell):

```powershell
winget install ggml.llamacpp
.\start_server.ps1
```

In un altro terminale:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app:app
```

Apri [http://127.0.0.1:8000](http://127.0.0.1:8000). Poi:

```powershell
python -m src.prepare_data
python -m src.evaluation data/sst2.json
python -m src.evaluation data/agnews.json
python bench_cache.py
python bench_latency.py
```

`bench_latency.py` è confrontabile con i valori 20.5 ms / 36.2 ms sopra solo se il server viene avviato con Qwen2.5-1.5B-Instruct Q8_0 invece del modello da 4B.
