import type { FlowDefinition } from "../../../lib/flow/types";

/** Backend roadmap → Search Engines. */
export const elasticsearchQuery: FlowDefinition = {
  id: "elasticsearch-query",
  title: "Query then fetch across two shards",
  actors: [
    { id: "client", label: "App server", sublabel: "search client", kind: "server", col: 0, row: 0 },
    { id: "coord", label: "Coordinator", sublabel: "any node", kind: "service", col: 1, row: 0 },
    { id: "shard0", label: "Shard 0", sublabel: "primary copy", kind: "database", col: 2, row: 0 },
    { id: "shard1", label: "Shard 1", sublabel: "replica copy", kind: "database", col: 2, row: 1 },
  ],
  steps: [
    {
      id: "search",
      from: "client",
      to: "coord",
      title: "Send a search",
      payload: "match title: \"wireless mouse\"",
      detail:
        "The request can go to any node. That node coordinates this search: it fans the work out and merges the results.",
    },
    {
      id: "route",
      from: "coord",
      title: "Pick one copy of each shard",
      payload: "2 shards → 2 copies",
      detail:
        "The products index is split into two shards, each with a replica. For each shard, adaptive replica selection picks the copy on the node that has been answering fastest.",
    },
    {
      id: "query-0",
      from: "coord",
      to: "shard0",
      title: "Query phase: ask shard 0",
      payload: "query, size: 10",
      detail: "Every shard gets the same query and is asked for its own best 10 hits. The requests run in parallel.",
    },
    {
      id: "query-1",
      from: "coord",
      to: "shard1",
      title: "Query phase: ask shard 1",
      payload: "query, size: 10",
      detail: "Each shard holds only part of the documents, so every one of them must be searched.",
    },
    {
      id: "match",
      from: "shard0",
      title: "Look up the terms",
      payload: "wireless → docs [3, 8, 41, …]",
      detail:
        "The query text is analyzed into terms such as wireless and mouse. The inverted index maps each term straight to the documents that contain it, so no document has to be scanned.",
    },
    {
      id: "hits-0",
      from: "shard0",
      to: "coord",
      title: "Return ids and scores",
      payload: "top 10: [(41, 7.2), …]",
      variant: "response",
      detail:
        "Matches are scored with BM25 using this shard's own term statistics. Only ids and scores travel back, not the documents.",
    },
    {
      id: "hits-1",
      from: "shard1",
      to: "coord",
      title: "Shard 1 answers too",
      payload: "top 10: [(207, 6.8), …]",
      variant: "response",
      detail: "The slowest shard sets the pace. By default there is no timeout, so the coordinator waits for every shard.",
    },
    {
      id: "merge",
      from: "coord",
      title: "Merge into one ranking",
      payload: "20 hits → global top 10",
      detail:
        "The coordinator sorts all candidates by score and keeps the best 10. Deep pages are costly: page 100 makes every shard return its top 1,000.",
    },
    {
      id: "fetch-0",
      from: "coord",
      to: "shard0",
      title: "Fetch phase: get the winners",
      payload: "fetch docs 41, 8, 3",
      detail: "Now the coordinator asks only for the documents that made the final list.",
    },
    {
      id: "fetch-1",
      from: "coord",
      to: "shard1",
      title: "Fetch from shard 1",
      payload: "fetch docs 207, 95, …",
      detail: "A shard with no winning documents would get no fetch request at all.",
    },
    {
      id: "docs-0",
      from: "shard0",
      to: "coord",
      title: "Return the documents",
      payload: "_source for 41, 8, 3",
      variant: "response",
      detail: "Each shard loads the stored JSON, plus highlights if they were requested.",
    },
    {
      id: "docs-1",
      from: "shard1",
      to: "coord",
      title: "Return the rest",
      payload: "_source for 207, 95, …",
      variant: "response",
      detail: "The coordinator puts the documents back into the merged order.",
    },
    {
      id: "results",
      from: "coord",
      to: "client",
      title: "Send the ranked results",
      payload: "hits: 10 of 1,284, ranked",
      variant: "response",
      detail:
        "The response also counts how many shards answered. By default a failed shard gives partial results, not an error, so check that count.",
    },
  ],
};
