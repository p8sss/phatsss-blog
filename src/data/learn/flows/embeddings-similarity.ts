import type { FlowDefinition } from "../../../lib/flow/types";

/** AI Engineer roadmap → What are Embeddings. */
export const embeddingsSimilarity: FlowDefinition = {
  id: "embeddings-similarity",
  title: "Two sentences, two vectors, one similarity score",
  actors: [
    { id: "app", label: "Your app", sublabel: "indexer + search", kind: "client", col: 0, row: 0 },
    { id: "model", label: "Embedder", sublabel: "embedding model", kind: "model", col: 1, row: 0 },
    { id: "store", label: "Vector store", sublabel: "text + vectors", kind: "database", col: 1, row: 1 },
  ],
  steps: [
    {
      id: "send-doc",
      from: "app",
      to: "model",
      title: "Embed a stored sentence",
      payload: "\"How do I reset my password?\"",
      detail: "Documents are embedded ahead of time, once, when they are indexed.",
    },
    {
      id: "tokenize",
      from: "model",
      title: "Tokenize",
      payload: "[how, do, i, reset, my, …]",
      detail: "The text becomes token ids, exactly as it would for a chat model.",
    },
    {
      id: "encode",
      from: "model",
      title: "Run the encoder",
      payload: "one vector per token",
      detail:
        "Every layer mixes context into each token, so \"reset\" here means a password reset, not a factory reset.",
    },
    {
      id: "pool",
      from: "model",
      title: "Pool into one vector",
      payload: "mean of tokens → 768 floats",
      detail:
        "The token vectors are combined into one fixed-size vector, by averaging or by taking one special position. The size depends on the model, not on the text length.",
    },
    {
      id: "normalize",
      from: "model",
      title: "Scale it to length 1",
      payload: "v / ‖v‖",
      detail:
        "Many embedding models return unit-length vectors. Then direction is all that matters, and cosine similarity is a plain dot product.",
    },
    {
      id: "vector",
      from: "model",
      to: "app",
      title: "Return the embedding",
      payload: "[0.021, -0.113, 0.064, …]",
      variant: "response",
      detail: "No single number means anything on its own. Meaning lives in the position relative to other vectors.",
    },
    {
      id: "store-it",
      from: "app",
      to: "store",
      title: "Store it next to the text",
      payload: "INSERT (id, text, embedding)",
      detail: "Keep the original text and the model name with each vector. You need the text to show results and the model name to re-embed later.",
    },
    {
      id: "send-query",
      from: "app",
      to: "model",
      title: "Embed the user's query",
      payload: "\"forgot my login\"",
      detail:
        "The query must go through the same model. Vectors from two different models live in unrelated spaces and cannot be compared.",
    },
    {
      id: "query-vector",
      from: "model",
      to: "app",
      title: "Return the query vector",
      payload: "[0.018, -0.097, 0.071, …]",
      variant: "response",
      detail:
        "The two texts share no key words, yet the vectors point in nearly the same direction. Training on pairs of related texts pulled them together.",
    },
    {
      id: "search",
      from: "app",
      to: "store",
      title: "Find the closest stored vectors",
      payload: "ORDER BY embedding <=> $1",
      detail: "This pgvector query sorts rows by cosine distance to the query vector, nearest first.",
    },
    {
      id: "score",
      from: "store",
      title: "Score by cosine similarity",
      payload: "cos(a, b) = a · b = 0.83",
      detail:
        "Cosine similarity is 1 for the same direction and 0 for perpendicular vectors. Unrelated texts often still score above 0. Cosine distance is 1 minus the similarity.",
    },
    {
      id: "results",
      from: "store",
      to: "app",
      title: "Return the nearest texts",
      payload: "\"reset my password\" 0.83",
      variant: "response",
      detail:
        "Scores are only comparable within one model. Pick a cut-off by testing on your own data, not by guessing a universal threshold.",
    },
  ],
};
