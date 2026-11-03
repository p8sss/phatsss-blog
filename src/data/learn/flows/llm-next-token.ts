import type { FlowDefinition } from "../../../lib/flow/types";

/** AI Engineer roadmap → How LLMs Work. */
export const llmNextToken: FlowDefinition = {
  id: "llm-next-token",
  title: "One chat completion, one token at a time",
  actors: [
    { id: "app", label: "Your app", sublabel: "API client", kind: "client", col: 0, row: 0 },
    { id: "tokenizer", label: "Tokenizer", sublabel: "text ↔ token ids", kind: "service", col: 1, row: 0 },
    { id: "model", label: "Transformer", sublabel: "the weights", kind: "model", col: 2, row: 0 },
    { id: "kv", label: "KV cache", sublabel: "per request", kind: "cache", col: 1, row: 1 },
    { id: "sampler", label: "Sampler", sublabel: "picks next token", kind: "service", col: 2, row: 1 },
  ],
  steps: [
    {
      id: "send",
      from: "app",
      to: "tokenizer",
      title: "Send the messages",
      payload: "messages: [system, user]",
      detail:
        "The API receives structured messages, not raw text. A chat template turns them into one string with special tokens that mark each role.",
    },
    {
      id: "tokenize",
      from: "tokenizer",
      title: "Split the text into tokens",
      payload: "\"Capital of France?\" → 4 ids",
      detail:
        "A subword tokenizer, often byte-pair encoding, maps text to integer ids from a fixed vocabulary. Common words are one token. Rare words split into pieces.",
    },
    {
      id: "feed",
      from: "tokenizer",
      to: "model",
      title: "Feed the prompt ids",
      payload: "ids[0..n]",
      detail:
        "Each id is looked up in an embedding table and becomes a vector. The model only ever sees these vectors, never letters.",
    },
    {
      id: "prefill",
      from: "model",
      title: "Prefill: run every layer",
      payload: "attention + MLP × N layers",
      detail:
        "All prompt tokens go through the layers in parallel. Attention lets each token mix in information from the tokens before it, never after.",
    },
    {
      id: "cache",
      from: "model",
      to: "kv",
      title: "Keep the keys and values",
      payload: "K, V for every prompt token",
      detail:
        "Each layer stores its attention keys and values. Later steps reuse them instead of recomputing the whole prompt.",
    },
    {
      id: "logits",
      from: "model",
      to: "sampler",
      title: "Score every possible next token",
      payload: "logits[vocab_size]",
      detail:
        "The last position's output becomes one raw score per vocabulary entry. That is the model's whole answer: a ranking of what could come next.",
    },
    {
      id: "shape",
      from: "sampler",
      title: "Apply temperature and top-p",
      payload: "softmax(logits / 0.7)",
      detail:
        "Dividing by the temperature sharpens or flattens the scores, and softmax turns them into probabilities. Top-p then drops the unlikely tail.",
    },
    {
      id: "pick",
      from: "sampler",
      title: "Sample one token",
      payload: "\" Paris\"  p = 0.93",
      detail:
        "A random draw picks one token by its probability. With temperature near 0 this becomes greedy: always the top token.",
    },
    {
      id: "decode",
      from: "sampler",
      to: "tokenizer",
      title: "Turn the id back into text",
      payload: "id 12366 → \" Paris\"",
      detail: "Detokenizing one id gives a text fragment. Some fragments are only part of a word or a multi-byte character.",
    },
    {
      id: "stream",
      from: "tokenizer",
      to: "app",
      title: "Stream the fragment",
      payload: "delta: \" Paris\"",
      variant: "response",
      detail: "With streaming on, each fragment is sent as soon as it exists. That is why answers appear word by word.",
    },
    {
      id: "append",
      from: "sampler",
      to: "model",
      title: "Feed the new token back in",
      payload: "next input: [12366]",
      detail:
        "The chosen token becomes the next input. Generation is a loop: one forward pass per output token.",
    },
    {
      id: "reuse",
      from: "kv",
      to: "model",
      title: "Reuse the cached context",
      payload: "K, V for n tokens",
      variant: "response",
      detail:
        "Only the new token runs through the layers. It attends to the cached keys and values, so each decode step is cheap compared with the prefill.",
    },
    {
      id: "stop",
      from: "sampler",
      title: "Stop at an end token",
      payload: "<eos> or max_tokens",
      detail:
        "The loop ends when the model samples its end-of-turn token or the output limit is reached. A stop sequence from the request also ends it.",
    },
    {
      id: "finish",
      from: "tokenizer",
      to: "app",
      title: "Report why it stopped",
      payload: "finish_reason: \"stop\"",
      variant: "response",
      detail:
        "The final chunk says why generation ended. Most APIs also report token usage at the end of the stream. A length stop means the answer was cut off.",
    },
  ],
};
