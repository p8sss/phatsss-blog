import type { FlowDefinition } from "../../../lib/flow/types";

/** AI Engineer roadmap → What are RAGs? */
export const ragRequest: FlowDefinition = {
  id: "rag-request",
  title: "Ingest once, then answer a question with citations",
  actors: [
    { id: "user", label: "User", sublabel: "chat UI", kind: "client", col: 0, row: 0 },
    { id: "app", label: "RAG service", sublabel: "your backend", kind: "server", col: 1, row: 0 },
    { id: "llm", label: "LLM", sublabel: "generator", kind: "model", col: 2, row: 0 },
    { id: "ingest", label: "Ingest job", sublabel: "chunk + embed", kind: "queue", col: 0, row: 1 },
    { id: "index", label: "Vector index", sublabel: "chunks + vectors", kind: "database", col: 1, row: 1 },
    { id: "reranker", label: "Reranker", sublabel: "cross-encoder", kind: "model", col: 2, row: 1 },
  ],
  steps: [
    {
      id: "chunk",
      from: "ingest",
      title: "Split documents into chunks",
      payload: "~500 tokens, small overlap",
      detail:
        "Chunking happens offline, before any question. Split on headings and paragraphs where you can, so each chunk holds one idea.",
    },
    {
      id: "upsert",
      from: "ingest",
      to: "index",
      title: "Embed and index each chunk",
      payload: "{ vector, text, doc, page }",
      detail:
        "Store the source document and location with every chunk. Without them there is nothing to cite later.",
    },
    {
      id: "ask",
      from: "user",
      to: "app",
      title: "Ask a question",
      payload: "\"What is our refund window?\"",
      detail: "Everything from here runs per request, so every step adds latency.",
    },
    {
      id: "embed-q",
      from: "app",
      title: "Embed the question",
      payload: "same model as the chunks",
      detail: "The question must use the same embedding model as the chunks, or the vectors cannot be compared.",
    },
    {
      id: "retrieve",
      from: "app",
      to: "index",
      title: "Retrieve candidates",
      payload: "top 20 by similarity + filter",
      detail:
        "Retrieval is tuned for recall: fetch more than you need. Many systems also run a keyword search and merge both lists, which catches exact names and codes.",
    },
    {
      id: "candidates",
      from: "index",
      to: "app",
      title: "Candidates come back",
      payload: "20 chunks with ids",
      variant: "response",
      detail: "Vector similarity is fast but rough. Some of these are only loosely related.",
    },
    {
      id: "rerank",
      from: "app",
      to: "reranker",
      title: "Rerank against the question",
      payload: "(question, chunk) × 20",
      detail:
        "A cross-encoder reads the question and each chunk together and scores relevance. It is slower than vector search, so it only sees the short list.",
    },
    {
      id: "best",
      from: "reranker",
      to: "app",
      title: "Keep the best few",
      payload: "top 4 by relevance",
      variant: "response",
      detail: "Fewer, better chunks leave less noise in the prompt and cost fewer tokens.",
    },
    {
      id: "prompt",
      from: "app",
      title: "Build the prompt",
      payload: "[1] refunds.md … + question",
      detail:
        "Each chunk gets a number and its source. The instructions say to answer only from these sources and to say so when they do not cover the question.",
    },
    {
      id: "generate",
      from: "app",
      to: "llm",
      title: "Generate a grounded answer",
      payload: "answer from [1] to [4] only",
      detail: "Generation is the only step that uses the large model. Retrieval quality caps answer quality.",
    },
    {
      id: "answer",
      from: "llm",
      to: "app",
      title: "Answer with citations",
      payload: "\"30 days from delivery [1]\"",
      variant: "response",
      detail: "The model cites the numbered sources it used.",
    },
    {
      id: "verify",
      from: "app",
      title: "Check the citations",
      payload: "[1] was retrieved? ✓",
      detail:
        "Code, not the model, maps each marker back to a real chunk and drops markers that point nowhere. A citation proves where text came from, not that the claim is right.",
    },
    {
      id: "show",
      from: "app",
      to: "user",
      title: "Show the answer and its sources",
      payload: "30 days · refunds.md §2",
      variant: "response",
      detail: "Links to the source let the user check the answer themselves.",
    },
  ],
};
