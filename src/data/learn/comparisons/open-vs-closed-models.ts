import type { Comparison } from "../../../lib/compare/types";

/** AI Engineer roadmap → Choosing the Right Model. */
export const openVsClosedModels: Comparison = {
  id: "open-vs-closed-models",
  title: "Closed APIs vs open weights, hosted or self-run",
  options: [
    {
      id: "closed",
      name: "Closed model API",
      summary: "You call the vendor's API. The weights never leave the vendor.",
    },
    {
      id: "open-hosted",
      name: "Open weights, hosted",
      summary: "Published weights served for you by an inference provider or cloud.",
    },
    {
      id: "open-self",
      name: "Open weights, self-hosted",
      summary: "You download the weights and run them on hardware you control.",
    },
  ],
  rows: [
    {
      criterion: "Examples",
      cells: {
        closed: "GPT from OpenAI, Claude from Anthropic, Gemini from Google.",
        "open-hosted": "Llama, Qwen, Mistral, DeepSeek, Gemma or gpt-oss on a provider such as Together AI or Amazon Bedrock.",
        "open-self": "The same model families run with vLLM or Ollama on your own GPUs or laptop.",
      },
    },
    {
      criterion: "Cost shape",
      cells: {
        closed: "Pay per token. Nothing to pay when idle.",
        "open-hosted": "Pay per token. Providers compete to serve the same weights, which keeps prices down.",
        "open-self": "Pay for hardware whether it is busy or not. Cheap per token only at high, steady use.",
      },
    },
    {
      criterion: "Where your data goes",
      cells: {
        closed: "To the vendor. Business API terms usually exclude training on your data, but logs may be kept for abuse checks.",
        "open-hosted": "To the provider, under its terms. Check retention and region.",
        "open-self": "Nowhere. Prompts stay on your machines, which suits strict privacy or air-gapped setups.",
      },
    },
    {
      criterion: "Quality ceiling",
      cells: {
        closed: "Usually the strongest models available.",
        "open-hosted": "Close behind on many tasks, and often strong for their size.",
        "open-self": "Limited by the size you can afford to run. Small, quantized models lose some quality.",
      },
    },
    {
      criterion: "Control and customisation",
      cells: {
        closed: "Prompting, plus whatever fine-tuning the vendor offers.",
        "open-hosted": "Some providers fine-tune or host your adapters.",
        "open-self": "Full: fine-tune, quantize, change sampling, inspect logits.",
      },
    },
    {
      criterion: "Stability over time",
      cells: {
        closed: "Models are updated and retired on the vendor's schedule. Pin dated versions and plan migrations.",
        "open-hosted": "The weights are fixed, but a provider can stop serving a model.",
        "open-self": "A downloaded model never changes unless you change it.",
      },
    },
    {
      criterion: "Operations",
      cells: {
        closed: "None beyond rate limits and outages.",
        "open-hosted": "None beyond rate limits and outages.",
        "open-self": "GPUs, serving, batching, scaling and upgrades are all yours.",
      },
    },
    {
      criterion: "Licence",
      cells: {
        closed: "Terms of service. No access to the weights.",
        "open-hosted": "The model's licence still applies. Some are Apache 2.0, others add use or scale limits.",
        "open-self": "Same as hosted. Read it before you ship: open weights do not always mean open source.",
      },
    },
  ],
  verdicts: [
    {
      option: "closed",
      pickWhen: [
        "You need the best available quality, tool use or long context today.",
        "Traffic is small or spiky, so paying per token beats paying for idle GPUs.",
        "You want to ship a prototype this week without running infrastructure.",
      ],
    },
    {
      option: "open-hosted",
      pickWhen: [
        "An open model is good enough and you want lower prices without running GPUs.",
        "You want a way out of one vendor: the same weights run on many providers, or later on your own.",
      ],
    },
    {
      option: "open-self",
      pickWhen: [
        "Data must not leave your network, or the system runs offline.",
        "Volume is high and steady enough to keep your hardware busy.",
        "You need full control: fine-tuning, custom decoding or a model that never changes.",
      ],
    },
  ],
  reviewed: "2026-11-02",
  sources: [
    { label: "OpenAI: data controls in the API", href: "https://developers.openai.com/api/docs/guides/your-data" },
    { label: "Open Source AI Definition", href: "https://opensource.org/ai/open-source-ai-definition" },
    { label: "Llama 3.1 Community License", href: "https://dev.meta.ai/llama/llama3_1/license" },
    { label: "vLLM documentation", href: "https://docs.vllm.ai/en/latest/" },
  ],
};
