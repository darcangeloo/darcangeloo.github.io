// Elenco progetti. repoUrl e logUrl sono opzionali: se vuoti non compaiono.
export const PROJECTS = [
  {
    nome: "zerotok",
    metrica: "~23 ms/decisione · AG News 88.5%",
    descrizione: "Decisioni tipizzate da un LLM locale leggendo i logit, senza generare testo. Un solo forward pass per decisione, con prefix caching su llama.cpp.",
    tag: ["llama.cpp", "Qwen3-4B", "FastAPI"],
    repoUrl: "https://github.com/darcangeloo/[nome-repo]",
    logUrl: "",
  },
  {
    nome: "GPT da zero",
    metrica: "~40M parametri · loss ~2.8",
    descrizione: "Transformer in stile GPT scritto e addestrato da zero sul dataset TinyStories.",
    tag: ["PyTorch"],
    repoUrl: "https://github.com/darcangeloo/RobGPT",
    logUrl: "",
  },
  {
    nome: "RobThiel",
    metrica: "eval loss 1.57 → 1.30 · 920 esempi",
    descrizione: "Fine-tuning QLoRA di Qwen2.5-7B-Instruct su un dataset di startup e marketing ispirato a Zero to One. Pipeline completa, dai dati alla valutazione.",
    tag: ["QLoRA", "Qwen2.5-7B"],
    repoUrl: "https://github.com/darcangeloo/RobThiel",
    logUrl: "",
  },
];
