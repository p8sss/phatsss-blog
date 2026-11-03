import type { Comparison } from "../../../lib/compare/types";

/** AI Engineer roadmap → What are RAGs?. */
export const ragVsFineTuning: Comparison = {
  id: "rag-vs-fine-tuning",
  title: "RAG vs fine-tuning",
  options: [
    {
      id: "rag",
      name: "RAG",
      summary: "Retrieve relevant passages at request time and put them in the prompt.",
    },
    {
      id: "fine-tuning",
      name: "Fine-tuning",
      summary: "Train the model further on your own examples so its weights change.",
    },
  ],
  rows: [
    {
      criterion: "What changes",
      cells: {
        rag: "The prompt. The model stays the same; each request carries the text it needs.",
        "fine-tuning": "The model. Training adjusts its weights, or a small adapter such as LoRA.",
      },
    },
    {
      criterion: "Best at teaching",
      cells: {
        rag: "Knowledge: product docs, policies, tickets, anything private or recent.",
        "fine-tuning": "Behaviour: an output format, a tone, a narrow task, a label set.",
      },
    },
    {
      criterion: "When the facts change",
      cells: {
        rag: "Re-index the changed document. The next request sees it.",
        "fine-tuning": "Collect data, retrain, evaluate and redeploy. Facts learned in training go stale.",
      },
    },
    {
      criterion: "Citations",
      cells: {
        rag: "Natural. The answer can point at the passages that were retrieved.",
        "fine-tuning": "Not possible. The model cannot say which training example a fact came from.",
      },
    },
    {
      criterion: "Typical failure",
      cells: {
        rag: "Retrieval misses the right chunk, so the model answers without it or guesses.",
        "fine-tuning": "The model blends or invents facts it saw only a few times in training.",
      },
    },
    {
      criterion: "Who may see what",
      cells: {
        rag: "Filter retrieval by the caller's permissions on every request.",
        "fine-tuning": "Anything in the training data can surface for any user of that model.",
      },
    },
    {
      criterion: "Cost shape",
      cells: {
        rag: "Ongoing: embeddings, a vector index, and longer prompts on every call.",
        "fine-tuning": "Up front: curated examples, training runs and evals. Prompts can then be shorter.",
      },
    },
    {
      criterion: "Where you can use it",
      cells: {
        rag: "With any model, hosted or local. It is application code.",
        "fine-tuning":
          "Depends on the provider. OpenAI is winding down its fine-tuning platform and no longer accepts new users. Open-weight models can be tuned yourself.",
      },
    },
  ],
  verdicts: [
    {
      option: "rag",
      pickWhen: [
        "Answers must come from documents that change, or that the model never saw.",
        "Users need citations they can check.",
        "Different users may see different documents.",
      ],
    },
    {
      option: "fine-tuning",
      pickWhen: [
        "Prompting with examples still cannot hold a strict format or style.",
        "You want a smaller, cheaper model to match a larger one on one narrow task.",
        "Your prompts carry so many examples that they cost too much on every call.",
      ],
    },
  ],
  reviewed: "2026-11-02",
  sources: [
    {
      label: "Lewis et al., Retrieval-Augmented Generation (2020)",
      href: "https://arxiv.org/abs/2005.11401",
    },
    {
      label: "OpenAI model optimization guide",
      href: "https://developers.openai.com/api/docs/guides/model-optimization",
    },
    { label: "Hugging Face PEFT documentation", href: "https://huggingface.co/docs/peft/index" },
  ],
};
