import type { Comparison } from "../../../lib/compare/types";

/** AI Engineer roadmap → Prompt Engineering. */
export const promptingTechniques: Comparison = {
  id: "prompting-techniques",
  title: "Zero-shot vs few-shot vs chain of thought",
  options: [
    { id: "zero-shot", name: "Zero-shot", summary: "Clear instructions and the input, with no examples." },
    { id: "few-shot", name: "Few-shot", summary: "Instructions plus a handful of worked input and output examples." },
    {
      id: "cot",
      name: "Chain of thought",
      summary: "The model reasons step by step before it gives the final answer.",
    },
  ],
  rows: [
    {
      criterion: "What you write",
      cells: {
        "zero-shot": "The task, the constraints and the output format, stated plainly.",
        "few-shot": "The same instructions, then a few examples, ideally wrapped in tags so they are not mistaken for instructions.",
        cot: "A request to reason first and answer last, or a reasoning model with thinking turned on.",
      },
    },
    {
      criterion: "Best for",
      cells: {
        "zero-shot": "Common tasks the model already does well: summaries, translation, simple extraction.",
        "few-shot": "A precise format, tone or labelling scheme that is easier to show than to describe.",
        cot: "Multi-step problems: maths, logic, planning, debugging, questions that combine several facts.",
      },
    },
    {
      criterion: "Token cost",
      cells: {
        "zero-shot": "Lowest.",
        "few-shot": "Higher input on every call. Prompt caching softens this when the examples never change.",
        cot: "Higher output. Reasoning tokens are billed even when you do not show them.",
      },
    },
    {
      criterion: "Latency",
      cells: {
        "zero-shot": "Fastest.",
        "few-shot": "Slightly slower, from the longer prompt.",
        cot: "Slowest. The answer waits until the reasoning is written.",
      },
    },
    {
      criterion: "Main risk",
      cells: {
        "zero-shot": "Vague instructions give inconsistent formats and guesses.",
        "few-shot": "The model copies surface details of the examples. Too-similar examples narrow its output.",
        cot: "Reasoning can sound convincing and still be wrong. Long reasoning can also overthink simple tasks.",
      },
    },
    {
      criterion: "With reasoning models",
      cells: {
        "zero-shot": "Usually the best starting point. Vendors suggest trying no examples first.",
        "few-shot": "Still useful for output format. Examples must agree with the instructions.",
        cot: "Built in. Asking for step-by-step reasoning is unnecessary and can make results worse.",
      },
    },
    {
      criterion: "Getting the answer out",
      cells: {
        "zero-shot": "Ask for a fixed format, or use structured outputs.",
        "few-shot": "The examples show the format, so parsing is reliable.",
        cot: "Ask for the final answer in a tag such as <answer>, or read the separate thinking block.",
      },
    },
  ],
  verdicts: [
    {
      option: "zero-shot",
      pickWhen: [
        "The task is common and the instructions can be stated clearly.",
        "You use a reasoning model and want a baseline before adding anything.",
        "Cost and latency matter more than squeezing out the last few points of accuracy.",
      ],
    },
    {
      option: "few-shot",
      pickWhen: [
        "Outputs must match an exact format, style or set of labels.",
        "Instructions alone keep producing the wrong shape of answer.",
        "You can collect three to five diverse, correct examples from real data.",
      ],
    },
    {
      option: "cot",
      pickWhen: [
        "The task needs several dependent steps and a wrong step ruins the answer.",
        "You can afford more output tokens and latency for accuracy.",
        "Your model has built-in thinking: turn it on rather than writing step-by-step instructions.",
      ],
    },
  ],
  reviewed: "2026-11-02",
  sources: [
    {
      label: "Claude prompting best practices",
      href: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
    },
    {
      label: "OpenAI reasoning best practices",
      href: "https://developers.openai.com/api/docs/guides/reasoning-best-practices",
    },
    { label: "Wei et al., Chain-of-Thought Prompting (2022)", href: "https://arxiv.org/abs/2201.11903" },
    { label: "Brown et al., Language Models are Few-Shot Learners (2020)", href: "https://arxiv.org/abs/2005.14165" },
  ],
};
