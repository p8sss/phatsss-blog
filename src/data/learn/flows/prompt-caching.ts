import type { FlowDefinition } from "../../../lib/flow/types";

/** AI Engineer roadmap → Development Tools. */
export const promptCaching: FlowDefinition = {
  id: "prompt-caching",
  title: "A cache write, a cache hit, then a broken prefix",
  actors: [
    { id: "app", label: "Your app", sublabel: "builds prompts", kind: "server", col: 0, row: 0 },
    { id: "api", label: "Model API", sublabel: "runs the model", kind: "model", col: 1, row: 0 },
    { id: "cache", label: "Prompt cache", sublabel: "per workspace", kind: "cache", col: 1, row: 1 },
  ],
  steps: [
    {
      id: "order",
      from: "app",
      title: "Put stable content first",
      payload: "tools → system → docs → question",
      detail:
        "A cache hit needs an identical prefix, byte for byte. Anything that changes per request goes at the end.",
    },
    {
      id: "req1",
      from: "app",
      to: "api",
      title: "First request, with a cache breakpoint",
      payload: "cache_control on the docs block",
      detail: "The marker says: cache everything up to and including this block. Prefixes below a minimum length are not cached.",
    },
    {
      id: "lookup1",
      from: "api",
      to: "cache",
      title: "Look up the prefix",
      payload: "lookup hash(prefix)",
      detail: "The key is derived from the exact prefix content, for this model only.",
    },
    {
      id: "miss",
      from: "cache",
      to: "api",
      title: "Miss",
      payload: "miss",
      variant: "response",
      detail: "Nobody sent this prefix in the last few minutes.",
    },
    {
      id: "compute",
      from: "api",
      title: "Process the full prompt",
      payload: "prefill 50,000 tokens",
      detail:
        "The model reads every token and builds its internal state for them. For long prompts, this is most of the time before the first output token.",
    },
    {
      id: "write",
      from: "api",
      to: "cache",
      title: "Store the prefix state",
      payload: "write · TTL 5 min",
      detail:
        "What is cached is the model's computed state for the prefix, not the answer. On Anthropic a 5-minute write costs 1.25 times the base input price.",
    },
    {
      id: "usage1",
      from: "api",
      to: "app",
      title: "Answer, with usage",
      payload: "cache_creation: 50,000",
      variant: "response",
      detail: "The usage block shows tokens written to the cache separately from ordinary input tokens.",
    },
    {
      id: "req2",
      from: "app",
      to: "api",
      title: "Second request, new question",
      payload: "same prefix + new question",
      detail: "Only the end of the prompt is different. This is the shape a chat or an agent loop has on every turn.",
    },
    {
      id: "lookup2",
      from: "api",
      to: "cache",
      title: "Look up the prefix",
      payload: "lookup hash(prefix)",
      detail: "Same bytes, same model, same workspace, within the TTL.",
    },
    {
      id: "hit",
      from: "cache",
      to: "api",
      title: "Hit",
      payload: "hit: 50,000 tokens",
      variant: "response",
      detail: "The model skips the work for the prefix and processes only the new question. Each hit refreshes the TTL.",
    },
    {
      id: "usage2",
      from: "api",
      to: "app",
      title: "Faster and cheaper",
      payload: "cache_read: 50,000 · input: 30",
      variant: "response",
      detail:
        "Cache reads cost a small fraction of the input price: a tenth on many Claude models, a twentieth on Claude Opus 5.5 and Sonnet 5.5. The first token also arrives sooner.",
    },
    {
      id: "req3",
      from: "app",
      to: "api",
      title: "Third request, timestamp in the system prompt",
      payload: 'system: "Now: 10:42:07 …"',
      detail: "A tiny change near the start of the prompt. Everything after it is now a different prefix.",
    },
    {
      id: "broken",
      from: "api",
      title: "Pay full price again",
      payload: "prefix differs → miss",
      detail:
        "The cache matches from the start of the prompt, so one changed byte early on misses everything after it. Move the timestamp to the end.",
    },
  ],
};
