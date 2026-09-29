---
nome: "RobThiel"
sintesi: "Esperimento didattico di fine-tuning QLoRA su Qwen2.5-7B-Instruct, con un dataset di startup e marketing ispirato a Zero to One. Raddoppiando i dati la eval loss è scesa da 1.57 a 1.30, su una GPU laptop da 8GB."
metrica: "eval loss 1.57 → 1.30 · 920 esempi"
tag: ["QLoRA", "Qwen2.5-7B", "PEFT"]
repoUrl: "https://github.com/darcangeloo/Rob-Thiel"
aggiornato: 2026-09-16
noindex: false
ordine: 3
---

## Cosa fa

RobThiel è un fine-tuning QLoRA di Qwen2.5-7B-Instruct su coppie istruzione-risposta di startup, marketing e positioning. Il nome viene da *Zero to One* di Peter Thiel.

Non è pensato per dare consigli di business reali. L'obiettivo era imparare la pipeline di fine-tuning dall'inizio alla fine, cioè preparare i dati, quantizzare il modello a 4 bit, configurare LoRA, addestrare monitorando la loss di validazione e confrontare il modello base con quello addestrato. Il criterio di successo è che la pipeline funzioni e produca un cambiamento misurabile nel comportamento del modello.

## Come funziona

- **Modello base**: Qwen2.5-7B-Instruct, caricato in 4 bit NF4 con double quantization e calcolo in bfloat16 (`bitsandbytes`).
- **LoRA**: `r=16`, `lora_alpha=16`, dropout 0.1, applicato alle proiezioni di attenzione `q_proj`, `k_proj`, `v_proj` e `o_proj`.
- **Training**: `SFTTrainer` di `trl`, loss calcolata solo sulla risposta dell'assistente, batch effettivo 12 (1 × 12 di gradient accumulation), gradient checkpointing per stare negli 8GB di VRAM.
- **Dati**: formato Alpaca, generati con assistenza di un LLM a partire da temi scelti a mano e controllati a campione. Il dataset di startup copre otto sotto-temi bilanciati, cioè fundraising, product-market fit, hiring, stack tecnico, equity, metriche, scaling e build-vs-buy.
- **Split**: 85% train e 15% validazione, con seed fisso.

## Risultati

| Run | Esempi | eval_loss | eval_mean_token_accuracy |
|---|---|---|---|
| 1 | ~460 | 1.567 | 0.634 |
| 2 | ~920 | 1.295 | 0.689 |

Nella prima run la eval loss scende in modo monotono per tutte e 3 le epoche, da 2.21 allo step 10 a 1.567 alla fine, ed era ancora in discesa. Il segnale era che il modello poteva imparare di più, quindi nella seconda run ho raddoppiato i dati.

Hardware: NVIDIA RTX 5060 Laptop, 8GB di VRAM.

## Limiti

- Il confronto è tra due mie run, non con il modello base. Una eval loss più bassa dice che il modello imita meglio lo stile del dataset, non che dia consigli migliori.
- Poche centinaia di esempi, generati con assistenza di un LLM, quindi il modello riflette soprattutto lo stile del dataset più che un ragionamento originale.
- Nessuna valutazione umana estesa, solo test manuali su singole domande.
- Non è uno strumento per l'uso in produzione o per decisioni di business.

## Riprodurre

```bash
git clone https://github.com/darcangeloo/Rob-Thiel
cd Rob-Thiel
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt

python train.py       # training
python inference.py   # prova del modello addestrato
```

Qwen2.5-7B-Instruct non è un modello gated, quindi basta un normale token Hugging Face.
